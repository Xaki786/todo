/** @format */

import { getAuthToken } from "../../../http/controllers/utils";
import { exclude, PasswordManager } from "../../common";
import { IUserProps } from "../../domain/entities/interfaces";
import { UserRepoInstance } from "../../Infrastructure";

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
    const dbUser = await UserRepoInstance.create(userProps);
    const token = getAuthToken(dbUser.id as string);
    const userWithOutHash = exclude(dbUser, ["hash"] as never);
    return { ...userWithOutHash, token };
  }
}

export const AuthServiceInstance = new AuthService();
