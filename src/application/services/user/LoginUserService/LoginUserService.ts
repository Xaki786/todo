/** @format */

import { ILoginUserRequestDto, ILoginUserResponseDto } from "./dtos";
import { IService } from "@application/interfaces";
import { PasswordManager } from "@common";
import { IUserProps } from "@domain";
import {
  IUserRepo,
  UserMapper,
  UserRepoInstance,
  GenerateAuthToken,
} from "@Infrastructure";
import {
  ServiceResult,
  ServiceResultType,
  JWTGenerateError,
  UnExpextedDatabaseError,
  UserNotFoundError,
  PasswordDecryptionError,
  InvalidCredentialsError,
} from "@application/services";

import { ErrorStatusCodes } from "@http";

class LoginUserService
  implements IService<ILoginUserRequestDto, ILoginUserResponseDto>
{
  private readonly userRepo: IUserRepo;
  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }
  async execute(
    loginUserDto: ILoginUserRequestDto
  ): Promise<ServiceResultType<ILoginUserResponseDto>> {
    let dbUser: IUserProps;

    try {
      dbUser = await this.userRepo.getByEmail(loginUserDto.email);
    } catch (error) {
      return ServiceResult.fail(
        new UnExpextedDatabaseError(
          ErrorStatusCodes.DATABASE_ERROR,
          "Error Fetching User"
        )
      );
    }

    if (!dbUser) {
      return ServiceResult.fail(
        new UserNotFoundError(ErrorStatusCodes.NOT_FOUND, "User Not Found")
      );
    }

    const user = UserMapper.toDomainFromDb(dbUser).getValue();
    let isVerifiedUser = false;

    try {
      isVerifiedUser = await PasswordManager.verifyPassword(
        loginUserDto.hash,
        user.userProps.hash
      );
    } catch (error) {
      return ServiceResult.fail(
        new PasswordDecryptionError(
          ErrorStatusCodes.INTERNAL_SERVER_ERROR,
          error as string
        )
      );
    }

    if (!isVerifiedUser) {
      return ServiceResult.fail(
        new InvalidCredentialsError(
          ErrorStatusCodes.UNAUTHORIZED,
          "Invalid Credentials"
        )
      );
    }

    let token = "";
    try {
      token = GenerateAuthToken.generateToken(user.id as string);
    } catch (error) {
      return ServiceResult.fail(
        new JWTGenerateError(
          ErrorStatusCodes.INTERNAL_SERVER_ERROR,
          error as string
        )
      );
    }

    return ServiceResult.success({
      email: user.userProps.email,
      id: user.id,
      token: token,
    });
  }
}

export const LoginUserServiceInstance = new LoginUserService(UserRepoInstance);
