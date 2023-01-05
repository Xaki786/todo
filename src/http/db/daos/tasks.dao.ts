/** @format */

import { CreateTaskDto, UpdateTaskDto } from "../dtos";
import { v4 as uuidv4 } from "uuid";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
class TaskDao {
  async getTasksList(limit: number, page: number) {
    const dbTasks = await prisma.task.findMany({
      include: {
        author: true,
      },
    });
    return dbTasks;
  }

  async addTask(task: CreateTaskDto) {
    const dbTask = await prisma.task.create({
      data: {
        id: uuidv4(),
        label: task.label,
        author: {
          connect: {
            email: "mjanwarsi@gmail.com",
          },
        },
      },
    });
    return dbTask;
  }

  async updateTaskById(taskId: string, task: UpdateTaskDto) {
    const dbTask = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        ...task,
      },
    });

    return dbTask;
  }

  async getTaskById(taskId: string) {
    const dbTask = await prisma.task.findUnique({
      where: { id: taskId },
      include: { author: true },
    });

    return dbTask;
  }

  async deleteTaskById(taskId: string) {
    const dbTask = await prisma.task.delete({ where: { id: taskId } });
    if (!dbTask) {
      return null;
    }
    return dbTask;
  }
}

export const TasksDaoInstance = new TaskDao();
