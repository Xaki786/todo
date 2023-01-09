/** @format */

import { Application, Router } from "express";
import { ROUTES_PATHS } from "./RoutesConfig";
import { UserControllerInstance } from "../controllers";
import { CommonRoutesConfig } from "./CommonRoutesConfig";

export class UserRoutes extends CommonRoutesConfig {
  constructor(app: Application) {
    super(app, "UserRoutes");
  }
  configureRoutes(): Application {
    this.app
      .route(ROUTES_PATHS.USERS)
      .get(UserControllerInstance.getUsers)
      .post(UserControllerInstance.addUser);

    this.app
      .route(ROUTES_PATHS.SINGLE_USER)
      .get(UserControllerInstance.getUserById)
      .put(UserControllerInstance.updateUserById)
      .delete(UserControllerInstance.deleteUserById);
    return this.app;
  }
}
