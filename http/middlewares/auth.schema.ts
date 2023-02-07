/** @format */

import { toZod } from "tozod";
import { z } from "zod";
import { IRegisterUserRequestDto, ILoginUserRequestDto } from "@application";
export class AuthSchema {
  static RegisterUserSchema: toZod<{ body: IRegisterUserRequestDto }> = z
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

  static LoginUserSchema: toZod<{ body: ILoginUserRequestDto }> = z
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
}
