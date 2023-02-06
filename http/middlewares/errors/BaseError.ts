/** @format */

import type { Response } from "express";
import { ErrorStatusCodes } from "./ErrorCodes";

interface IResponseError {
  sendResponse(response: Response): Response;
}

interface IResponseValidationError {
  sendResponse(response: Response): Response;
}
export class BaseError extends Error implements IResponseError {
  statusCode: number;
  constructor(statusCode: number, message: string) {
    super(message);
    this.name = Error.name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this);
  }
  sendResponse(responseApi: Response): Response {
    return responseApi
      .status(this.statusCode)
      .json({ success: false, error: this.message });
  }
}

export class BaseValidationError
  extends Error
  implements IResponseValidationError
{
  errors: { [key: string]: string };
  constructor(errors: { [key: string]: string }) {
    super("Validation Error");
    this.errors = errors;
    Error.captureStackTrace(this);
  }
  sendResponse(responseApi: Response): Response {
    return responseApi
      .status(ErrorStatusCodes.BAD_REQUEST)
      .json({ success: false, errors: this.errors });
  }
}