/** @format */

import { Router } from "express";
import { ROUTES_PATHS } from "./RoutesConfig";
import { TodoController } from "../controllers";
const toDoRoutes = Router();

toDoRoutes
  .route(ROUTES_PATHS.TODOS)
  .get(TodoController.fetchTodos)
  .post(TodoController.addTodo);

export { toDoRoutes };
