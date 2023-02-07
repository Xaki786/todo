/** @format */

import {
  GetUserServiceInstance,
  IGetUserRequestDto,
  IGetUserResponseDto,
  IService,
} from "@application";
import { UniqueIdGenerator } from "@Infrastructure";
import { BaseController } from "@http/controllers/BaseController";

class GetUserController extends BaseController {
  private service: IService<IGetUserRequestDto, IGetUserResponseDto>;

  constructor(service: IService<IGetUserRequestDto, IGetUserResponseDto>) {
    super();
    this.service = service;
  }

  protected async executeImplementation(): Promise<any> {
    const getUserDto: IGetUserRequestDto = {
      id: this.request?.params.userId as UniqueIdGenerator,
    };
    const result = await this.service.execute(getUserDto);
    if (result.success) {
      return this.ok(result.value);
    }
    return this.handleErrors?.(result.error);
  }
}

export const GetUserControllerInstance = new GetUserController(
  GetUserServiceInstance
);
