/** @format */

import { Router } from "express";
import { ROUTES_PATHS } from "./RoutesConfig";
import { TaskControllerInstance } from "../controllers";
const taskRoutes = Router({ mergeParams: true });

taskRoutes
  .route(ROUTES_PATHS.USER_TASK_LIST)
  .get(TaskControllerInstance.fetchUserTasksList)
  .post(TaskControllerInstance.addUserTask);

taskRoutes
  .route(ROUTES_PATHS.USER_TASK_SINGLE)
  .get(TaskControllerInstance.fetchUserTask)
  .put(TaskControllerInstance.updateUserTaskById)
  .delete(TaskControllerInstance.deleteUserTask);
export { taskRoutes };
