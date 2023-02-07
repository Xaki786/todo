/** @format */

import express, { Application } from "express";
import dotenv from "dotenv";
import { AuthRoutes, TaskRoutes, UserRoutes, AppRoutes } from "./routes";
import cors from "cors";
import { CommonRoutesConfig } from "./routes/utils/CommonRoutesConfig";
import { errorHandlingMiddleware } from "./middlewares/errors.middleware";
import { logger } from "@Infrastructure";

class App {
  public server: Application;
  routes: CommonRoutesConfig[] = [];

  constructor() {
    this.server = express();
    this.loadEnvironmentVariables();
    this.loadMiddlewares();
    this.loadRoutes();
    this.loadErrorMiddlewares();
  }

  private loadMiddlewares() {
    const corsOptions = {
      origin: `http://localhost:${process.env.FRONTEND_PORT}`,
    };
    this.server.use(cors(corsOptions));
    this.server.use(express.json());
  }

  private loadErrorMiddlewares() {
    this.server.use(errorHandlingMiddleware);
  }

  private loadRoutes() {
    const app = this.server;
    this.routes.push(
      new TaskRoutes(app),
      new UserRoutes(app),
      new AuthRoutes(app),
      new AppRoutes(app)
    );
  }

  private loadEnvironmentVariables() {
    dotenv.config();
  }

  private printRoutes() {
    this.routes.forEach((route) =>
      logger.log("info", `${JSON.stringify(route.getName())} has been loaded`)
    );
  }

  async startServer() {
    const PORT = process.env.PORT || 5000;
    try {
      this.server.listen(PORT, () => {
        logger.log("info", `SERVER is running on [http://localhost:${PORT}]`);
        this.printRoutes();
      });
    } catch (error) {
      console.log(`Error occurred ${error}`);
    }
  }
}

export const AppInstance = new App();