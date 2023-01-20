import { IUserProps } from "../../domain/entities/interfaces";
import { IUserRepo } from "../Interfaces";
import { PrismaClient } from "@prisma/client";

class UserRepo implements IUserRepo {
  private client: PrismaClient;
  constructor() {
    this.client = new PrismaClient();
  }
  async getList(limit: number, page: number): Promise<IUserProps[]> {
    return (await this.client.user.findMany({
      skip: limit * (page - 1),
      take: limit,
    })) as IUserProps[];
  }

  async exists(userId: string): Promise<boolean> {
    const user = await this.client.user.findUnique({ where: { id: userId } });
    if (user) return true;
    return false;
  }

  async userWithSameEmailExists(email: string): Promise<boolean> {
    const user = await this.client.user.findUnique({ where: { email } });
    if (user) return true;
    return false;
  }
  async create(user: IUserProps): Promise<IUserProps> {
    const dbUser = await this.client.user.create({
      data: {
        ...user,
      },
    });
    return dbUser as IUserProps;
  }
  async updateById(id: string, user: IUserProps): Promise<IUserProps> {
    const dbUser = await this.client.user.update({
      where: {
        id,
      },
      data: {
        ...user,
      },
    });

    return dbUser as IUserProps;
  }
  async deleteById(id: string): Promise<any> {
    try {
      const dbUser = await this.client.user.delete({ where: { id } });
      if (!dbUser) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  }
  async getById(id: string): Promise<IUserProps> {
    const dbUser = await this.client.user.findUnique({
      where: { id },
      include: { tasks: true },
    });

    return dbUser as IUserProps;
  }
  async getByEmail(email: string): Promise<IUserProps> {
    const dbUser = await this.client.user.findUnique({
      where: { email },
      include: { tasks: true },
    });

    return dbUser as IUserProps;
  }
}

export const UserRepoInstance = new UserRepo();
