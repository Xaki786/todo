/** @format */

import { Application } from "express";
import { ROUTES_PATHS } from "./utils/RoutesConfig";
import {
  DeleteUserControllerInstance,
  UserControllerInstance,
  CreateUserControllerInstance,
  UpdateUserControllerInstance,
  GetUserControllerInstance,
} from "@http/controllers";
import { CommonRoutesConfig } from "./utils/CommonRoutesConfig";
import { BodyValidationMiddlewareInstance } from "@common";
import {
  AuthMiddlewareInstance,
  UserMiddlewareInstance,
} from "@http/middlewares";

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
        (req, res) => CreateUserControllerInstance.execute(req, res)
      );

    this.app
      .route(ROUTES_PATHS.SINGLE_USER)
      .get(
        AuthMiddlewareInstance.isLoggedIn,
        AuthMiddlewareInstance.isAuthorized,
        (req, res) => GetUserControllerInstance.execute(req, res)
      )
      .put(
        UserMiddlewareInstance.isUserValidForUpdate,
        BodyValidationMiddlewareInstance.verifyBodyFieldErrors,
        AuthMiddlewareInstance.isLoggedIn,
        AuthMiddlewareInstance.isAuthorized,
        (req, res) => UpdateUserControllerInstance.execute(req, res)
      )
      .delete(
        AuthMiddlewareInstance.isLoggedIn,
        AuthMiddlewareInstance.isAuthorized,
        (req, res) => DeleteUserControllerInstance.execute(req, res)
      );

    return this.app;
  }
}
