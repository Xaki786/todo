/** @format */

import {
  GetUserServiceInstance,
  IGetUserRequestDto,
  IGetUserResponseDto,
  IService,
  UnExpextedDatabaseError,
  UserNotFoundError,
} from "@application";
import { UniqueIdGenerator } from "@Infrastructure";
import { BaseController } from "../BaseController";

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
    switch (result.error.constructor) {
      case UnExpextedDatabaseError:
        return this.internalServerError(result.error.message);

      case UserNotFoundError:
        return this.notFound(result.error.message);

      default:
        return this.internalServerError("Something Went Wrong");
    }
  }
}

export const GetUserControllerInstance = new GetUserController(
  GetUserServiceInstance
);
