/** @format */

import {
  GetTasksListServiceInstance,
  IGetTasksListRequestDto,
  IGetTasksListResponseDto,
  InvalidTaskData,
  IService,
  UnExpextedDatabaseError,
  UserNotFoundError,
} from "@application";
import { BaseController } from "@http/controllers/BaseController";
import { UniqueIdGenerator } from "@Infrastructure";

class GetTaskListController extends BaseController {
  private service: IService<IGetTasksListRequestDto, IGetTasksListResponseDto>;
  constructor(
    service: IService<IGetTasksListRequestDto, IGetTasksListResponseDto>
  ) {
    super();
    this.service = service;
  }
  protected async executeImplementation(): Promise<any> {
    const getTasksListDto: IGetTasksListRequestDto = {
      limit: Number(this.request?.body.limit || 10),
      page: Number(this.request?.body.page || 1),
      authodId: this.request?.params.userId as UniqueIdGenerator,
    };

    const result = await this.service.execute(getTasksListDto);
    if (result.success) {
      return this.ok(result.value);
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

export const GetTaskListControllerInstance = new GetTaskListController(
  GetTasksListServiceInstance
);
