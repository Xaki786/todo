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
        new UnExpextedDatabaseError("Error fetching user in update task")
      );
    }

    if (!isUserPresent) {
      return ServiceResult.fail(
        new UserNotFoundError("User not found in updating task")
      );
    }

    try {
      dbTask = await this.taskRepo.getById(
        updateTaskDto.id,
        updateTaskDto.authorId
      );
    } catch (error) {
      return ServiceResult.fail(
        new UnExpextedDatabaseError("Error fetching task in update task")
      );
    }

    if (!dbTask) {
      return ServiceResult.fail(
        new TaskNotFoundError("Task not found in updating task")
      );
    }

    const task = TaskMapper.toDomain(dbTask).getValue();
    task.label = updateTaskDto.label;
    try {
      await this.taskRepo.updateById(task.id, task.taskProps, task.authorId);
    } catch (error) {
      return ServiceResult.fail(
        new UnExpextedDatabaseError("Error updating task")
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
