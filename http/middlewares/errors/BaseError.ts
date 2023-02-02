/** @format */

import type { Response } from "express";

interface IResponseError {
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
