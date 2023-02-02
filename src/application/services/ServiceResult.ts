/** @format */

import { IErrorResult, ISuccessResult } from "@application/interfaces";
export type ServiceResultType<T> = ISuccessResult<T> | IErrorResult;
export abstract class ServiceResult {
  public static success<T>(value: T): ISuccessResult<T> {
    return new SuccessResult(value);
  }

  public static fail(error: Error) {
    return new ErrorResult(error);
  }
}

class SuccessResult<T> implements ISuccessResult<T> {
  readonly success = true;
  public readonly value: T;
  constructor(value: T) {
    this.value = value;
  }
}

class ErrorResult implements IErrorResult {
  readonly success = false;
  readonly error: Error;
  constructor(error: Error) {
    this.error = error;
  }
}
