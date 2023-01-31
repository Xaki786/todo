/** @format */

import { Application } from "express";
import { AuthControllerInstance } from "@http/controllers";
import {
  AuthMiddlewareInstance,
  UserMiddlewareInstance,
} from "@http/middlewares";
import { CommonRoutesConfig } from "./utils/CommonRoutesConfig";
import { ROUTES_PATHS } from "./utils/RoutesConfig";
import { RegisterUserControllerInstance } from "@http/controllers/RegisterUserController";

export class AuthRoutes extends CommonRoutesConfig {
  constructor(app: Application) {
    super(app, "AuthRoutes");
  }
  configureRoutes(): Application {
    this.app
      .route(ROUTES_PATHS.LOGIN)
      .post(AuthMiddlewareInstance.isValidUser, AuthControllerInstance.login);
    this.app
      .route(ROUTES_PATHS.REGISTER)
      .post(
        AuthMiddlewareInstance.isValidUser,
        UserMiddlewareInstance.isUserValidForCreation,
        (req, res) => RegisterUserControllerInstance.execute(req, res)
      );
    return this.app;
  }
}
