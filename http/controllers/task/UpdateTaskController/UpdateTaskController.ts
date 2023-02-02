/** @format */

import {
  InvalidTaskData,
  IService,
  IUpdateTaskRequestDto,
  IUpdateTaskResponseDto,
  TaskNotFoundError,
  UnExpextedDatabaseError,
  UpdateTaskServiceInstance,
  UserNotFoundError,
} from "@application";
import { BaseController } from "@http/controllers/BaseController";
import { UniqueIdGenerator } from "@Infrastructure";

class UpdateTaskController extends BaseController {
  private service: IService<IUpdateTaskRequestDto, IUpdateTaskResponseDto>;
  constructor(
    service: IService<IUpdateTaskRequestDto, IUpdateTaskResponseDto>
  ) {
    super();
    this.service = service;
  }

  protected async executeImplementation(): Promise<any> {
    const updateTaskDto: IUpdateTaskRequestDto = {
      id: this.request?.params.taskId as UniqueIdGenerator,
      authorId: this.request?.params.userId as UniqueIdGenerator,
      label: this.request?.body.label,
    };

    const result = await this.service.execute(updateTaskDto);
    if (result.success) {
      return this.ok(result.value);
    }
    return this.handleErrors?.(result.error);
  }
}

export const UpdateTaskControllerInstance = new UpdateTaskController(
  UpdateTaskServiceInstance
);
