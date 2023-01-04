/** @format */

import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { appDevelopmentLogger } from "../../common";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

export class TaskController {
  static async fetchTasks(req: Request, res: Response) {
    const tasks = await prisma.task.findMany({
      include: {
        author: true,
      },
    });
    return res.json({ tasks });
  }

  static async addTask(req: Request, res: Response) {
    const task = req.body;
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
    return res.json({ task: dbTask });
  }

  static async updateTask(req: Request, res: Response) {
    const { label } = req.body;
    const { taskId } = req.params;
    const dbTask = await prisma.task.update({
      where: {
        id: taskId,
      },
      data: {
        label,
      },
    });
    appDevelopmentLogger({ dbTask }, { context: "updateTask" });
    return res.json({ task: dbTask });
  }

  static async fetchSingleTask(req: Request, res: Response) {
    const { taskId } = req.params;
    const dbTask = await prisma.task.findUnique({
      where: { id: taskId },
      include: { author: true },
    });
    appDevelopmentLogger({ dbTask }, { context: "fetchSingleTask" });

    return res.json({ task: dbTask });
  }

  static async deleteTask(req: Request, res: Response) {
    const { taskId } = req.params;
    const dbTask = await prisma.task.delete({ where: { id: taskId } });
    appDevelopmentLogger({ dbTask }, { context: "deleteTask" });
    if (!dbTask) {
      return res
        .status(404)
        .json({ success: false, message: "Resource Not Found" });
    }
    return res.json({ success: true, message: "deleted" });
  }
}
