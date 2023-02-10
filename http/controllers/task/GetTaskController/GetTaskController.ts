/** @format */

import { GetTaskServiceInstance, IService } from "@application";
import { IGetTaskRequestDto, IGetTaskResponseDto } from "@application";
import { BaseController } from "@http/controllers/BaseController";
import { UniqueIdGenerator } from "@Infrastructure";

class GetTaskController extends BaseController {
  private service: IService<IGetTaskRequestDto, IGetTaskResponseDto>;

  constructor(service: IService<IGetTaskRequestDto, IGetTaskResponseDto>) {
    super();
    this.service = service;
  }

  protected async executeImplementation(): Promise<any> {
    const getTaskDto: IGetTaskRequestDto = {
      id: this.request?.params.taskId as UniqueIdGenerator,
      authorId: this.request?.params.userId as UniqueIdGenerator,
    };
    const result = await this.service.execute(getTaskDto);
    if (result.success) {
      return this.ok(result.value);
    }
    return this.handleErrors?.(result.error);
  }
}
export const GetTaskControllerInstance = new GetTaskController(
  GetTaskServiceInstance
);
