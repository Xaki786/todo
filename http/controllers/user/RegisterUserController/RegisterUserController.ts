/** @format */

import {
  IRegisterUserRequestDto,
  IRegisterUserResponseDto,
  IService,
  RegisterUserServiceInstance,
} from "@application";
import { BaseController } from "@http/controllers/BaseController";

class RegisterUserController extends BaseController {
  private service: IService<IRegisterUserRequestDto, IRegisterUserResponseDto>;
  constructor(
    service: IService<IRegisterUserRequestDto, IRegisterUserResponseDto>
  ) {
    super();
    this.service = service;
  }
  protected async executeImplementation(): Promise<any> {
    const registerUserDto = this.request?.body as IRegisterUserRequestDto;
    const result = await this.service.execute(registerUserDto);
    if (result.success) {
      return this.created(result.value);
    }
    return this.handleErrors?.(result.error);
  }
}

export const RegisterUserControllerInstance = new RegisterUserController(
  RegisterUserServiceInstance
);
