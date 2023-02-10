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
  UserAlreadyExistError,
  UnExpextedDatabaseError,
} from "@application/services";
import { PasswordEncryptionError } from "./errors";
import { ErrorStatusCodes } from "@http";
import { NotificationsAfterUserCreated } from "@Infrastructure/Notifications/";
import { DomainEventsQueue } from "@domain";
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
    let isUserAlreadyPresent = false;

    try {
      isUserAlreadyPresent = await this.userRepo.exists({
        email: registerUserDto.email,
      });
    } catch (error) {
      return ServiceResult.fail(
        new UnExpextedDatabaseError(
          ErrorStatusCodes.DATABASE_ERROR,
          "Database Error",
          `Error Fetching existing user in Register User Service ${
            error as string
          }`
        )
      );
    }

    if (isUserAlreadyPresent) {
      return ServiceResult.fail(
        new UserAlreadyExistError(
          ErrorStatusCodes.BAD_REQUEST,
          "User with same email already exists",
          "User with same email already exists in Register User Service"
        )
      );
    }

    let encryptedPassword = "";
    try {
      encryptedPassword = await PasswordManager.encryptPassword(
        registerUserDto.hash
      );
    } catch (error) {
      return ServiceResult.fail(
        new PasswordEncryptionError(
          ErrorStatusCodes.INTERNAL_SERVER_ERROR,
          "Internal Server Error",
          `Password encryption error in Register User Service ${
            error as string
          }`
        )
      );
    }

    registerUserDto.hash = encryptedPassword;

    const userOrError: Result<User> = User.create(registerUserDto);
    if (userOrError.isFailure) {
      return ServiceResult.fail(
        new InvalidUserDataError(
          ErrorStatusCodes.INTERNAL_SERVER_ERROR,
          "Internal Server Error",
          `Invalid User Data in Register User Service ${userOrError.getError()}`
        )
      );
    }

    const user = userOrError.getValue();

    try {
      await this.userRepo.create(UserMapper.toDbFromDomain(user));
    } catch (error: unknown) {
      return ServiceResult.fail(
        new UnExpextedDatabaseError(
          ErrorStatusCodes.BAD_REQUEST,
          "Database Error",
          `Error Creating user in Register User Service ${error as string}`
        )
      );
    }

    new NotificationsAfterUserCreated();
    DomainEventsQueue.dispatchEntityEvents(user);

    let token = "";

    try {
      token = GenerateAuthToken.generateToken(user.id as string);
    } catch (error) {
      return ServiceResult.fail(
        new JWTGenerateError(
          ErrorStatusCodes.INTERNAL_SERVER_ERROR,
          "Internal Server Error",
          `Token generate error in Register User Service ${error as string}`
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

export const RegisterUserServiceInstance = new RegisterUserService(
  UserRepoInstance
);
