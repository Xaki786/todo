/** @format */

import { Request, Response, Router } from "express";
import { ROUTES_PATHS } from "./RoutesConfig";

const appRoutes = Router();

appRoutes.get(ROUTES_PATHS.HOME, (req: Request, res: Response) => {
  return res.json({ message: "Hello World" });
});

export { appRoutes };
