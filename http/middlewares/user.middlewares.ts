/** @format */

import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { envConfigObject } from "@config";
import { JSON_MESSAGES } from "@http/controllers/utils";
import { USER_FIELDS } from "@http/routes";
import { z } from "zod";
import { toZod } from "tozod";
import { ICreateUserRequestDto, IUpdateUserRequestDto } from "@application";

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

  static UpdateUserSchema: toZod<{
    params: { userId: string };
    body: Omit<IUpdateUserRequestDto, "id">;
  }> = z.object({
    params: z.object({
      userId: z.string().uuid(),
    }),
    body: z.object({
      email: z.string().email().optional(),
      name: z
        .string()
        .trim()
        .min(1, { message: "Name can not be empty" })
        .optional(),
    }),
  });

  static DeleteUserSchema: toZod<{ params: { userId: string } }> = z.object({
    params: z.object({ userId: z.string().uuid() }),
  });

  static GetUserSchema: toZod<{ params: { userId: string } }> = z.object({
    params: z.object({ userId: z.string().uuid() }),
  });
}
export class UserMiddleware {
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
}

export const UserMiddlewareInstance = new UserMiddleware();
