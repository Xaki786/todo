/** @format */

import { NextFunction, Request, Response } from "express";
import { body, check } from "express-validator";
import { appDevelopmentLogger } from "../../src/common";
import { envConfigObject } from "../../src/config";
import { JSON_MESSAGES } from "../controllers/utils";
import { USER_FIELDS } from "../db/dtos";
import { UserServiceInstance } from "../services";
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
      body(USER_FIELDS.EMAIL)
        .isEmail()
        .custom(async (value) => {
          const user = await UserServiceInstance.getByEmail(value);
          if (user) {
            return Promise.reject("Email already in use");
          }
        }),
      body(USER_FIELDS.HASH)
        .isLength({ min: 5 })
        .withMessage("Must include more than 5 characters"),
      body(USER_FIELDS.NAME).optional(),
    ];
    return next();
  }

  async isUserValidForUpdate(req: Request, res: Response, next: NextFunction) {
    appDevelopmentLogger("I was here");
    envConfigObject.isValidationEnabled && [
      check(USER_FIELDS.USER_ID).custom(async (id: string) => {
        appDevelopmentLogger({ id });
        const user = await UserServiceInstance.getById(id);
        if (!user) {
          return Promise.reject("Invalid User Id");
        }
      }),
      body(USER_FIELDS.EMAIL)
        .optional()
        .isEmail()
        .custom(async (email: string) => {
          const user = await UserServiceInstance.getByEmail(email);
          if (user) {
            return Promise.reject("Email already in use");
          }
        }),
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
      ? [
          check(USER_FIELDS.USER_ID).custom(async (id: string) => {
            const user = await UserServiceInstance.getById(id);
            if (!user) {
              return Promise.reject("Invalid User Id");
            }
          }),
        ]
      : [];
  }
}

export const UserMiddlewareInstance = new UserMiddleware();
