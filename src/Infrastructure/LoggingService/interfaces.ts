/** @format */

export interface ILogger {
  log: (level: "info" | "debug" | "error", message: any) => void;
}
