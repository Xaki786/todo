/** @format */

import { getAuthToken } from "../../../http/controllers/utils";
import { exclude, PasswordManager } from "../../common";
import { User } from "../../domain";
import { IUserProps } from "../../domain/entities/interfaces";
import { UserRepoInstance } from "../../Infrastructure";
import { UserMapper } from "../../Infrastructure/mappers";

class AuthService {
  async login(user: { email: string; hash: string }) {
    const dbUser = await UserRepoInstance.getByEmail(user.email);
    if (!dbUser) {
      return null;
    }
    const isVerifiedUser = await PasswordManager.verifyPassword(
      user.hash,
      dbUser.hash
    );
    if (!isVerifiedUser) {
      return null;
    }
    const userWithOutHash = exclude(dbUser, ["hash"] as never);
    const token = getAuthToken(dbUser.id as string);
    return { ...userWithOutHash, token };
  }

  async register(userProps: IUserProps) {
    const isUserWithSameEmailPresent =
      await UserRepoInstance.userWithSameEmailExists(userProps.email);
    if (isUserWithSameEmailPresent) {
      return null;
    }
    userProps.hash = await PasswordManager.encryptPassword(userProps.hash);
    const user = User.create(userProps);
    const dbUser = await UserRepoInstance.create(UserMapper.toDb(user));
    const token = getAuthToken(dbUser.id as string);
    return { ...UserMapper.toDomain(dbUser), token };
  }
}

export const AuthServiceInstance = new AuthService();
