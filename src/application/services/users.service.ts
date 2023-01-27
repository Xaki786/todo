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
    await UserRepoInstance.create(
      UserMapper.toDbFromDomain(user)
    );
    return user;
  }
  async updateById(updateUserDto: IUpdateUserDto) {
    const dbUser = await UserRepoInstance.getById(updateUserDto.id);
    if (!dbUser) {
      return null;
    }
    const user = UserMapper.toDomainFromDb(dbUser).getValue();
    if (updateUserDto.hasOwnProperty("name") && updateUserDto.name) {
      user.name = updateUserDto.name;
    }
    if (updateUserDto.hasOwnProperty("email") && updateUserDto.email) {
      user.email = updateUserDto.email;
    }
    await UserRepoInstance.updateById(user.id, user.userProps);    
    return UserMapper.toService(user.userProps);
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
