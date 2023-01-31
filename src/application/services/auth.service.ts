/** @format */

import { PasswordManager } from "@common";
import {
  UserRepoInstance,
  UserMapper,
  GenerateAuthToken,
} from "@Infrastructure";
import { ILoginDto } from "../dtos";

class AuthService {
  async login(loginDto: ILoginDto) {
    const dbUser = await UserRepoInstance.getByEmail(loginDto.email);
    if (!dbUser) {
      return null;
    }
    const user = UserMapper.toDomainFromDb(dbUser).getValue();
    const isVerifiedUser = await PasswordManager.verifyPassword(
      loginDto.hash,
      user.userProps.hash
    );
    if (!isVerifiedUser) {
      return null;
    }
    const token = await GenerateAuthToken.generateToken(user.id as string);
    const userWithOutHash = UserMapper.toService(user.userProps);
    return { ...userWithOutHash, token };
  }
}

export const AuthServiceInstance = new AuthService();
