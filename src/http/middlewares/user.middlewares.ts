/** @format */

import { body, check } from "express-validator";
import { envConfigObject } from "../../common/config";
import { USER_FIELDS } from "../db/dtos";
import { UserServiceInstance } from "../services";
class UserMiddleware {
  isUserValidForCreation() {
    return envConfigObject.isValidationEnabled
      ? [
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
        ]
      : [];
  }

  isUserValidForUpdate() {
    return envConfigObject.isValidationEnabled
      ? [
          check(USER_FIELDS.USER_ID).custom(async (id: string) => {
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
        ]
      : [];
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
