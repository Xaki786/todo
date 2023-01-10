/** @format */

import { LoginDto, RegisterDto } from "../dtos";
import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from "@prisma/client";
import { appDevelopmentLogger } from "../../../common";

const prisma = new PrismaClient();
class AuthDao {
  async register(user: RegisterDto) {
    appDevelopmentLogger({ user });
    const registeredUser = await prisma.user.create({
      data: {
        id: uuidv4(),
        ...user,
      },
    });
    return registeredUser;
  }

  async login(user: LoginDto) {
    appDevelopmentLogger({ user }, { context: "AuthDao" });
    const loggedInUser = await prisma.user.findUnique({
      where: {
        email: user.email,
        hash: user.hash,
      },
    });
    return loggedInUser;
  }
}
export const AuthDaoInstance = new AuthDao();
