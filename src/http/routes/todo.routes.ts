/** @format */

import { Router } from "express";
import { ROUTES_PATHS } from "./RoutesConfig";
import { TodoController } from "../controllers";
const toDoRoutes = Router({ mergeParams: true });

toDoRoutes
  .route(ROUTES_PATHS.TODOS)
  .get(TodoController.fetchTodos)
  .post(TodoController.addTodo);

toDoRoutes
  .route(ROUTES_PATHS.SINGLE_TODO)
  .get(TodoController.fetchSingleTodo)
  .put(TodoController.updateTodo)
  .delete(TodoController.deleteTodo);
export { toDoRoutes };
