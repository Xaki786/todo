/** @format */

import { Request, Response } from "express";
import { appDevelopmentLogger } from "../../src/common";
import { TasksServiceInstance } from "../../src/application";
class TaskController {
  async fetchUserTasksList(req: Request, res: Response) {
    const { userId } = req.params;
    const tasks = await TasksServiceInstance.getList(100, 0, userId);
    return res.status(200).json({ tasks });
  }

  async addUserTask(req: Request, res: Response) {
    const { userId } = req.params;
    const task = await TasksServiceInstance.create(req.body, userId);
    return res.status(200).json({ task });
  }

  async updateUserTaskById(req: Request, res: Response) {
    const { taskId, userId } = req.params;
    const task = await TasksServiceInstance.updateById(
      taskId,
      req.body,
      userId
    );
    appDevelopmentLogger({ task }, { context: "updateTask" });
    return res.status(200).json({ task });
  }

  async fetchUserTask(req: Request, res: Response) {
    const { taskId, userId } = req.params;
    const task = await TasksServiceInstance.getById(taskId, userId);
    appDevelopmentLogger({ task }, { context: "fetchSingleTask" });

    return res.status(200).json({ task });
  }

  async deleteUserTask(req: Request, res: Response) {
    const { taskId, userId } = req.params;
    const dbTask = await TasksServiceInstance.deleteById(taskId, userId);
    appDevelopmentLogger({ dbTask }, { context: "deleteTask" });
    if (!dbTask) {
      return res
        .status(404)
        .json({ success: false, error: "Resource Not Found" });
    }
    return res.json({ success: true, message: "deleted" });
  }
}

export const TaskControllerInstance = new TaskController();