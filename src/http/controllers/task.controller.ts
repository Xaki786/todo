/** @format */

import { Request, Response } from "express";
import { appDevelopmentLogger } from "../../common";
import { TasksServiceInstance } from "../services";
export class TaskController {
  static async fetchTasks(req: Request, res: Response) {
    const tasks = await TasksServiceInstance.getList(100, 0);
    return res.status(200).json({ tasks });
  }

  static async addTask(req: Request, res: Response) {
    const task = await TasksServiceInstance.create(req.body);
    return res.status(200).json({ task });
  }

  static async updateTask(req: Request, res: Response) {
    const { taskId } = req.params;
    const task = await TasksServiceInstance.updateById(taskId, req.body);
    appDevelopmentLogger({ task }, { context: "updateTask" });
    return res.status(204).json({ task });
  }

  static async fetchSingleTask(req: Request, res: Response) {
    const { taskId } = req.params;
    const task = await TasksServiceInstance.getById(taskId);
    appDevelopmentLogger({ task }, { context: "fetchSingleTask" });

    return res.status(200).json({ task });
  }

  static async deleteTask(req: Request, res: Response) {
    const { taskId } = req.params;
    const dbTask = await TasksServiceInstance.deleteById(taskId);
    appDevelopmentLogger({ dbTask }, { context: "deleteTask" });
    if (!dbTask) {
      return res
        .status(404)
        .json({ success: false, error: "Resource Not Found" });
    }
    return res.json({ success: true, message: "deleted" });
  }
}
