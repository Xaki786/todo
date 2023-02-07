/** @format */

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
