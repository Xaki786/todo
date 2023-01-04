/** @format */

import { Router } from "express";
import { ROUTES_PATHS } from "./RoutesConfig";
import { TaskController } from "../controllers";
const taskRoutes = Router({ mergeParams: true });

taskRoutes
  .route(ROUTES_PATHS.TODOS)
  .get(TaskController.fetchTasks)
  .post(TaskController.addTask);

taskRoutes
  .route(ROUTES_PATHS.SINGLE_TODO)
  .get(TaskController.fetchSingleTask)
  .put(TaskController.updateTask)
  .delete(TaskController.deleteTask);
export { taskRoutes };
