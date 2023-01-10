/** @format */

import { AuthDaoInstance } from "../db/daos";
import { LoginDto, RegisterDto } from "../db/dtos";

class AuthService {
  async login(user: LoginDto) {
    return AuthDaoInstance.login(user);
  }

  async register(user: RegisterDto) {
    return AuthDaoInstance.register(user);
  }
}

export const AuthServiceInstance = new AuthService();
