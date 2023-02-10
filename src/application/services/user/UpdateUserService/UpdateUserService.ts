/** @format */

import { IService } from "@application/interfaces";
import { IUserProps } from "@domain";
import { IUserRepo, UserMapper, UserRepoInstance } from "@Infrastructure";
import {
  ServiceResult,
  ServiceResultType,
  UnExpextedDatabaseError,
  UserNotFoundError,
} from "@application/services";
import { IUpdateUserRequestDto, IUpdateUserResponseDto } from "./dtos";
import { ErrorStatusCodes } from "@http";

class UpdateUserService
  implements IService<IUpdateUserRequestDto, IUpdateUserResponseDto>
{
  userRepo: IUserRepo;

  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }

  async execute(
    updateUserDto: IUpdateUserRequestDto
  ): Promise<ServiceResultType<IUpdateUserResponseDto>> {
    let dbUser: IUserProps;

    try {
      dbUser = await this.userRepo.getById(updateUserDto.id);
    } catch (error) {
      return ServiceResult.fail(
        new UnExpextedDatabaseError(
          ErrorStatusCodes.DATABASE_ERROR,
          "Database Error",
          `Error Fetching user in Update User Service ${error as string}`
        )
      );
    }

    if (!dbUser) {
      ServiceResult.fail(
        new UserNotFoundError(
          ErrorStatusCodes.NOT_FOUND,
          "Invalid Credentials",
          "User Not Found in Update User Service"
        )
      );
    }

    const user = UserMapper.toDomainFromDb(dbUser).getValue();

    if (updateUserDto.hasOwnProperty("name") && updateUserDto.name) {
      user.name = updateUserDto.name;
    }

    if (updateUserDto.hasOwnProperty("email") && updateUserDto.email) {
      user.email = updateUserDto.email;
    }

    try {
      await this.userRepo.updateById(updateUserDto.id, user.userProps);
    } catch (error) {
      return ServiceResult.fail(
        new UnExpextedDatabaseError(
          ErrorStatusCodes.DATABASE_ERROR,
          "Database Error",
          `Error Updating User in Update User Service ${error as string}`
        )
      );
    }

    return ServiceResult.success({
      id: user.id,
      email: user.userProps.email as string,
      name: user.userProps.name as string,
    });
  }
}

export const UpdateUserServiceInstance = new UpdateUserService(
  UserRepoInstance
);
