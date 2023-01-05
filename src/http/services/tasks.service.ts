/** @format */

import { CRUD } from "../../common/interfaces";
import { TasksDaoInstance } from "../db/daos";
import { CreateTaskDto, UpdateTaskDto } from "../db/dtos";

class TasksService implements CRUD {
  async getList(limit: number, page: number) {
    return TasksDaoInstance.getTasksList(limit, page);
  }
  async create(task: CreateTaskDto) {
    return TasksDaoInstance.addTask(task);
  }
  async updateById(id: string, task: UpdateTaskDto) {
    return TasksDaoInstance.updateTaskById(id, task);
  }
  async deleteById(id: string) {
    return TasksDaoInstance.deleteTaskById(id);
  }
  async getById(id: string) {
    return TasksDaoInstance.getTaskById(id);
  }
}

export const TasksServiceInstance = new TasksService();
