/** @format */

import { IService } from "@application/interfaces";
import {
  InvalidTaskData,
  ServiceResult,
  ServiceResultType,
  UnExpextedDatabaseError,
  UserNotFoundError,
} from "@application/services";
import { Task } from "@domain";
import { ErrorStatusCodes } from "@http";
import {
  ITaskRepo,
  IUserRepo,
  TaskRepoInstance,
  UserRepoInstance,
} from "@Infrastructure";
import { ICreateTaskRequestDto, ICreateTaskResponseDto } from "./dtos";

class CreateTaskService
  implements IService<ICreateTaskRequestDto, ICreateTaskResponseDto>
{
  private taskRepo: ITaskRepo;
  private userRepo: IUserRepo;

  constructor(userRepo: IUserRepo, taskRepo: ITaskRepo) {
    this.userRepo = userRepo;
    this.taskRepo = taskRepo;
  }

  async execute(
    createTaskDto: ICreateTaskRequestDto
  ): Promise<ServiceResultType<ICreateTaskResponseDto>> {
    let isUserPresent = false;
    try {
      isUserPresent = await this.userRepo.exists({
        id: createTaskDto.authorId,
      });
    } catch (error) {
      return ServiceResult.fail(
        new UnExpextedDatabaseError(
          ErrorStatusCodes.DATABASE_ERROR,
          "Database Error",
          `Error Fetching user in Create Task Service ${error as string}`
        )
      );
    }

    if (!isUserPresent) {
      return ServiceResult.fail(
        new UserNotFoundError(
          ErrorStatusCodes.NOT_FOUND,
          "Invalid Credentials",
          "User not found in creating task service"
        )
      );
    }

    const taskOrError = Task.create(createTaskDto);
    if (taskOrError.isFailure) {
      return ServiceResult.fail(
        new InvalidTaskData(
          ErrorStatusCodes.INTERNAL_SERVER_ERROR,
          "Invternal Service Error",
          `Invalid Task Data in Create Task Service ${taskOrError.getError()}`
        )
      );
    }

    const task = taskOrError.getValue();
    try {
      await this.taskRepo.create(task.taskProps);
    } catch (error) {
      return ServiceResult.fail(
        new UnExpextedDatabaseError(
          ErrorStatusCodes.DATABASE_ERROR,
          "Database Error",
          `Error creating task in create task service ${error}`
        )
      );
    }

    return ServiceResult.success({
      id: task.id,
      authorId: task.authorId,
      label: task.taskProps.label,
    });
  }
}


export const CreateTaskServiceInstance = new CreateTaskService(
  UserRepoInstance,
  TaskRepoInstance
);
