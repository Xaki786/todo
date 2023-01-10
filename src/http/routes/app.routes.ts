/** @format */

import { Application, Request, Response, Router } from "express";
import { CommonRoutesConfig } from "./utils/CommonRoutesConfig";
import { ROUTES_PATHS } from "./utils/RoutesConfig";

export class AppRoutes extends CommonRoutesConfig {
  constructor(app: Application) {
    super(app, "AppRoutes");
  }
  configureRoutes(): Application {
    this.app.get(ROUTES_PATHS.HOME, (req: Request, res: Response) => {
      return res.json({ message: "Hello World" });
    });
    return this.app;
  }
}
