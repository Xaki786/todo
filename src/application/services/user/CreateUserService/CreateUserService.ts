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
    const isUserAlreadyPresent = await this.userRepo.exists({
      email: createUserDto.email,
    });
    if (isUserAlreadyPresent) {
      return ServiceResult.fail(
        new UserAlreadyExistError("User with same email already exists")
      );
    }
    const userOrError: Result<User> = User.create(createUserDto);
    if (userOrError.isFailure) {
      return ServiceResult.fail(new InvalidUserDataError("Invalid User Data"));
    }
    const user = userOrError.getValue();
    try {
      await this.userRepo.create(UserMapper.toDbFromDomain(user));
    } catch (error: unknown) {
      return ServiceResult.fail(new UnExpextedDatabaseError(error as string));
    }
    return ServiceResult.success({
      email: user.email,
      id: user.id,
      name: user.name,
    });
  }
}

export const CreateUserServiceInstance = new CreateUserService(
  UserRepoInstance
);
