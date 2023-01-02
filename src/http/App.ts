import express from "express";
import dotenv from "dotenv";
import { routes } from "./routes";

export class App {
  public server;

  constructor() {
    this.server = express();
    this.loadEnvironmentVariables();
    this.loadMiddlewares();
    this.loadRoutes();
  }

  private loadMiddlewares() {
    this.server.use(express.json());
  }

  private loadRoutes() {
    this.server.use(routes);
  }

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
