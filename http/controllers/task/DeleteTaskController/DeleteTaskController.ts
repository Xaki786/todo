/** @format */

import {
  DeleteTaskServiceInstance,
  IDeleteTaskRequestDto,
  IDeleteTaskResponseDto,
  IService,
  TaskNotFoundError,
  UnExpextedDatabaseError,
  UserNotFoundError,
} from "@application";
import { BaseController } from "@http/controllers/BaseController";
import { UniqueIdGenerator } from "@Infrastructure";

class DeleteTaskController extends BaseController {
  private service: IService<IDeleteTaskRequestDto, IDeleteTaskResponseDto>;
  constructor(
    service: IService<IDeleteTaskRequestDto, IDeleteTaskResponseDto>
  ) {
    super();
    this.service = service;
  }

  protected async executeImplementation(): Promise<any> {
    const deleteTaskDto: IDeleteTaskRequestDto = {
      id: this.request?.params.taskId as UniqueIdGenerator,
      authorId: this.request?.params.userId as UniqueIdGenerator,
    };
    const result = await this.service.execute(deleteTaskDto);
    if (result.success) {
      return this.ok(result.value);
    }
    return this.handleErrors?.(result.error);
  }
}

export const DeleteTaskControllerInstance = new DeleteTaskController(
  DeleteTaskServiceInstance
);
