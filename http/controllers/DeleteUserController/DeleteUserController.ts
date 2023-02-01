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
import { BaseController } from "../BaseController";

class DeleteUserController extends BaseController {
  service: IService<IDeleteUserRequestDto, IDeleteUserResponseDto>;
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

export const DeleteUserControllerInstance = new DeleteUserController(
  DeleteUserServiceInstance
);
