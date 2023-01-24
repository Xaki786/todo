/** @format */

import { ITask } from "../../domain/entities/interfaces";
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
  ): Promise<ITask[]> {
    const dbTasks = await this.client.task.findMany({
      where: {
        authorId: userId,
      },
      skip: limit * (page - 1),
      take: limit,
    });
    return dbTasks;
  }
  async addUserTask(task: ITask, userId: string): Promise<ITask> {
    throw new Error("Method not implemented.");
  }
  async updateUserTaskById(
    taskId: string,
    task: ITask,
    userId: string
  ): Promise<ITask> {
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
  async getUserTaskById(taskId: string, userId: string): Promise<ITask> {
    const dbTask = await this.client.task.findUnique({
      where: { id: taskId, authorId: userId },
    });

    return dbTask as ITask;
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
