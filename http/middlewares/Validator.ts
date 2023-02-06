/** @format */

import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodIssue } from "zod";
import { BaseValidationError } from "./errors";
import { combineZodValidationErrors } from "./utils";

export class Validator {
  private response: Response;
  private request: Request;
  private next: NextFunction;
  constructor(req: Request, res: Response, next: NextFunction) {
    this.request = req;
    this.response = res;
    this.next = next;
  }
  async execute(schema: AnyZodObject) {
    try {
      await schema.parseAsync({
        body: this.request.body,
        params: this.request.params,
        query: this.request.query,
      });
      return this.next();
    } catch (error: any) {
      const errors = combineZodValidationErrors(error.errors as ZodIssue[]);
      const validationError = new BaseValidationError(errors);
      return this.next(validationError);
    }
  }
}
