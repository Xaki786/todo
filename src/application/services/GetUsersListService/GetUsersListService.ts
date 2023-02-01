/** @format */

import { IService } from "@application/interfaces";
import { IUserProps } from "@domain";
import {
  IUserRepo,
  UniqueIdGenerator,
  UserMapper,
  UserRepoInstance,
} from "@Infrastructure";
import { UnExpextedDatabaseError, UserNotFoundError } from "../errors";
import { ServiceResult, ServiceResultType } from "../ServiceResult";
import {
  IGetUsersListRequestDto,
  IGetUsersListResponseDto,
  IUserResponseDto,
} from "./dtos";

class GetUsersListService
  implements IService<IGetUsersListRequestDto, IGetUsersListResponseDto>
{
  private userRepo: IUserRepo;
  constructor(userRepo: IUserRepo) {
    this.userRepo = userRepo;
  }
  async execute(
    getUsersListDto: IGetUsersListRequestDto
  ): Promise<ServiceResultType<IGetUsersListResponseDto>> {
    let dbUsers: IUserProps[] = [];
    try {
      dbUsers = await this.userRepo.getList(
        getUsersListDto.limit,
        getUsersListDto.page
      );
    } catch (error) {
      return ServiceResult.fail(
        new UnExpextedDatabaseError("Error Fetching users list")
      );
    }
    if (dbUsers.length === 0) {
      return ServiceResult.fail(new UserNotFoundError("Users not found"));
    }
    const users = UserMapper.toDomainFromDbBulk(dbUsers);
    const usersResponse: IGetUsersListResponseDto = {
      users: users
        .map((user) => user.getValue())
        .map(
          (user) =>
            ({
              id: user.id as UniqueIdGenerator,
              email: user.userProps.email,
              name: user.userProps.name,
            } as IUserResponseDto)
        ),
    };
    return ServiceResult.success(usersResponse);
  }
}

export const GetUsersListServiceInstance = new GetUsersListService(
  UserRepoInstance
);
