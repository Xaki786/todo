/** @format */

import { IUserLogin, IUserProps } from "../../domain/entities/interfaces";
import { IUserRepo } from "../Interfaces";
import { PrismaClient } from "@prisma/client";
import { UniqueIdGenerator } from "../UniqueIdGenerator";

class UserRepo implements IUserRepo {
  private client: PrismaClient;
  constructor() {
    this.client = new PrismaClient();
  }

  async login(user: IUserLogin): Promise<IUserProps> {
    const loggedInUser = await this.client.user.findUnique({
      where: {
        email: user.email,
        hash: user.hash,
      },
    });
    return loggedInUser as IUserProps;
  }

  async getList(limit: number, page: number): Promise<IUserProps[]> {
    return (await this.client.user.findMany({
      skip: limit * (page - 1),
      take: limit,
    })) as IUserProps[];
  }

  async exists(userId: UniqueIdGenerator): Promise<boolean> {
    const user = await this.client.user.findUnique({
      where: { id: userId as string },
    });
    if (user) return true;
    return false;
  }

  async userWithSameEmailExists(email: string): Promise<boolean> {
    const user = await this.client.user.findUnique({ where: { email } });
    if (user) return true;
    return false;
  }
  async create(user: Omit<IUserProps, "tasks">): Promise<IUserProps> {
    const dbUser = await this.client.user.create({
      data: {
        ...user,
        id: user.id as string,
      },
    });
    return dbUser as IUserProps;
  }
  async updateById(
    id: UniqueIdGenerator,
    user: Omit<IUserProps, "tasks">
  ): Promise<IUserProps> {
    const dbUser = await this.client.user.update({
      where: {
        id: id as string,
      },
      data: {
        ...user,
      },
    });

    return dbUser as IUserProps;
  }
  async deleteById(id: UniqueIdGenerator): Promise<any> {
    try {
      const dbUser = await this.client.user.delete({
        where: { id: id as string },
      });
      if (!dbUser) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  }
  async getById(id: UniqueIdGenerator): Promise<IUserProps> {
    const dbUser = await this.client.user.findUnique({
      where: { id: id as string },
      include: { tasks: true },
    });

    return dbUser as IUserProps;
  }
  async getByEmail(email: string): Promise<IUserProps> {
    const dbUser = await this.client.user.findUnique({
      where: { email },
    });

    return dbUser as IUserProps;
  }
}

export const UserRepoInstance = new UserRepo();
