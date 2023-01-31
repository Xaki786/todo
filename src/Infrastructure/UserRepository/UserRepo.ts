/** @format */

import { IUserLogin, IUserProps } from "@domain";
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

  async exists({
    id,
    email,
    name,
  }: {
    id?: string;
    name: string;
    email: string;
  }): Promise<boolean> {
    const user = await this.client.user.findMany({
      where: {
        OR: [
          { id: { equals: id } },
          { email: { equals: email } },
          { name: { equals: name } },
        ],
      },
    });
    if (user) return true;
    return false;
  }

  async userWithSameEmailExists(email: string): Promise<boolean> {
    const user = await this.client.user.findUnique({ where: { email } });
    if (user) return true;
    return false;
  }
  async create(user: Omit<IUserProps, "tasks">): Promise<void> {
    await this.client.user.create({
      data: {
        ...user,
        id: user.id as string,
      },
    });
  }
  async updateById(
    id: UniqueIdGenerator,
    user: Omit<IUserProps, "tasks">
  ): Promise<void> {
    await this.client.user.update({
      where: {
        id: id as string,
      },
      data: {
        ...user,
      },
    });
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
    });

    return dbUser as IUserProps;
  }
  async getByEmail(email: string): Promise<IUserProps> {
    const dbUser = await this.client.user.findUnique({
      where: { email },
    });

    return dbUser as IUserProps;
  }
  async deleteAll() {
    const count = await this.client.user.deleteMany();
    return count;
  }
}

export const UserRepoInstance = new UserRepo();
