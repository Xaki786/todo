/** @format */

import { Application } from "express";
import { ROUTES_PATHS } from "./utils/RoutesConfig";
import {
  DeleteUserControllerInstance,
  CreateUserControllerInstance,
  UpdateUserControllerInstance,
  GetUserControllerInstance,
  GetUsersListControllerInstance,
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
      .get((req, res, next) =>
        GetUsersListControllerInstance.execute(req, res, next)
      )
      .post(
        UserMiddlewareInstance.isUserValidForCreation,
        BodyValidationMiddlewareInstance.verifyBodyFieldErrors,
        (req, res, next) => CreateUserControllerInstance.execute(req, res, next)
      );

    this.app
      .route(ROUTES_PATHS.SINGLE_USER)
      .get(
        AuthMiddlewareInstance.isLoggedIn,
        AuthMiddlewareInstance.isAuthorized,
        (req, res, next) => GetUserControllerInstance.execute(req, res, next)
      )
      .put(
        UserMiddlewareInstance.isUserValidForUpdate,
        BodyValidationMiddlewareInstance.verifyBodyFieldErrors,
        AuthMiddlewareInstance.isLoggedIn,
        AuthMiddlewareInstance.isAuthorized,
        (req, res, next) => UpdateUserControllerInstance.execute(req, res, next)
      )
      .delete(
        AuthMiddlewareInstance.isLoggedIn,
        AuthMiddlewareInstance.isAuthorized,
        (req, res, next) => DeleteUserControllerInstance.execute(req, res, next)
      );

    return this.app;
  }
}
