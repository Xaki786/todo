/** @format */

import { NextFunction, Request, Response } from "express";
import { body, check } from "express-validator";
import { envConfigObject } from "@config";
import { JSON_MESSAGES } from "@http/controllers/utils";
import { USER_FIELDS } from "@http/routes";
import { AnyZodObject, z, ZodIssue } from "zod";
import { CreateUserValidationError, UpdateUserValidationError } from "./errors";
import { combineZodValidationErrors } from "./utils";
import { toZod } from "tozod";
import { ICreateUserRequestDto, IUpdateUserRequestDto } from "@application";
import { Validator } from "./Validator";

export class UserSchema {
  static CreateUserSchema: toZod<{ body: ICreateUserRequestDto }> = z
    .object({
      body: z.object({
        email: z.string().email(),
        hash: z
          .string()
          .trim()
          .min(1, { message: "password can not be empty" }),
      }),
    })
    .required();

  static UpdateUserSchema: toZod<IUpdateUserRequestDto> = z.object({
    id: z.string().uuid(),
    email: z.string().email().optional(),
    name: z.string().optional(),
  });
}
export class UserMiddleware {
  static validate(schema: AnyZodObject) {
    return async (req: Request, res: Response, next: NextFunction) => {
      const validator = new Validator(req, res, next);
      await validator.execute(schema);
    };
  }
  static validateUpdateUser(schema: AnyZodObject) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        await schema.parseAsync(req.body);
        return next();
      } catch (error: any) {
        const errors = combineZodValidationErrors(error.errors as ZodIssue[]);
        return next(new UpdateUserValidationError(errors));
      }
    };
  }
  async isUserValidForCreation(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (!req.body.email || !req.body.hash) {
      return res.status(400).json(JSON_MESSAGES.BAD_REQUEST);
    }
    envConfigObject.isValidationEnabled && [
      body(USER_FIELDS.EMAIL).isEmail(),
      body(USER_FIELDS.HASH)
        .isLength({ min: 5 })
        .withMessage("Must include more than 5 characters"),
      body(USER_FIELDS.NAME).optional(),
    ];
    return next();
  }

  async isUserValidForUpdate(req: Request, res: Response, next: NextFunction) {
    envConfigObject.isValidationEnabled && [
      check(USER_FIELDS.USER_ID),
      body(USER_FIELDS.EMAIL).optional().isEmail(),
      body(USER_FIELDS.HASH)
        .optional()
        .isLength({ min: 5 })
        .withMessage("Must include more than 5 characters"),
      body(USER_FIELDS.NAME),
    ];
    return next();
  }

  isUserValidForDelete() {
    return envConfigObject.isValidationEnabled
      ? [check(USER_FIELDS.USER_ID)]
      : [];
  }
}

export const UserMiddlewareInstance = new UserMiddleware();
