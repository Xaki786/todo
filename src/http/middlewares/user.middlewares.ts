/** @format */

import { body } from "express-validator";
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
}

export const UserMiddlewareInstance = new UserMiddleware();
