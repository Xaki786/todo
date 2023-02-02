/** @format */

import { Application } from "express";
import { ROUTES_PATHS } from "./utils/RoutesConfig";
import {
  DeleteTaskControllerInstance,
  GetTaskControllerInstance,
  UpdateTaskControllerInstance,
} from "@http/controllers";
import { CommonRoutesConfig } from "./utils/CommonRoutesConfig";
import { AuthMiddlewareInstance } from "@http/middlewares";
import {
  CreateTaskControllerInstance,
  GetTaskListControllerInstance,
} from "@http/controllers";

export class TaskRoutes extends CommonRoutesConfig {
  constructor(app: Application) {
    super(app, "TaskRoutes");
  }
  configureRoutes(): Application {
    this.app
      .route(ROUTES_PATHS.USER_TASK_LIST)
      .get(
        AuthMiddlewareInstance.isLoggedIn,
        AuthMiddlewareInstance.isAuthorized,
        (req, res, next) =>
          GetTaskListControllerInstance.execute(req, res, next)
      )
      .post(
        AuthMiddlewareInstance.isLoggedIn,
        AuthMiddlewareInstance.isAuthorized,
        (req, res, next) => CreateTaskControllerInstance.execute(req, res, next)
      );

    this.app
      .route(ROUTES_PATHS.USER_TASK_SINGLE)
      .get((req, res, next) =>
        GetTaskControllerInstance.execute(req, res, next)
      )
      .put(
        AuthMiddlewareInstance.isLoggedIn,
        AuthMiddlewareInstance.isAuthorized,
        (req, res, next) => UpdateTaskControllerInstance.execute(req, res, next)
      )
      .delete(
        AuthMiddlewareInstance.isLoggedIn,
        AuthMiddlewareInstance.isAuthorized,
        (req, res, next) => DeleteTaskControllerInstance.execute(req, res, next)
      );
    return this.app;
  }
}
