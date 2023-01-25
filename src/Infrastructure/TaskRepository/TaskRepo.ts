/** @format */

import { ITaskProps } from "../../domain/entities/interfaces";
import { ITaskRepo } from "../Interfaces";
import { PrismaClient } from "@prisma/client";
class TaskRepo implements ITaskRepo {
  private client: PrismaClient;
  constructor() {
    this.client = new PrismaClient();
  }
  async getUserTasksList(
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
  async addUserTask(task: ITaskProps, userId: string): Promise<ITaskProps> {
    const dbTask = await this.client.task.create({
      data: {
        id: task.id as string,
        label: task.label,
        authorId: userId,
      },
    });
    return dbTask;
  }
  async updateUserTaskById(
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
  async getUserTaskById(taskId: string, userId: string): Promise<ITaskProps> {
    const dbTask = await this.client.task.findUnique({
      where: { id: taskId, authorId: userId },
    });

    return dbTask as ITaskProps;
  }
  async deleteUserTaskById(taskId: string, userId: string): Promise<boolean> {
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
