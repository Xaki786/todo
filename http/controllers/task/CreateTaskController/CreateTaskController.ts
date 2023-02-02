/** @format */

import {
  CreateTaskServiceInstance,
  ICreateTaskRequestDto,
  ICreateTaskResponseDto,
  InvalidTaskData,
  IService,
  UnExpextedDatabaseError,
  UserNotFoundError,
} from "@application";
import { BaseController } from "@http/controllers/BaseController";
import { UniqueIdGenerator } from "@Infrastructure";

class CreateTaskController extends BaseController {
  private service: IService<ICreateTaskRequestDto, ICreateTaskResponseDto>;
  constructor(
    service: IService<ICreateTaskRequestDto, ICreateTaskResponseDto>
  ) {
    super();
    this.service = service;
  }

  protected async executeImplementation(): Promise<any> {
    const createTaskDto: ICreateTaskRequestDto = {
      label: this.request?.body.label,
      authorId: this.request?.params.userId as UniqueIdGenerator,
    };

    const result = await this.service.execute(createTaskDto);

    if (result.success) {
      return this.created(result.value);
    }

    switch (result.error.constructor) {
      case UnExpextedDatabaseError:
        return this.internalServerError(result.error.message);

      case UserNotFoundError:
        return this.notFound(result.error.message);

      case InvalidTaskData:
        return this.badRequest(result.error.message);
      default:
        return this.internalServerError("Something Went Wrong");
    }
  }
}

export const CreateTaskControllerInstance = new CreateTaskController(
  CreateTaskServiceInstance
);
