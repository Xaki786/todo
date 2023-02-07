/** @format */

import { IService } from "@application/interfaces";
import {
  TaskNotFoundError,
  UnExpextedDatabaseError,
  UserNotFoundError,
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
import { IDeleteTaskRequestDto, IDeleteTaskResponseDto } from "./dtos";

class DeleteTaskService
  implements IService<IDeleteTaskRequestDto, IDeleteTaskResponseDto>
{
  private userRepo: IUserRepo;
  private taskRepo: ITaskRepo;
  constructor(userRepo: IUserRepo, taskRepo: ITaskRepo) {
    this.userRepo = userRepo;
    this.taskRepo = taskRepo;
  }

  async execute(
    deleteTaskDto: IDeleteTaskRequestDto
  ): Promise<ServiceResultType<IDeleteTaskResponseDto>> {
    let isUserPresent = false;
    let dbTask: ITaskProps;

    try {
      isUserPresent = await this.userRepo.exists({
        id: deleteTaskDto.authorId,
      });
    } catch (error) {
      return ServiceResult.fail(
        new UnExpextedDatabaseError(
          ErrorStatusCodes.DATABASE_ERROR,
          "Database Error",
          `Error fetching user in delete task Service ${error as string}`
        )
      );
    }

    if (!isUserPresent) {
      return ServiceResult.fail(
        new UserNotFoundError(
          ErrorStatusCodes.NOT_FOUND,
          "Invalid Credentials",
          "User not found in delete task service"
        )
      );
    }

    try {
      dbTask = await this.taskRepo.getById(
        deleteTaskDto.id,
        deleteTaskDto.authorId
      );
    } catch (error) {
      return ServiceResult.fail(
        new UnExpextedDatabaseError(
          ErrorStatusCodes.DATABASE_ERROR,
          "Database Error",
          `Error fetching task in delete task Service ${error as string}`
        )
      );
    }

    if (!dbTask) {
      return ServiceResult.fail(
        new TaskNotFoundError(
          ErrorStatusCodes.NOT_FOUND,
          "Task Not Found",
          "Task not found in delete task service"
        )
      );
    }

    const task = TaskMapper.toDomain(dbTask).getValue();

    try {
      await this.taskRepo.deleteById(deleteTaskDto.id, deleteTaskDto.authorId);
    } catch (error) {
      return ServiceResult.fail(
        new UnExpextedDatabaseError(
          ErrorStatusCodes.DATABASE_ERROR,
          "Database Error",
          "Error deleting task in delete task service"
        )
      );
    }
    return ServiceResult.success({
      id: task.id,
    });
  }
}

export const DeleteTaskServiceInstance = new DeleteTaskService(
  UserRepoInstance,
  TaskRepoInstance
);
