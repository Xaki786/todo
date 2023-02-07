/** @format */

import { Application, Request, Response } from "express";
import { JSON_MESSAGES } from "@http/controllers";
import { CommonRoutesConfig } from "./utils/CommonRoutesConfig";
import { ROUTES_PATHS } from "./utils/RoutesConfig";
import { UserRepoInstance } from "@Infrastructure";

export class AppRoutes extends CommonRoutesConfig {
  constructor(app: Application) {
    super(app, "AppRoutes");
  }

  configureRoutes(): Application {
    this.app.get(ROUTES_PATHS.HOME, (req: Request, res: Response) => {
      return res.json({ message: "Hello World" });
    });
    // ===================================================================================
    // THIS ROUTE IS JUST FOR EXPERIMENTING PURPOSE ==> DELETE IT AFTER APP IS COMPLETE
    // ===================================================================================
    this.app.get("/deleteAllUsers", async (req, res, next) => {
      const count = await UserRepoInstance.deleteAll();
      if (!!count) {
        return res.status(200).json({ success: true, count });
      }
      return res
        .status(500)
        .json({ success: false, error: JSON_MESSAGES.INTERNAL_SERVER_ERROR });
    });
    // ===================================================================================
    this.app.use((req, res, next) => {
      res.status(404).json({
        success: false,
        message: "Url Not Found",
      });
    });
    return this.app;
  }
}
