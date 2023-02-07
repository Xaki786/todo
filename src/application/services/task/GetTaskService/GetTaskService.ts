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
import { IGetTaskRequestDto, IGetTaskResponseDto } from "./dtos";

class GetTaskService
  implements IService<IGetTaskRequestDto, IGetTaskResponseDto>
{
  private userRepo: IUserRepo;
  private taskRepo: ITaskRepo;
  constructor(userRepo: IUserRepo, taskRepo: ITaskRepo) {
    this.userRepo = userRepo;
    this.taskRepo = taskRepo;
  }

  async execute(
    getTaskDto: IGetTaskRequestDto
  ): Promise<ServiceResultType<IGetTaskResponseDto>> {
    let isUserPresent = false;
    let dbTask: ITaskProps;

    try {
      isUserPresent = await this.userRepo.exists({
        id: getTaskDto.authorId,
      });
    } catch (error) {
      return ServiceResult.fail(
        new UnExpextedDatabaseError(
          ErrorStatusCodes.DATABASE_ERROR,
          "Error fetching user in get task"
        )
      );
    }

    if (!isUserPresent) {
      return ServiceResult.fail(
        new UserNotFoundError(
          ErrorStatusCodes.NOT_FOUND,
          "User not found in get task"
        )
      );
    }

    try {
      dbTask = await this.taskRepo.getById(getTaskDto.id, getTaskDto.authorId);
    } catch (error) {
      return ServiceResult.fail(
        new UnExpextedDatabaseError(
          ErrorStatusCodes.DATABASE_ERROR,
          "Error fetching task"
        )
      );
    }

    if (!dbTask) {
      return ServiceResult.fail(
        new TaskNotFoundError(
          ErrorStatusCodes.NOT_FOUND,
          "Task not found in get task"
        )
      );
    }

    const task = TaskMapper.toDomain(dbTask).getValue();
    return ServiceResult.success({
      id: task.id,
      label: task.taskProps.label,
      authorId: task.taskProps.authorId,
      createdAt: task.taskProps.createdAt as Date,
      updatedAt: task.taskProps.updatedAt as Date,
    });
  }
}
export const GetTaskServiceInstance = new GetTaskService(
  UserRepoInstance,
  TaskRepoInstance
);
