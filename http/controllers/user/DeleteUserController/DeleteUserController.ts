/** @format */

import {
  DeleteUserServiceInstance,
  IDeleteUserRequestDto,
  IDeleteUserResponseDto,
  IService,
  UnExpextedDatabaseError,
  UserNotFoundError,
} from "@application";
import { UniqueIdGenerator } from "@Infrastructure";
import { BaseController } from "@http/controllers/BaseController";

class DeleteUserController extends BaseController {
  private service: IService<IDeleteUserRequestDto, IDeleteUserResponseDto>;
  constructor(
    service: IService<IDeleteUserRequestDto, IDeleteUserResponseDto>
  ) {
    super();
    this.service = service;
  }

  protected async executeImplementation(): Promise<any> {
    const deleteUseDto: IDeleteUserRequestDto = {
      id: this.request?.params.userId as UniqueIdGenerator,
    };
    const result = await this.service.execute(deleteUseDto);
    if (result.success) {
      return this.ok(result.value);
    }

    return this.handleErrors?.(result.error);
  }
}

export const DeleteUserControllerInstance = new DeleteUserController(
  DeleteUserServiceInstance
);
