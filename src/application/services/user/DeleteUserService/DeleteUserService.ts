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
import { IDeleteUserRequestDto, IDeleteUserResponseDto } from "./dtos";

class DeleteUserService
  implements IService<IDeleteUserRequestDto, IDeleteUserResponseDto>
{
  userRepo: IUserRepo;
  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }
  async execute(
    deleteUserDto: IDeleteUserRequestDto
  ): Promise<ServiceResultType<IDeleteUserResponseDto>> {
    let dbUser: IUserProps;

    try {
      dbUser = await this.userRepo.getById(deleteUserDto.id);
    } catch (error) {
      return ServiceResult.fail(
        new UnExpextedDatabaseError("Error fetching Entity")
      );
    }

    if (!dbUser) {
      return ServiceResult.fail(new UserNotFoundError("User Not Found"));
    }
    const user = UserMapper.toDomainFromDb(dbUser).getValue();

    try {
      await this.userRepo.deleteById(user.id);
    } catch (error) {
      return ServiceResult.fail(
        new UnExpextedDatabaseError("Error Deleteing user")
      );
    }

    return ServiceResult.success({
      id: user.id,
    });
  }
}

export const DeleteUserServiceInstance = new DeleteUserService(
  UserRepoInstance
);
