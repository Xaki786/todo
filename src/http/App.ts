import express from "express";
import dotenv from "dotenv";
import { appRoutes, toDoRoutes } from "./routes";

export class App {
  public server;

  constructor() {
    this.server = express();
    this.loadEnvironmentVariables();
    this.loadMiddlewares();
    this.loadRoutes();
    this.loadDb();
  }

  private loadMiddlewares() {
    this.server.use(express.json());
  }

  private loadRoutes() {
    this.server.use(appRoutes);
    this.server.use(toDoRoutes);
  }

  private loadDb() {}

  private loadEnvironmentVariables() {
    dotenv.config();
  }

  startServer() {
    const PORT = process.env.PORT || 5000;
    this.server.listen(PORT, () => {
      console.log(`SERVER is running on [${PORT}]`);
    });
  }
}
