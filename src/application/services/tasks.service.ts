/** @format */

import { DependantEntityCrud } from "../../common/interfaces";
import { CreateTaskDto, UpdateTaskDto } from "../../../http/db/dtos";
import { TaskRepoInstance } from "../../Infrastructure/TaskRepository";
import { Task } from "../../domain/entities/Task";
import { ITaskProps, IUserProps } from "../../domain/entities/interfaces";
import { Result } from "../../common/ErrorHandling";
import { TaskMapper, UserMapper } from "../../Infrastructure/mappers";
import { appDevelopmentLogger } from "../../common";
import { UserRepoInstance } from "../../Infrastructure";
import { User } from "../../domain";

class TasksService implements DependantEntityCrud {
  async getList(limit: number, page: number, userId: string) {
    return TaskRepoInstance.getUserTasksList(limit, page, userId);
  }

  async create(taskProps: ITaskProps, userId: string) {
    const dbUser = await UserRepoInstance.getById(userId);
    const user = UserMapper.toDomain(dbUser);
    const taskOrError: Result<Task> = Task.create({
      ...taskProps,
      authorId: userId,
    });

    if (taskOrError.isFailure) {
      return null;
    }
    const task = taskOrError.getValue();
    user.addTask(task);
    const dbTask = await TaskRepoInstance.addUserTask(
      TaskMapper.toDb(task),
      userId
    );
    return TaskMapper.toDomain(dbTask);
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
