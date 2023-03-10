/** @format */

import type { Response } from "express";
import { logger } from "@Infrastructure";
import { ErrorStatusCodes } from "./ErrorCodes";

interface IResponseError {
  debugMessage?: string;
  sendResponse(response: Response): Response;
  logError(error: Error): void;
}

export class BaseError extends Error implements IResponseError {
  statusCode: number;
  debugMessage?: string;
  constructor(statusCode: number, message: string, debugMessage?: string) {
    super(message);
    this.name = Error.name;
    this.statusCode = statusCode;
    this.debugMessage = debugMessage;
    Error.captureStackTrace(this);
  }
  sendResponse(responseApi: Response): Response {
    return responseApi
      .status(this.statusCode)
      .json({ success: false, error: this.message });
  }
  logError(err: BaseError) {
    logger.log("debug", `Debug Message: ${this.debugMessage}`);
    logger.log("debug", this.constructor.name);
    logger.log("error", err.stack);
  }
}

export class BaseValidationError extends Error implements IResponseError {
  errors: { [key: string]: string };
  debugMessage?: string;
  constructor(errors: { [key: string]: string }, debugMessage?: string) {
    super("Validation Error");
    this.errors = errors;
    this.debugMessage = debugMessage;
    Error.captureStackTrace(this);
  }
  sendResponse(responseApi: Response): Response {
    return responseApi
      .status(ErrorStatusCodes.BAD_REQUEST)
      .json({ success: false, errors: this.errors });
  }
  logError(err: BaseError) {
    logger.log("debug", `Debug Message: ${JSON.stringify(this.debugMessage)}`);
    logger.log("debug", this.constructor.name);
    logger.log("error", err.stack);
  }
}