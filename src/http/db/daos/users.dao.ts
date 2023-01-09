/** @format */

import { CreateUserDto, UpdateUserDto, DeleteUserDto } from "../dtos";
import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from "@prisma/client";
import { appDevelopmentLogger } from "../../../common";

const prisma = new PrismaClient();
class UserDao {
  async getUsersList(limit: number, page: number) {
    const dbUsers = await prisma.user.findMany({});
    return dbUsers;
  }

  async addUser(user: CreateUserDto) {
    const dbUser = await prisma.user.create({
      data: {
        id: uuidv4(),
        ...user,
      },
    });
    return dbUser;
  }

  async updateUserById(userId: string, user: UpdateUserDto) {
    const dbUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ...user,
      },
    });

    return dbUser;
  }

  async getUserById(userId: string) {
    const dbUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { tasks: true },
    });

    return dbUser;
  }

  async deleteUserById(userId: string) {
    try {
      const dbUser = await prisma.user.delete({ where: { id: userId } });
      appDevelopmentLogger({ userId });
      if (!dbUser) {
        return null;
      }
      return dbUser;
    } catch (error) {
      return null;
    }
  }

  async getUserByEmail(email: string) {
    const dbUser = await prisma.user.findUnique({
      where: { email },
    });

    return dbUser;
  }
}

export const UsersDaoInstance = new UserDao();
