/** @format */

import { ZodIssue } from "zod";

export const combineZodValidationErrors = (
  errors: ZodIssue[]
): { [key: string]: string } => {
  return errors.reduce((err: any, currentError: ZodIssue) => {
    const key = currentError.path[1];
    return { ...err, [key]: currentError.message };
  }, {});
};
