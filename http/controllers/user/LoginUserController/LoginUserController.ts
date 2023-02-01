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
    switch (result.error.constructor) {
      case UserNotFoundError:
        return this.notFound("Invalid Credentials");

      case UnExpextedDatabaseError:
        return this.internalServerError(result.error.message);

      case PasswordDecryptionError:
        return this.internalServerError("Invalid Credentials");

      case JWTGenerateError:
        return this.internalServerError(result.error.message);

      case InvalidCredentialsError:
        return this.badRequest("Invalid Credentials");

      default:
        return this.internalServerError("Something Went Wrong");
    }
  }
}

export const LoginUserControllerInstance = new LoginUserController(
  LoginUserServiceInstance
);
