/** @format */

export interface ILogger {
  log: (type: "info" | "debug" | "error", message: any) => void;
}
