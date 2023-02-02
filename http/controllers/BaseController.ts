/** @format */

import type { Request, Response } from "express";

export abstract class BaseController {
  protected request?: Request;
  protected response?: Response;

  public async execute(req: Request, res: Response): Promise<void> {
    this.request = req;
    this.response = res;
    await this.executeImplementation();
  }

  protected abstract executeImplementation(): Promise<any>;

  protected ok<T>(value: T) {
    this.response?.status(200).json({ success: true, result: value });
  }

  protected created<T>(value: T) {
    this.response?.status(201).json({ success: true, result: value });
  }

  protected badRequest(message?: string) {
    const jsonMessage = message ?? "Bad Request";
    this.response?.status(400).json({ success: false, message: jsonMessage });
  }

  protected notFound(message?: string) {
    const jsonMessage = message ?? "Not Found";
    this.response?.status(404).json({ success: false, message: jsonMessage });
  }

  protected internalServerError(message?: string): void {
    const jsonMessage = message ?? "Internal Server Error";
    this.response?.status(500).json({ success: false, message: jsonMessage });
  }
}
