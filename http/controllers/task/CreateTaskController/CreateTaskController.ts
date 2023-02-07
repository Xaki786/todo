/** @format */

import {
  CreateTaskServiceInstance,
  ICreateTaskRequestDto,
  ICreateTaskResponseDto,
  IService,
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

   return this.handleErrors?.(result.error);
  }
}

export const CreateTaskControllerInstance = new CreateTaskController(
  CreateTaskServiceInstance
);
