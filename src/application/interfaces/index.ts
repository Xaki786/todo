/** @format */

import { ServiceResultType } from "@application/services";

export interface ISuccessResult<T> {
  readonly success: true;
  readonly value: T;
}

export interface IErrorResult {
  readonly success: false;
  readonly error: Error;
}

export interface IService<RequestDTO, ResponseDTO> {
  execute(
    dto?: RequestDTO
  ): Promise<ServiceResultType<ResponseDTO>> | ServiceResultType<ResponseDTO>;
}
