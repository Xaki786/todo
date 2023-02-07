/** @format */

import { Application } from "express";
import { LoginUserControllerInstance } from "@http/controllers";
import { AuthSchema, Validator } from "@http/middlewares";
import { CommonRoutesConfig } from "./utils/CommonRoutesConfig";
import { ROUTES_PATHS } from "./utils/RoutesConfig";
import { RegisterUserControllerInstance } from "@http/controllers";

export class AuthRoutes extends CommonRoutesConfig {
  constructor(app: Application) {
    super(app, "AuthRoutes");
  }

  configureRoutes(): Application {
    this.app.route(ROUTES_PATHS.LOGIN).post(
      (req, res, next) => {
        const validator = new Validator(req, res, next);
        validator.execute(AuthSchema.LoginUserSchema);
      },
      (req, res, next) => LoginUserControllerInstance.execute(req, res, next)
    );
    this.app.route(ROUTES_PATHS.REGISTER).post(
      (req, res, next) => {
        const validator = new Validator(req, res, next);
        validator.execute(AuthSchema.RegisterUserSchema);
      },
      (req, res, next) => RegisterUserControllerInstance.execute(req, res, next)
    );
    return this.app;
  }
}
