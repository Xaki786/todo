/** @format */

import { DependantEntityCrud } from "../../common/interfaces";
import { CreateTaskDto, UpdateTaskDto } from "../dtos";
import { TaskRepoInstance } from "../../Infrastructure/TaskRepository";
import { Task } from "../../domain/entities/Task";
import { ITaskProps } from "../../domain/entities/interfaces";
import { Result } from "../../common/ErrorHandling";
import { TaskMapper, UserMapper } from "../../Infrastructure/mappers";

class TasksService implements DependantEntityCrud {
  async getList(limit: number, page: number, userId: string) {
    try {
      const dbTasks = await TaskRepoInstance.getUserTasksList(
        limit,
        page,
        userId
      );
      const tasksOrErrors = dbTasks.map((dbTask) =>
        TaskMapper.toDomain(dbTask)
      );
      const combinedTasksOrErros = Result.combine(tasksOrErrors);
      if (combinedTasksOrErros.isFailure) {
        return [];
      }
      const tasks: ITaskProps[] = [];
      for (let taskOrError of tasksOrErrors) {
        tasks.push(taskOrError.getValue().taskProps);
      }
      return tasks;
    } catch (error) {
      return [];
    }
  }

  async create(taskProps: ITaskProps, userId: string) {
    const taskOrError: Result<Task> = TaskMapper.toDomain({
      ...taskProps,
      authorId: userId,
    });

    if (taskOrError.isFailure) {
      return null;
    }
    const task = taskOrError.getValue();
    try {
      const dbTask = await TaskRepoInstance.addUserTask(
        TaskMapper.toDb(task),
        userId
      );
      if (!dbTask) {
        return null;
      }
    } catch (error) {
      return null;
    }

    return task;
  }

  async updateById(taskId: string, taskProps: ITaskProps, userId: string) {
    const taskOrError: Result<Task> = Task.create({
      id: taskId,
      ...taskProps,
      authorId: userId,
    });
    if (taskOrError.isFailure) {
      return null;
    }
    const task = taskOrError.getValue();
    const dbTask = await TaskRepoInstance.updateUserTaskById(
      taskId,
      TaskMapper.toDb(task),
      userId
    );
    if (!dbTask) {
      return null;
    }
    return TaskMapper.toDomain(dbTask);
  }
  async deleteById(taskId: string, userId: string): Promise<boolean> {
    const deletedTask = await TaskRepoInstance.deleteUserTaskById(
      taskId,
      userId
    );
    return deletedTask;
  }
  async getById(taskId: string, userId: string) {
    const dbTask = await TaskRepoInstance.getUserTaskById(taskId, userId);
    return dbTask;
  }
}

export const TasksServiceInstance = new TasksService();
