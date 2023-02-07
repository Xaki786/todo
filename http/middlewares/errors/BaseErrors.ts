/** @format */

import { logger } from "@Infrastructure";
import type { Response } from "express";
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
    console.log("=========================================================");
    logger.log("info", `Debug Message: ${this.debugMessage}`);
    logger.log("info", this.constructor.name);
    console.log("=========================================================");
    logger.log("error", err.stack);
    console.log("=========================================================");
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
    console.log("=========================================================");
    logger.log("info", `Debug Message: ${JSON.stringify(this.debugMessage)}`);
    logger.log("info", this.constructor.name);
    console.log("=========================================================");

    logger.log("error", err.stack);
    console.log("=========================================================");
  }
}