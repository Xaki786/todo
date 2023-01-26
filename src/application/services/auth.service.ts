/** @format */

import { getAuthToken } from "../../../http/controllers/utils";
import { exclude, PasswordManager } from "../../common";
import { User } from "../../domain";
import { IUserProps } from "../../domain/entities/interfaces";
import { UserRepoInstance } from "../../Infrastructure";
import { UserMapper } from "../../Infrastructure/mappers";
import { ILoginDto, IRegisterDto } from "../dtos";

class AuthService {
  async login(loginDto: ILoginDto) {
    const dbUser = await UserRepoInstance.getByEmail(loginDto.email);
    if (!dbUser) {
      return null;
    }
    const isVerifiedUser = await PasswordManager.verifyPassword(
      loginDto.hash,
      dbUser.hash
    );
    if (!isVerifiedUser) {
      return null;
    }
    const userWithOutHash = exclude(dbUser, ["hash"] as never);
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
    const dbUser = await UserRepoInstance.create(
      UserMapper.toDbFromDomain(user)
    );
    const token = getAuthToken(dbUser.id as string);
    return { ...UserMapper.toServiceFromDb(dbUser), token };
  }
}

export const AuthServiceInstance = new AuthService();
