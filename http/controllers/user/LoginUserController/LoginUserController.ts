/** @format */

import {
  ILoginUserRequestDto,
  ILoginUserResponseDto,
  IService,
  JWTGenerateError,
  UnExpextedDatabaseError,
  UserNotFoundError,
  PasswordDecryptionError,
  InvalidCredentialsError,
  LoginUserServiceInstance,
} from "@application";
import { BaseController } from "@http/controllers/BaseController";

class LoginUserController extends BaseController {
  private service: IService<ILoginUserRequestDto, ILoginUserResponseDto>;
  constructor(service: IService<ILoginUserRequestDto, ILoginUserResponseDto>) {
    super();
    this.service = service;
  }
  protected async executeImplementation(): Promise<any> {
    const registerUserDto = this.request?.body as ILoginUserRequestDto;
    const result = await this.service.execute(registerUserDto);
    if (result.success) {
      return this.ok(result.value);
    }
    return this.handleErrors?.(result.error);
  }
}

export const LoginUserControllerInstance = new LoginUserController(
  LoginUserServiceInstance
);
