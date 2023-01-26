/** @format */

import {
  ICreateUserDto,
  IDeleteUserDto,
  IGetUsersListDto,
  IUpdateUserDto,
} from "../dtos";
import { appDevelopmentLogger, exclude } from "../../common";
import { Result } from "../../common/ErrorHandling";
import { ISingleEntityCrud } from "../../common/interfaces";
import { User } from "../../domain";
import { UniqueIdGenerator, UserRepoInstance } from "../../Infrastructure";
import { UserMapper } from "../../Infrastructure/mappers";

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
  async create(createUserDto: ICreateUserDto) {
    const userOrError: Result<User> = User.create({ ...createUserDto });
    if (userOrError.isFailure) {
      return null;
    }
    const user = userOrError.getValue();
    const dbUser = await UserRepoInstance.create(
      UserMapper.toDbFromDomain(user)
    );
    return UserMapper.toServiceFromDb(dbUser);
  }
  async updateById(updateUserDto: IUpdateUserDto) {
    const dbUser = await UserRepoInstance.getById(updateUserDto.id);
    const userOrError: Result<User> = User.create({ ...updateUserDto });
    if (userOrError.isFailure) {
      appDevelopmentLogger({ error: userOrError });
      return null;
    }
    const user = userOrError.getValue();
    // const dbUser = await UserRepoInstance.updateById(
    //   updateUserDto.id,
    // );
    return user.userProps;
  }
  async deleteById(deleteUserDto: IDeleteUserDto) {
    return await UserRepoInstance.deleteById(deleteUserDto.id);
  }
  async getById(userId: UniqueIdGenerator) {
    const dbUser = await UserRepoInstance.getById(userId);
    const userOrError = UserMapper.toDomainFromDb(dbUser);
    if (userOrError.isFailure) {
      return null;
    }
    return UserMapper.toServiceFromDb(dbUser);
  }
  async getByEmail(email: string) {
    const dbUser = await UserRepoInstance.getByEmail(email);
    return UserMapper.toDomainFromDb(dbUser);
  }
}

export const UserServiceInstance = new UserService();
