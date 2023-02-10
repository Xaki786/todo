/** @format */
import winston from "winston";
import { ILogger } from "./interfaces";

const winstonLogger = winston.createLogger({
  level: "debug",
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }),
  ],
});

class Logger implements ILogger {
  log(type: "info" | "debug" | "error", message: any) {
    if (type === "error") {
      console.log("\x1b[91m====================================\x1b[0m");
      winstonLogger.log(type, message);
    } else if (type === "debug") {
      console.log("\x1b[33m====================================\x1b[0m");
      winstonLogger.log(type, message);
    } else {
      winstonLogger.log(type, message);
    }
  }
}

export const logger = new Logger();