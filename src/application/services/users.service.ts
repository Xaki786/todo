/** @format */

import { UserRepoInstance } from "@Infrastructure";

class UserService {
  async deleteAllUsers() {
    return await UserRepoInstance.deleteAll();
  }
}

export const UserServiceInstance = new UserService();
