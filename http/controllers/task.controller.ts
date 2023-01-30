/** @format */

import { Request, Response } from "express";
import { TasksServiceInstance } from "@application";
import { JSON_MESSAGES } from "./utils";
class TaskController {
  async fetchUserTasksList(req: Request, res: Response) {
    const { userId } = req.params;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: JSON_MESSAGES.BAD_REQUEST });
    }
    const limit = Number(req.body.limit) || 10;
    const page = Number(req.body.page) || 1;
    const tasks = await TasksServiceInstance.getList(limit, page, userId);
    return res.status(200).json({ success: true, tasks });
  }

  async addUserTask(req: Request, res: Response) {
    const { userId } = req.params;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: JSON_MESSAGES.BAD_REQUEST });
    }
    const task = await TasksServiceInstance.create(req.body, userId);
    if (!task) {
      return res
        .status(500)
        .json({ success: false, message: JSON_MESSAGES.INTERNAL_SERVER_ERROR });
    }
    return res.status(200).json({ success: true, task });
  }

  async updateUserTaskById(req: Request, res: Response) {
    const { taskId, userId } = req.params;
    if (!userId || !taskId) {
      return res
        .status(400)
        .json({ success: false, message: JSON_MESSAGES.BAD_REQUEST });
    }
    const task = await TasksServiceInstance.updateById(
      taskId,
      req.body,
      userId
    );
    if (!task) {
      return res
        .status(400)
        .json({ success: false, message: JSON_MESSAGES.BAD_REQUEST });
    }
    return res.status(200).json({ success: true, task });
  }

  async fetchUserTask(req: Request, res: Response) {
    const { taskId, userId } = req.params;
    if (!userId || !taskId) {
      return res
        .status(400)
        .json({ success: false, message: JSON_MESSAGES.BAD_REQUEST });
    }
    const task = await TasksServiceInstance.getById(taskId, userId);
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: JSON_MESSAGES.RESOURCE_NOT_FOUND });
    }
    return res.status(200).json({ success: true, task });
  }

  async deleteUserTask(req: Request, res: Response) {
    const { taskId, userId } = req.params;
    if (!userId || !taskId) {
      return res
        .status(400)
        .json({ success: false, message: JSON_MESSAGES.BAD_REQUEST });
    }
    const isDeleted = await TasksServiceInstance.deleteById(taskId, userId);
    if (!isDeleted) {
      return res
        .status(404)
        .json({ success: false, error: "Resource Not Found" });
    }
    return res.json({ success: true, message: "deleted" });
  }
}

export const TaskControllerInstance = new TaskController();
