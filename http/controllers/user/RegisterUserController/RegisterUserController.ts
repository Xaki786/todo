/** @format */

import {
  InvalidUserDataError,
  IRegisterUserRequestDto,
  IRegisterUserResponseDto,
  IService,
  JWTGenerateError,
  RegisterUserServiceInstance,
  UnExpextedDatabaseError,
  UserAlreadyExistError,
  PasswordEncryptionError,
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
    switch (result.error.constructor) {
      case UserAlreadyExistError:
        return this.badRequest(result.error.message);
      case InvalidUserDataError:
        return this.badRequest(result.error.message);
      case UnExpextedDatabaseError:
        return this.internalServerError(result.error.message);

      case PasswordEncryptionError:
        return this.internalServerError(result.error.message);

      case JWTGenerateError:
        return this.internalServerError(result.error.message);
      default:
        return this.internalServerError("Something Went Wrong");
    }
  }
}

export const RegisterUserControllerInstance = new RegisterUserController(
  RegisterUserServiceInstance
);
