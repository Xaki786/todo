/** @format */

import { Router } from "express";
import { ROUTES_PATHS } from "./RoutesConfig";
import { fetchTodos } from "../controllers";
const toDoRoutes = Router();

toDoRoutes.route(ROUTES_PATHS.TODOS).get(fetchTodos);

export { toDoRoutes };
