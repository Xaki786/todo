/** @format */

import { SingleEntityCrud } from "../../common/interfaces";
import { UsersDaoInstance } from "../db/daos/users.dao";
import { CreateUserDto, UpdateUserDto } from "../db/dtos";

class UserService implements SingleEntityCrud {
  getList(limit: number, page: number) {
    return UsersDaoInstance.getUsersList(limit, page);
  }
  create(user: CreateUserDto) {
    return UsersDaoInstance.addUser(user);
  }
  updateById(userId: string, user: UpdateUserDto) {
    return UsersDaoInstance.updateUserById(userId, user);
  }
  deleteById(userId: string) {
    return UsersDaoInstance.deleteUserById(userId);
  }
  getById(userId: string) {
    return UsersDaoInstance.getUserById(userId);
  }
}

export const UserServiceInstance = new UserService();
