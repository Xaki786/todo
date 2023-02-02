/** @format */

import type { NextFunction, Request, Response } from "express";
import { BaseError } from "./errors/BaseError";

export const errorHandlingMiddleware = async (
  error: BaseError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  error.sendResponse(res);
};
