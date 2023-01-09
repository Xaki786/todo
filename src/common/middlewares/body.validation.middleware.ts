/** @format */

import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

class BodyValidationMiddleware {
  verifyBodyFieldErrors(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors);
    }
    return next();
  }
}

export const BodyValidationMiddlewareInstance = new BodyValidationMiddleware();
