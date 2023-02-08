/** @format */

import { ICreateUserRequestDto, ICreateUserResponseDto } from "./dtos";
import { IService } from "@application/interfaces";
import { Result } from "@common";
import { User } from "@domain";
import { IUserRepo, UserMapper, UserRepoInstance } from "@Infrastructure";
import {
  ServiceResult,
  ServiceResultType,
  InvalidUserDataError,
  UnExpextedDatabaseError,
  UserAlreadyExistError,
} from "@application/services";
import { ErrorStatusCodes } from "@http";
import { DomainEventsService } from "@domain/events/DomainEventsService";
import { AfterUserCreated } from "@Infrastructure/Notifications/AfterUserCreated";

class CreateUserService
  implements IService<ICreateUserRequestDto, ICreateUserResponseDto>
{
  private readonly userRepo: IUserRepo;

  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }

  async execute(
    createUserDto: ICreateUserRequestDto
  ): Promise<ServiceResultType<ICreateUserResponseDto>> {
    let isUserAlreadyPresent = false;

    try {
      isUserAlreadyPresent = await this.userRepo.exists({
        email: createUserDto.email,
      });
    } catch (error: unknown) {
      return ServiceResult.fail(
        new UnExpextedDatabaseError(
          ErrorStatusCodes.DATABASE_ERROR,
          "Database Error",
          `Error creating user ${error as string}`
        )
      );
    }

    if (isUserAlreadyPresent) {
      return ServiceResult.fail(
        new UserAlreadyExistError(
          ErrorStatusCodes.BAD_REQUEST,
          "User with same email already exists",
          "Duplicate Email in Create User Service"
        )
      );
    }

    const userOrError: Result<User> = User.create(createUserDto);
    if (userOrError.isFailure) {
      return ServiceResult.fail(
        new InvalidUserDataError(
          ErrorStatusCodes.INTERNAL_SERVER_ERROR,
          "Database Error",
          `Invalid User Data in Domain ${userOrError.getError()}`
        )
      );
    }

    const user = userOrError.getValue();

    try {
      await this.userRepo.create(UserMapper.toDbFromDomain(user));
    } catch (error) {
      return ServiceResult.fail(
        new UnExpextedDatabaseError(
          ErrorStatusCodes.DATABASE_ERROR,
          "Database Error",
          `Error creating user in User create service ${error as string}`
        )
      );
    }
    new AfterUserCreated();
    DomainEventsService.dispatchEntityEvents(user);
    return ServiceResult.success({
      email: user.userProps.email as string,
      id: user.id,
      name: user.userProps.name as string,
    });
  }
}

export const CreateUserServiceInstance = new CreateUserService(
  UserRepoInstance
);
