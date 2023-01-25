/** @format */

import { Request, Response } from "express";
import { TasksServiceInstance } from "../../src/application";
import { JSON_MESSAGES } from "./utils";
class TaskController {
  async fetchUserTasksList(req: Request, res: Response) {
    const { userId } = req.params;
    const tasks = await TasksServiceInstance.getList(100, 0, userId);
    return res.status(200).json({ success: true, tasks });
  }

  async addUserTask(req: Request, res: Response) {
    const { userId } = req.params;
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
