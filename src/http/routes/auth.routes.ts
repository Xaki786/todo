/** @format */

import { Application } from "express";
import { AuthControllerInstance } from "../controllers";
import { CommonRoutesConfig } from "./CommonRoutesConfig";
import { ROUTES_PATHS } from "./RoutesConfig";

export class AuthRoutes extends CommonRoutesConfig {
  constructor(app: Application) {
    super(app, "AuthRoutes");
  }
  configureRoutes(): Application {
    this.app.route(ROUTES_PATHS.LOGIN).post(AuthControllerInstance.login);
    this.app.route(ROUTES_PATHS.REGISTER).post(AuthControllerInstance.register);
    return this.app;
  }
}
