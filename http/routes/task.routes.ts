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
        (req, res) => GetTaskListControllerInstance.execute(req, res)
      )
      .post(
        AuthMiddlewareInstance.isLoggedIn,
        AuthMiddlewareInstance.isAuthorized,
        (req, res) => CreateTaskControllerInstance.execute(req, res)
      );

    this.app
      .route(ROUTES_PATHS.USER_TASK_SINGLE)
      .get((req, res) => GetTaskControllerInstance.execute(req, res))
      .put(
        AuthMiddlewareInstance.isLoggedIn,
        AuthMiddlewareInstance.isAuthorized,
        (req, res) => UpdateTaskControllerInstance.execute(req, res)
      )
      .delete(
        AuthMiddlewareInstance.isLoggedIn,
        AuthMiddlewareInstance.isAuthorized,
        (req, res) => DeleteTaskControllerInstance.execute(req, res)
      );
    return this.app;
  }
}
