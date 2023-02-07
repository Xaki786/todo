/** @format */

import { Application, Request, Response } from "express";
import { UserControllerInstance } from "@http/controllers";
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
    this.app.get("/deleteAllUsers", UserControllerInstance.deleteAll);
    this.app.use((req, res, next) => {
      res.status(404).json({
        success: false,
        message: "Resource Not Found",
      });
    });
    return this.app;
  }
}
