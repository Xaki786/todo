/** @format */

import { IService } from "@application/interfaces";
import {
  UnExpextedDatabaseError,
  UserNotFoundError,
  TaskNotFoundError,
} from "@application/services";
import {
  ServiceResult,
  ServiceResultType,
} from "@application/services/ServiceResult";
import { ITaskProps } from "@domain";
import { ErrorStatusCodes } from "@http";
import {
  ITaskRepo,
  IUserRepo,
  TaskMapper,
  TaskRepoInstance,
  UserRepoInstance,
} from "@Infrastructure";
import { IUpdateTaskRequestDto, IUpdateTaskResponseDto } from "./dtos";

class UpdateTaskService
  implements IService<IUpdateTaskRequestDto, IUpdateTaskResponseDto>
{
  private userRepo: IUserRepo;
  private taskRepo: ITaskRepo;
  constructor(userRepo: IUserRepo, taskRepo: ITaskRepo) {
    this.taskRepo = taskRepo;
    this.userRepo = userRepo;
  }
  async execute(
    updateTaskDto: IUpdateTaskRequestDto
  ): Promise<ServiceResultType<IUpdateTaskResponseDto>> {
    let isUserPresent = false;
    let dbTask: ITaskProps;

    try {
      isUserPresent = await this.userRepo.exists({
        id: updateTaskDto.authorId,
      });
    } catch (error) {
      return ServiceResult.fail(
        new UnExpextedDatabaseError(
          ErrorStatusCodes.DATABASE_ERROR,
          "Database Error",
          `Error Fetching user in Update Task Service ${error as string}`
        )
      );
    }

    if (!isUserPresent) {
      return ServiceResult.fail(
        new UserNotFoundError(
          ErrorStatusCodes.NOT_FOUND,
          "Invalid Credentials",
          "User not found in update task service"
        )
      );
    }

    try {
      dbTask = await this.taskRepo.getById(
        updateTaskDto.id,
        updateTaskDto.authorId
      );
    } catch (error) {
      return ServiceResult.fail(
        new UnExpextedDatabaseError(
          ErrorStatusCodes.DATABASE_ERROR,
          "Database Error",
          `Error Fetching task in Update Task Service ${error as string}`
        )
      );
    }

    if (!dbTask) {
      return ServiceResult.fail(
        new TaskNotFoundError(
          ErrorStatusCodes.NOT_FOUND,
          "Task not found",
          "Task not found in update task service"
        )
      );
    }

    const task = TaskMapper.toDomain(dbTask).getValue();
    task.label = updateTaskDto.label;
    try {
      await this.taskRepo.updateById(task.id, task.taskProps, task.authorId);
    } catch (error) {
      return ServiceResult.fail(
        new UnExpextedDatabaseError(
          ErrorStatusCodes.DATABASE_ERROR,
          "Database Error",
          "Error updating task in update task service"
        )
      );
    }

    return ServiceResult.success({
      id: task.id,
      label: task.taskProps.label,
      createdAt: task.taskProps.createdAt as Date,
      updatedAt: task.taskProps.updatedAt as Date,
      authorId: task.taskProps.authorId,
    });
  }
}

export const UpdateTaskServiceInstance = new UpdateTaskService(
  UserRepoInstance,
  TaskRepoInstance
);
