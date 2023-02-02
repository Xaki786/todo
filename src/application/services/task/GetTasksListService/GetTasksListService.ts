/** @format */

import { IService } from "@application/interfaces";
import {
  UnExpextedDatabaseError,
  UserNotFoundError,
  InvalidTaskData,
} from "@application/services";
import {
  ServiceResult,
  ServiceResultType,
} from "@application/services/ServiceResult";
import { Result } from "@common";
import { ITaskProps } from "@domain";
import { ErrorStatusCodes } from "@http";
import {
  ITaskRepo,
  IUserRepo,
  TaskMapper,
  TaskRepoInstance,
  UserRepoInstance,
} from "@Infrastructure";

import {
  IGetTasksListRequestDto,
  IGetTasksListResponseDto,
  ITaskResponseDto,
} from "./dtos";

class GetTasksListService
  implements IService<IGetTasksListRequestDto, IGetTasksListResponseDto>
{
  private userRepo: IUserRepo;
  private taskRepo: ITaskRepo;
  constructor(userRepo: IUserRepo, taskRepo: ITaskRepo) {
    this.taskRepo = taskRepo;
    this.userRepo = userRepo;
  }

  async execute(
    getTaskListDto: IGetTasksListRequestDto
  ): Promise<ServiceResultType<IGetTasksListResponseDto>> {
    let isUserPresent = false;
    try {
      isUserPresent = await this.userRepo.exists({
        id: getTaskListDto.authodId,
      });
    } catch (error) {
      return ServiceResult.fail(
        new UnExpextedDatabaseError(
          ErrorStatusCodes.DATABASE_ERROR,
          "Error fetching user in tasks service"
        )
      );
    }
    if (!isUserPresent) {
      return ServiceResult.fail(
        new UserNotFoundError(
          ErrorStatusCodes.NOT_FOUND,
          "User not found in tasks service"
        )
      );
    }

    let dbTasks: ITaskProps[] = [];
    try {
      dbTasks = await this.taskRepo.getList(
        getTaskListDto.limit,
        getTaskListDto.page,
        getTaskListDto.authodId as string
      );
    } catch (error) {
      return ServiceResult.fail(
        new UnExpextedDatabaseError(
          ErrorStatusCodes.DATABASE_ERROR,
          "Error fetching tasks list"
        )
      );
    }
    const tasksOrErrors = dbTasks.map((dbTask) => TaskMapper.toDomain(dbTask));
    const combinedTasksOrErros = Result.combine(tasksOrErrors);
    if (combinedTasksOrErros.isFailure) {
      return ServiceResult.fail(
        new InvalidTaskData(
          ErrorStatusCodes.BAD_REQUEST,
          combinedTasksOrErros.error as string
        )
      );
    }
    const tasks: ITaskResponseDto[] = tasksOrErrors
      .map((task) => task.getValue())
      .map((task) => ({
        id: task.id,
        authodId: task.taskProps.authorId,
        createdAt: task.taskProps.createdAt as Date,
        updatedAt: task.taskProps.updatedAt as Date,
        label: task.taskProps.label,
      }));
    return ServiceResult.success({ tasks });
  }
}
export const GetTasksListServiceInstance = new GetTasksListService(
  UserRepoInstance,
  TaskRepoInstance
);
