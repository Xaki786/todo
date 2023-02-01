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
        new UnExpextedDatabaseError("Database Fetching Error")
      );
    }

    if (!dbUser) {
      ServiceResult.fail(new UserNotFoundError("User Not Found"));
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
        new UnExpextedDatabaseError("Error Updating User")
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
