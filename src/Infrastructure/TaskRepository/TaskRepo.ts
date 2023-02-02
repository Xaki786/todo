/** @format */

import { ITaskProps } from "@domain";
import { ITaskRepo } from "../Interfaces";
import { PrismaClient } from "@prisma/client";
class TaskRepo implements ITaskRepo {
  private client: PrismaClient;
  constructor() {
    this.client = new PrismaClient();
  }
  async getList(
    limit: number,
    page: number,
    userId: string
  ): Promise<ITaskProps[]> {
    const dbTasks = await this.client.task.findMany({
      where: {
        authorId: userId,
      },
      skip: limit * (page - 1),
      take: limit,
    });
    return dbTasks;
  }
  async create(task: ITaskProps): Promise<void> {
    await this.client.task.create({
      data: {
        id: task.id as string,
        label: task.label,
        authorId: task.authorId as string,
      },
    });
  }

  async exists({
    id,
    label,
  }: {
    id?: string;
    label?: string;
  }): Promise<boolean> {
    const tasks = await this.client.task.findMany({
      where: {
        OR: [{ id: { equals: id } }, { label: { equals: label } }],
      },
    });
    if (tasks.length) return true;
    return false;
  }
  async updateById(
    taskId: string,
    task: ITaskProps,
    userId: string
  ): Promise<ITaskProps> {
    const dbTask = await this.client.task.update({
      where: {
        id: taskId,
        authorId: userId,
      },
      data: {
        ...task,
      },
    });

    return dbTask;
  }
  async getById(taskId: string, userId: string): Promise<ITaskProps> {
    const dbTask = await this.client.task.findUnique({
      where: { id: taskId, authorId: userId },
    });

    return dbTask as ITaskProps;
  }
  async deleteById(taskId: string, userId: string): Promise<boolean> {
    const dbTask = await this.client.task.delete({
      where: { id: taskId, authorId: userId },
    });
    if (!dbTask) {
      return false;
    }
    return true;
  }
}

export const TaskRepoInstance = new TaskRepo();
