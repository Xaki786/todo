/** @format */

import { IGetUsersListDto } from "../dtos";
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
}

export const UserServiceInstance = new UserService();
