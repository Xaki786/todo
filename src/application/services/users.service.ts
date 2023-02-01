/** @format */

import { IDeleteUserDto, IGetUsersListDto } from "../dtos";
import { exclude, ISingleEntityCrud } from "@common";
import {
  UniqueIdGenerator,
  UserRepoInstance,
  UserMapper,
} from "@Infrastructure";

class UserService implements ISingleEntityCrud {
  async getList(getUsersListDto: IGetUsersListDto) {
    const users = await UserRepoInstance.getList(
      getUsersListDto.limit,
      getUsersListDto.page
    );
    if (users.length) {
      const usersWithOutHash = users.map((user) =>
        exclude(user, ["hash"] as never)
      );
      return usersWithOutHash;
    }
    return [];
  }

  async deleteAllUsers() {
    return await UserRepoInstance.deleteAll();
  }
  async deleteById(deleteUserDto: IDeleteUserDto) {
    return await UserRepoInstance.deleteById(deleteUserDto.id);
  }
  async getById(userId: UniqueIdGenerator) {
    const dbUser = await UserRepoInstance.getById(userId);
    const user = UserMapper.toDomainFromDb(dbUser).getValue();
    return UserMapper.toService(user.userProps);
  }
  async getByEmail(email: string) {
    const dbUser = await UserRepoInstance.getByEmail(email);
    const user = UserMapper.toDomainFromDb(dbUser).getValue();
    return UserMapper.toService(user.userProps);
  }
}

export const UserServiceInstance = new UserService();
