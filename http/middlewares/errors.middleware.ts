/** @format */

import type { NextFunction, Request, Response } from "express";
import { BaseError } from "./errors/BaseErrors";

export const errorHandlingMiddleware = async (
  error: BaseError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // TODO
  // if enviromnet is development/test then log error to the console
  error.logError(error);
  error.sendResponse(res);
};
