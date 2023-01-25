/** @format */

import { DependantEntityCrud } from "../../common/interfaces";
import { CreateTaskDto, UpdateTaskDto } from "../../../http/db/dtos";
import { TaskRepoInstance } from "../../Infrastructure/TaskRepository";

class TasksService implements DependantEntityCrud {
  async getList(limit: number, page: number, userId: string) {
    return TaskRepoInstance.getUserTasksList(limit, page, userId);
  }
  async create(task: CreateTaskDto, userId: string) {
    return TaskRepoInstance.addUserTask(task, userId);
  }
  async updateById(taskId: string, task: UpdateTaskDto, userId: string) {
    return TaskRepoInstance.updateUserTaskById(taskId, task, userId);
  }
  async deleteById(taskId: string, userId: string): Promise<boolean> {
    return TaskRepoInstance.deleteUserTaskById(taskId, userId);
  }
  async getById(taskId: string, userId: string) {
    return TaskRepoInstance.getUserTaskById(taskId, userId);
  }
}

export const TasksServiceInstance = new TasksService();
