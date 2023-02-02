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
        new UnExpextedDatabaseError("Error fetching user in delete task")
      );
    }

    if (!isUserPresent) {
      return ServiceResult.fail(
        new UserNotFoundError("User not found in delete task")
      );
    }

    try {
      dbTask = await this.taskRepo.getById(
        deleteTaskDto.id,
        deleteTaskDto.authorId
      );
    } catch (error) {
      return ServiceResult.fail(
        new UnExpextedDatabaseError("Error fetching task")
      );
    }

    if (!dbTask) {
      return ServiceResult.fail(
        new TaskNotFoundError("Task not found in delete task")
      );
    }

    const task = TaskMapper.toDomain(dbTask).getValue();

    try {
      await this.taskRepo.deleteById(deleteTaskDto.id, deleteTaskDto.authorId);
    } catch (error) {
      return ServiceResult.fail(
        new UnExpextedDatabaseError("Error deleting task")
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
