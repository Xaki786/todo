/** @format */

import {
  GetUsersListServiceInstance,
  IGetUsersListRequestDto,
  IGetUsersListResponseDto,
  IService,
  UnExpextedDatabaseError,
  UserNotFoundError,
} from "@application";
import { BaseController } from "@http/controllers/BaseController";

class GetUsersListController extends BaseController {
  private service: IService<IGetUsersListRequestDto, IGetUsersListResponseDto>;
  constructor(
    service: IService<IGetUsersListRequestDto, IGetUsersListResponseDto>
  ) {
    super();
    this.service = service;
  }

  protected async executeImplementation(): Promise<any> {
    const getUsersListDto: IGetUsersListRequestDto = {
      limit: Number(this.request?.body.limit || 10),
      page: Number(this.request?.body.page || 1),
    };

    const result = await this.service.execute(getUsersListDto);

    if (result.success) {
      return this.ok(result.value);
    }

    return this.handleErrors?.(result.error);
  }
}

export const GetUsersListControllerInstance = new GetUsersListController(
  GetUsersListServiceInstance
);
