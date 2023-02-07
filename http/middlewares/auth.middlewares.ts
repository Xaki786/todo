/** @format */

import { NextFunction, Request, Response } from "express";
import { JSON_MESSAGES } from "@http/controllers/utils";
import { VerifyAuthToken } from "@Infrastructure";
import {
  InternelServerError,
  InvalidCredentialsError,
  UnAuthorizedError,
} from "@application";

class AuthMiddleware {
  async isLoggedIn(req: Request, res: Response, next: NextFunction) {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return next(
        new InvalidCredentialsError(
          400,
          "Invalid Credentials",
          "Token is not provided in the headers Auth Middlewares"
        )
      );
    }

    try {
      const decoded = (await VerifyAuthToken.verifyToken(token)) as {
        id: string;
        iat?: Date;
        exp?: Date;
      };
      if (!decoded) {
        return next(
          new InvalidCredentialsError(
            400,
            "Invalid Credentials",
            "Decoded token is not valid Auth Middlewares"
          )
        );
      }
      req.body.decodedId = decoded.id;
      return next();
    } catch (error) {
      return next(
        new InternelServerError(
          500,
          "Something Went Wrong",
          `Something Went Wrong in verifying auth token Auth Middleware ${
            error as string
          }`
        )
      );
    }
  }

  async isAuthorized(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.params;
    if (userId !== req.body.decodedId) {
      return next(
        new UnAuthorizedError(
          401,
          JSON_MESSAGES.UN_AUTHORIZED,
          "User id didn't match from token in auth middleware"
        )
      );
    }
    delete req.body.userId;
    return next();
  }
}

export const AuthMiddlewareInstance = new AuthMiddleware();
