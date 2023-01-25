/** @format */

export class Result<T> {
  public isSuccess: boolean;
  public isFailure: boolean;
  public error: string | null;
  private _value: T;

  private constructor(isSuccess: boolean, error?: string | null, value?: T) {
    if (isSuccess && error) {
      throw new Error(
        "Invalid operation: A result can not be successful and has error at the same time"
      );
    }

    if (!isSuccess && !error) {
      throw new Error(
        "Invalid operation: A failing result must contain an error"
      );
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error as string;
    this._value = value as T;

    Object.freeze(this);
  }

  public getValue(): T {
    if (this.isFailure) {
      throw new Error("can not retrieve value from failed result");
    }
    return this._value;
  }

  public static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, null, value);
  }

  public static fail<U>(error?: string): Result<U> {
    return new Result(false, error);
  }
}
