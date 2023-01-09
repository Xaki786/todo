/** @format */

import { Application } from "express";
import { ROUTES_PATHS } from "./RoutesConfig";
import { TaskControllerInstance } from "../controllers";
import { CommonRoutesConfig } from "./CommonRoutesConfig";

export class TaskRoutes extends CommonRoutesConfig {
  constructor(app: Application) {
    super(app, "TaskRoutes");
  }
  configureRoutes(): Application {
    this.app
      .route(ROUTES_PATHS.USER_TASK_LIST)
      .get(TaskControllerInstance.fetchUserTasksList)
      .post(TaskControllerInstance.addUserTask);

    this.app
      .route(ROUTES_PATHS.USER_TASK_SINGLE)
      .get(TaskControllerInstance.fetchUserTask)
      .put(TaskControllerInstance.updateUserTaskById)
      .delete(TaskControllerInstance.deleteUserTask);
    return this.app;
  }
}
