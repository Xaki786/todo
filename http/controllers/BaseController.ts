/** @format */

import type { NextFunction, Request, Response } from "express";

export abstract class BaseController {
  protected request?: Request;
  protected response?: Response;
  protected handleErrors?: NextFunction;

  public async execute(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    this.request = req;
    this.response = res;
    this.handleErrors = next;
    await this.executeImplementation();
  }

  protected abstract executeImplementation(): Promise<any>;

  protected ok<T>(value: T) {
    this.response?.status(200).json({ success: true, result: value });
  }

  protected created<T>(value: T) {
    this.response?.status(201).json({ success: true, result: value });
  }
}
