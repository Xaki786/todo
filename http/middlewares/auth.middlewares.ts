/** @format */

import { NextFunction, Request, Response } from "express";
import { JSON_MESSAGES } from "@http/controllers/utils";
import { VerifyAuthToken } from "@Infrastructure";
import { InternelServerError, InvalidCredentialsError } from "@application";

class AuthMiddleware {
  async isLoggedIn(req: Request, res: Response, next: NextFunction) {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return next(new InvalidCredentialsError(400, "Invalid Credentials"));
    }

    try {
      const decoded = (await VerifyAuthToken.verifyToken(token)) as {
        id: string;
        iat?: Date;
        exp?: Date;
      };
      if (!decoded) {
        return next(new InvalidCredentialsError(400, "Invalid Credentials"));
      }
      req.body.decodedId = decoded.id;
      return next();
    } catch (error) {
      return next(new InternelServerError(500, "Something Went Wrong"));
    }
  }

  async isAuthorized(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.params;
    if (userId !== req.body.decodedId) {
      return res.status(401).json({ message: JSON_MESSAGES.UN_AUTHORIZED });
    }
    delete req.body.userId;
    return next();
  }
}

export const AuthMiddlewareInstance = new AuthMiddleware();
