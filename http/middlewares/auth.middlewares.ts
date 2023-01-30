/** @format */

import argon2 from "argon2";
import { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import { appDevelopmentLogger } from "@common";
import { envConfigObject } from "@config";
import { JSON_MESSAGES, verifyAuthToken } from "@http/controllers/utils";

class AuthMiddleware {
  async isPasswordCorrect(encryptedPassword: string, password: string) {
    try {
      const isVerified = await argon2.verify(encryptedPassword, password);
      return isVerified;
    } catch (error) {
      return false;
    }
  }  

  async isValidUser(req: Request, res: Response, next: NextFunction) {
    if (!req.body.hash || !req.body.email) {
      return res
        .status(404)
        .json({ message: JSON_MESSAGES.INVALID_CREDENTIALS });
    }
    envConfigObject.isValidationEnabled && [
      body("email")
        .exists()
        .isEmail()
        .withMessage(JSON_MESSAGES.INVALID_CREDENTIALS),
    ];
    return next();
  }

  async isLoggedIn(req: Request, res: Response, next: NextFunction) {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    appDevelopmentLogger({ token });
    if (!token) {
      return res
        .status(401)
        .json({ message: JSON_MESSAGES.INVALID_CREDENTIALS });
    }
    const decoded = verifyAuthToken(token) as {
      id: string;
      iat?: Date;
      exp?: Date;
    };
    if (!decoded) {
      return res
        .status(401)
        .json({ message: JSON_MESSAGES.INVALID_CREDENTIALS });
    }
    req.body.userId = decoded.id;
    appDevelopmentLogger({ decoded });
    return next();
  }

  async isAuthorized(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.params;
    if (userId !== req.body.userId) {
      return res.status(401).json({ message: JSON_MESSAGES.UN_AUTHORIZED });
    }
    delete req.body.userId
    return next();
  }
}

export const AuthMiddlewareInstance = new AuthMiddleware();
