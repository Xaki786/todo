/** @format */

import { getAuthToken } from "@http/controllers/utils";
import { PasswordManager } from "@common";
import { User } from "@domain";
import { UserRepoInstance, UserMapper } from "@Infrastructure";
import { ILoginDto, IRegisterDto } from "../dtos";

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
    const userWithOutHash = UserMapper.toService(user.userProps);
    const token = getAuthToken(dbUser.id as string);
    return { ...userWithOutHash, token };
  }

  async register(registerDto: IRegisterDto) {
    const isUserWithSameEmailPresent =
      await UserRepoInstance.userWithSameEmailExists(registerDto.email);
    if (isUserWithSameEmailPresent) {
      return null;
    }
    registerDto.hash = await PasswordManager.encryptPassword(registerDto.hash);
    const userOrError = User.create(registerDto);
    if (userOrError.isFailure) {
      return null;
    }
    const user = userOrError.getValue();
    await UserRepoInstance.create(UserMapper.toDbFromDomain(user));
    const token = getAuthToken(user.id as string);
    return { ...UserMapper.toService(user.userProps), token };
  }
}

export const AuthServiceInstance = new AuthService();
