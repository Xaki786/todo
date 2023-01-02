/** @format */

import { Request, Response, Router } from "express";
import { ROUTES_PATHS } from "./RoutesConfig";

const toDoRoutes = Router();

toDoRoutes.get(ROUTES_PATHS.TODOS, (req: Request, res: Response) => {
  return res.json({ message: "Todo" });
});

export { toDoRoutes };
