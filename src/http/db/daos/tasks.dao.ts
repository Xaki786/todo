/** @format */

import { CreateTaskDto, UpdateTaskDto } from "../dtos";
import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from "@prisma/client";
import { appDevelopmentLogger } from "../../../common";

const prisma = new PrismaClient();
class TaskDao {
  async getUserTasksList(limit: number, page: number, userId: string) {
    const dbTasks = await prisma.task.findMany({
      where: {
        authorId: userId,
      },
    });
    return dbTasks;
  }

  async addUserTask(task: CreateTaskDto, userId: string) {
    const dbTask = await prisma.task.create({
      data: {
        id: uuidv4(),
        label: task.label,
        authorId: userId,
      },
    });
    return dbTask;
  }

  async updateUserTaskById(
    taskId: string,
    task: UpdateTaskDto,
    userId: string
  ) {
    appDevelopmentLogger({ task }, { context: "updateUserTaskById" });
    const dbTask = await prisma.task.update({
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

  async getUserTaskById(taskId: string, userId: string) {
    const dbTask = await prisma.task.findUnique({
      where: { id: taskId, authorId: userId },
    });

    return dbTask;
  }

  async deleteUserTaskById(taskId: string, userId: string) {
    const dbTask = await prisma.task.delete({
      where: { id: taskId, authorId: userId },
    });
    if (!dbTask) {
      return null;
    }
    return dbTask;
  }
}

export const TasksDaoInstance = new TaskDao();
