/** @format */

import express, { Application } from "express";
import dotenv from "dotenv";
import { appRoutes, toDoRoutes } from "./routes";
import cors from "cors";

class App {
  public server: Application;

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
    this.server.use(appRoutes);
    this.server.use(toDoRoutes);
  }

  private loadEnvironmentVariables() {
    dotenv.config();
  }

  async startServer() {
    const PORT = process.env.PORT || 5000;
    try {
      this.server.listen(PORT, () => {
        console.log(`SERVER is running on [${PORT}]`);
      });
    } catch (error) {
      console.log(`Error occurred`);
    }
  }
}

export const appInstance = new App();