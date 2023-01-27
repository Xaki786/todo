/** @format */

import { Application } from "express";
import { ROUTES_PATHS } from "./utils/RoutesConfig";
import { UserControllerInstance } from "../controllers";
import { CommonRoutesConfig } from "./utils/CommonRoutesConfig";
import { BodyValidationMiddlewareInstance } from "../../src/common/middlewares";
import { AuthMiddlewareInstance, UserMiddlewareInstance } from "../middlewares";

export class UserRoutes extends CommonRoutesConfig {
  constructor(app: Application) {
    super(app, "UserRoutes");
  }
  configureRoutes(): Application {
    this.app
      .route(ROUTES_PATHS.USERS)
      .get(UserControllerInstance.getUsers)
      .post(
        UserMiddlewareInstance.isUserValidForCreation,
        BodyValidationMiddlewareInstance.verifyBodyFieldErrors,
        UserControllerInstance.addUser
      );

    this.app
      .route(ROUTES_PATHS.SINGLE_USER)
      .get(
        AuthMiddlewareInstance.isLoggedIn,
        AuthMiddlewareInstance.isAuthorized,
        UserControllerInstance.getUserById
      )
      .put(
        UserMiddlewareInstance.isUserValidForUpdate,
        BodyValidationMiddlewareInstance.verifyBodyFieldErrors,
        AuthMiddlewareInstance.isLoggedIn,
        AuthMiddlewareInstance.isAuthorized,
        UserControllerInstance.updateUserById
      )
      .delete(
        AuthMiddlewareInstance.isLoggedIn,
        AuthMiddlewareInstance.isAuthorized,
        UserControllerInstance.deleteUserById
      );

    return this.app;
  }
}
