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
        new UnExpextedDatabaseError("Error Fetching User in creating task")
      );
    }
    if (!isUserPresent) {
      return ServiceResult.fail(
        new UserNotFoundError("User not found in creating task")
      );
    }
    const taskOrError = Task.create(createTaskDto);
    if (taskOrError.isFailure) {
      return ServiceResult.fail(
        new InvalidTaskData(taskOrError.error as string)
      );
    }
    const task = taskOrError.getValue();
    try {
      await this.taskRepo.create(task.taskProps);
    } catch (error) {
      return ServiceResult.fail(
        new UnExpextedDatabaseError("Error creating task")
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
