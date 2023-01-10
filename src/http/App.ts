/** @format */

import express, { Application } from "express";
import dotenv from "dotenv";
import { AuthRoutes, TaskRoutes, UserRoutes } from "./routes";
import cors from "cors";
import { CommonRoutesConfig } from "./routes/CommonRoutesConfig";
import { AppRoutes } from "./routes/app.routes";

class App {
  public server: Application;
  routes: CommonRoutesConfig[] = [];

  constructor() {
    this.server = express();
    this.loadEnvironmentVariables();
    this.loadMiddlewares();
    this.loadRoutes();
  }

  private loadMiddlewares() {
    const corsOptions = {
      origin: `http://localhost:${process.env.FRONTEND_PORT}`,
    };
    this.server.use(cors(corsOptions));
    this.server.use(express.json());
  }

  private loadRoutes() {
    const app = this.server;
    this.routes.push(
      new AppRoutes(app),
      new TaskRoutes(app),
      new UserRoutes(app),
      new AuthRoutes(app)
    );
  }

  private loadEnvironmentVariables() {
    dotenv.config();
  }

  private printRoutes() {
    this.routes.forEach((route) =>
      console.log(`${JSON.stringify(route.getName())} has been loaded`)
    );
  }

  async startServer() {
    const PORT = process.env.PORT || 5000;
    try {
      this.server.listen(PORT, () => {
        console.log(`SERVER is running on [http://localhost:${PORT}]`);
        this.printRoutes();
      });
    } catch (error) {
      console.log(`Error occurred ${error}`);
    }
  }
}

export const appInstance = new App();