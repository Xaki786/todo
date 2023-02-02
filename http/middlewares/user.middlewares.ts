/** @format */

import { NextFunction, Request, Response } from "express";
import { body, check } from "express-validator";
import { envConfigObject } from "@config";
import { JSON_MESSAGES } from "@http/controllers/utils";
import { USER_FIELDS } from "@http/routes";
class UserMiddleware {
  async isUserValidForCreation(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (!req.body.email || !req.body.hash) {
      return res.status(400).json(JSON_MESSAGES.BAD_REQUEST);
    }
    envConfigObject.isValidationEnabled && [
      body(USER_FIELDS.EMAIL).isEmail(),
      body(USER_FIELDS.HASH)
        .isLength({ min: 5 })
        .withMessage("Must include more than 5 characters"),
      body(USER_FIELDS.NAME).optional(),
    ];
    return next();
  }

  async isUserValidForUpdate(req: Request, res: Response, next: NextFunction) {
    envConfigObject.isValidationEnabled && [
      check(USER_FIELDS.USER_ID),
      body(USER_FIELDS.EMAIL).optional().isEmail(),
      body(USER_FIELDS.HASH)
        .optional()
        .isLength({ min: 5 })
        .withMessage("Must include more than 5 characters"),
      body(USER_FIELDS.NAME),
    ];
    return next();
  }

  isUserValidForDelete() {
    return envConfigObject.isValidationEnabled
      ? [check(USER_FIELDS.USER_ID)]
      : [];
  }
}

export const UserMiddlewareInstance = new UserMiddleware();
