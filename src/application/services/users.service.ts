/** @format */

import { exclude } from "../../common";
import { SingleEntityCrud } from "../../common/interfaces";
import { User } from "../../domain";
import { IUserProps } from "../../domain/entities/interfaces";
import { UniqueIdGenerator, UserRepoInstance } from "../../Infrastructure";
import { UserMapper } from "../../Infrastructure/mappers";

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
    const user = User.create(userProps);
    const dbUser = await UserRepoInstance.create(UserMapper.toDb(user));
    return UserMapper.toDomain(dbUser);
  }
  async updateById(userId: UniqueIdGenerator, userProps: IUserProps) {
    const user = User.create({ id: userId, ...userProps });
    const dbUser = await UserRepoInstance.updateById(
      user.id,
      UserMapper.toDb(user)
    );
    return UserMapper.toDomain(dbUser);
  }
  deleteById(userId: UniqueIdGenerator) {
    return UserRepoInstance.deleteById(userId);
  }
  async getById(userId: UniqueIdGenerator) {
    const dbUser = await UserRepoInstance.getById(userId);
    return UserMapper.toDomain(dbUser);
  }
  async getByEmail(email: string) {
    const dbUser = await UserRepoInstance.getByEmail(email);
    return UserMapper.toDomain(dbUser);
  }
}

export const UserServiceInstance = new UserService();
