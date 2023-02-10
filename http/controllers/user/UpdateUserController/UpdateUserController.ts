/** @format */

import {
  IService,
  IUpdateUserRequestDto,
  IUpdateUserResponseDto,
  UpdateUserServiceInstance,
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

    return this.handleErrors?.(result.error);
  }
}

export const UpdateUserControllerInstance = new UpdateUserController(
  UpdateUserServiceInstance
);
