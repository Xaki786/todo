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
  UserSchema,
  UserMiddlewareInstance,
  UserMiddleware,
  Validator,
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
        (req, res, next) => {
          const validator = new Validator(req, res, next);
          validator.execute(UserSchema.CreateUserSchema);
        },
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
        (req, res, next) => {
          const validator = new Validator(req, res, next);
          validator.execute(UserSchema.UpdateUserSchema);
        },
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
