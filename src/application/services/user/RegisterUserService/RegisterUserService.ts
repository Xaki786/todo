/** @format */

import { IRegisterUserRequestDto, IRegisterUserResponseDto } from "./dtos";
import { IService } from "@application/interfaces";
import { PasswordManager, Result } from "@common";
import { User } from "@domain";
import {
  IUserRepo,
  UserMapper,
  UserRepoInstance,
  GenerateAuthToken,
} from "@Infrastructure";
import {
  ServiceResult,
  ServiceResultType,
  InvalidUserDataError,
  JWTGenerateError,
  UnExpextedDatabaseError,
  UserAlreadyExistError,
} from "@application/services";
import { PasswordEncryptionError } from "./errors";
class RegisterUserService
  implements IService<IRegisterUserRequestDto, IRegisterUserResponseDto>
{
  private readonly userRepo: IUserRepo;
  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }
  async execute(
    registerUserDto: IRegisterUserRequestDto
  ): Promise<ServiceResultType<IRegisterUserResponseDto>> {
    const isUserAlreadyPresent = await this.userRepo.exists({
      email: registerUserDto.email,
    });
    if (isUserAlreadyPresent) {
      return ServiceResult.fail(
        new UserAlreadyExistError("User with same email already exists!!")
      );
    }
    let encryptedPassword = "";
    try {
      encryptedPassword = await PasswordManager.encryptPassword(
        registerUserDto.hash
      );
    } catch (error) {
      return ServiceResult.fail(new PasswordEncryptionError(error as string));
    }
    registerUserDto.hash = encryptedPassword;
    const userOrError: Result<User> = User.create(registerUserDto);
    if (userOrError.isFailure) {
      return ServiceResult.fail(new InvalidUserDataError("Invalid User Data"));
    }
    const user = userOrError.getValue();
    try {
      await this.userRepo.create(UserMapper.toDbFromDomain(user));
    } catch (error: unknown) {
      return ServiceResult.fail(new UnExpextedDatabaseError(error as string));
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

export const RegisterUserServiceInstance = new RegisterUserService(
  UserRepoInstance
);
