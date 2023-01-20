/** @format */

import { exclude } from "../../src/common";
import { SingleEntityCrud } from "../../src/common/interfaces";
import { User } from "../../src/domain";
import { IUserProps } from "../../src/domain/entities/interfaces";
import { UserRepoInstance } from "../../src/Infrastructure";
import { UserMapper } from "../../src/Infrastructure/mappers";

class UserService implements SingleEntityCrud {
  async getList(limit: number, page: number) {
    const users = await UserRepoInstance.getList(limit, page);
    if (users.length) {
      const usersWithOutHash = users.map((user) =>
        exclude(user, ["hash"] as never)
      );
      return usersWithOutHash;
    }
    return [];
  }
  async create(userProps: IUserProps) {
    const dbUser = await UserRepoInstance.create(userProps);
    const user = UserMapper.toDomain(dbUser);
    const userWithOutHash = exclude(user, ["hash"] as never);
    return userWithOutHash;
  }
  async updateById(userId: string, userProps: IUserProps) {
    const dbUser = await UserRepoInstance.updateById(userId, userProps);
    const user = User.create(dbUser);
    const userWithOutHash = exclude(user, ["hash"] as never);
    return userWithOutHash;
  }
  deleteById(userId: string) {
    return UserRepoInstance.deleteById(userId);
  }
  async getById(userId: string) {
    const dbUser = await UserRepoInstance.getById(userId);
    const user = User.create(dbUser);
    const userWithOutHash = exclude(user, ["hash"] as never);
    return userWithOutHash;
  }
  async getByEmail(email: string) {
    const dbUser = await UserRepoInstance.getByEmail(email);
    const user = User.create(dbUser);
    const userWithOutHash = exclude(user, ["hash"] as never);
    return userWithOutHash;
  }
}

export const UserServiceInstance = new UserService();
