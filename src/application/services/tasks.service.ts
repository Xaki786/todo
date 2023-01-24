/** @format */

import { DependantEntityCrud } from "../../common/interfaces";
import { TasksDaoInstance } from "../../../http/db/daos";
import { CreateTaskDto, UpdateTaskDto } from "../../../http/db/dtos";

class TasksService implements DependantEntityCrud {
  async getList(limit: number, page: number, userId: string) {
    return TasksDaoInstance.getUserTasksList(limit, page, userId);
  }
  async create(task: CreateTaskDto, userId: string) {
    return TasksDaoInstance.addUserTask(task, userId);
  }
  async updateById(taskId: string, task: UpdateTaskDto, userId: string) {
    return TasksDaoInstance.updateUserTaskById(taskId, task, userId);
  }
  async deleteById(taskId: string, userId: string) {
    return TasksDaoInstance.deleteUserTaskById(taskId, userId);
  }
  async getById(taskId: string, userId: string) {
    return TasksDaoInstance.getUserTaskById(taskId, userId);
  }
}

export const TasksServiceInstance = new TasksService();
