/** @format */

import { BaseController } from "@http/controllers/BaseController";
import {
  ICreateUserRequestDto,
  IService,
  ICreateUserResponseDto,
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
    return this.handleErrors?.(result.error);
  }
}

export const CreateUserControllerInstance = new CreateUserController(
  CreateUserServiceInstance
);
