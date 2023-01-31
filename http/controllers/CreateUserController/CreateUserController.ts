/** @format */

import { BaseController } from "../BaseController";
import {
  ICreateUserRequestDto,
  IService,
  ICreateUserResponseDto,
  InvalidUserDataError,
  UserAlreadyExistError,
  UnExpextedDatabaseError,
  CreateUserServiceInstance,
} from "@application";

class CreateUserController extends BaseController {
  private service: IService<ICreateUserRequestDto, ICreateUserResponseDto>;
  constructor(
    service: IService<ICreateUserRequestDto, ICreateUserResponseDto>
  ) {
    super();
    this.service = service;
  }
  protected async executeImplementation(): Promise<any> {
    const createUserDto = this.request?.body as ICreateUserRequestDto;
    const result = await this.service.execute(createUserDto);
    if (result.success) {
      return this.created(result.value);
    }
    switch (result.error.constructor) {
      case UserAlreadyExistError:
        return this.badRequest(result.error.message);
      case InvalidUserDataError:
        return this.badRequest(result.error.message);
      case UnExpextedDatabaseError:
        return this.internalServerError(result.error.message);

      default:
        return this.internalServerError("Something Went Wrong");
    }
  }
}

export const CreateUserControllerInstance = new CreateUserController(
  CreateUserServiceInstance
);
