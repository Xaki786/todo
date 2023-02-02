/** @format */

import {
  IService,
  IUpdateUserRequestDto,
  IUpdateUserResponseDto,
  UnExpextedDatabaseError,
  UpdateUserServiceInstance,
  UserNotFoundError,
} from "@application";
import { UniqueIdGenerator } from "@Infrastructure";
import { BaseController } from "@http/controllers/BaseController";

class UpdateUserController extends BaseController {
  private service: IService<IUpdateUserRequestDto, IUpdateUserResponseDto>;
  constructor(
    service: IService<IUpdateUserRequestDto, IUpdateUserResponseDto>
  ) {
    super();
    this.service = service;
  }

  protected async executeImplementation(): Promise<any> {
    const updateUserDto: IUpdateUserRequestDto = {
      id: this.request?.params.userId as UniqueIdGenerator,
      email: this.request?.body.email,
      name: this.request?.body.name,
    };

    const result = await this.service.execute(updateUserDto);

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

export const UpdateUserControllerInstance = new UpdateUserController(
  UpdateUserServiceInstance
);
