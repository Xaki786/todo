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
} from "@application/services";

import { PasswordDecryptionError, InvalidCredentialsError } from "./errors";

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
      return ServiceResult.fail(new UnExpextedDatabaseError(error as string));
    }

    if (!dbUser) {
      return ServiceResult.fail(new UserNotFoundError("User Not Found"));
    }

    const user = UserMapper.toDomainFromDb(dbUser).getValue();
    let isVerifiedUser = false;

    try {
      isVerifiedUser = await PasswordManager.verifyPassword(
        loginUserDto.hash,
        user.userProps.hash
      );
    } catch (error) {
      return ServiceResult.fail(new PasswordDecryptionError(error as string));
    }

    if (!isVerifiedUser) {
      return ServiceResult.fail(
        new InvalidCredentialsError("Invalid Credentials")
      );
    }

    let token = "";
    try {
      token = GenerateAuthToken.generateToken(user.id as string);
    } catch (error) {
      return ServiceResult.fail(new JWTGenerateError(error as string));
    }

    return ServiceResult.success({
      email: user.userProps.email,
      id: user.id,
      token: token,
    });
  }
}

export const LoginUserServiceInstance = new LoginUserService(UserRepoInstance);
