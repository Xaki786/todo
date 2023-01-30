/** @format */

import { Application } from "express";
import { ROUTES_PATHS } from "./utils/RoutesConfig";
import { TaskControllerInstance } from "@http/controllers";
import { CommonRoutesConfig } from "./utils/CommonRoutesConfig";
import { AuthMiddlewareInstance } from "@http/middlewares";

export class TaskRoutes extends CommonRoutesConfig {
  constructor(app: Application) {
    super(app, "TaskRoutes");
  }
  configureRoutes(): Application {
    this.app
      .route(ROUTES_PATHS.USER_TASK_LIST)
      .get(TaskControllerInstance.fetchUserTasksList)
      .post(
        AuthMiddlewareInstance.isLoggedIn,
        AuthMiddlewareInstance.isAuthorized,
        TaskControllerInstance.addUserTask
      );

    this.app
      .route(ROUTES_PATHS.USER_TASK_SINGLE)
      .get(TaskControllerInstance.fetchUserTask)
      .put(
        AuthMiddlewareInstance.isLoggedIn,
        AuthMiddlewareInstance.isAuthorized,
        TaskControllerInstance.updateUserTaskById
      )
      .delete(
        AuthMiddlewareInstance.isLoggedIn,
        AuthMiddlewareInstance.isAuthorized,
        TaskControllerInstance.deleteUserTask
      );
    return this.app;
  }
}
