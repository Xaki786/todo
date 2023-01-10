/** @format */

import { Request, Response } from "express";
import { exclude } from "../../common";
import { envConfigObject } from "../../common/config";
import { AuthMiddlewareInstance } from "../middlewares";
import { UserServiceInstance } from "../services";
import { AuthServiceInstance } from "../services/auth.service";
import { getAuthToken, JSON_MESSAGES } from "./utils";

class AuthController {
  async login(req: Request, res: Response) {
    const dbUser = await UserServiceInstance.getByEmail(req.body.email);
    if (!dbUser) {
      return res
        .status(404)
        .json({ message: JSON_MESSAGES.INVALID_CREDENTIALS });
    }
    const isVerified = await AuthMiddlewareInstance.isPasswordCorrect(
      dbUser.hash,
      req.body.hash
    );
    if (!isVerified) {
      return res
        .status(404)
        .json({ message: JSON_MESSAGES.INVALID_CREDENTIALS });
    }
    const user = await AuthServiceInstance.login({
      email: req.body.email,
      hash: dbUser.hash,
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: JSON_MESSAGES.INVALID_CREDENTIALS });
    }
    const token = getAuthToken(user.id);
    const userWithOutHash = exclude(user, ["hash"] as never);
    return res.status(200).json({ token, user: userWithOutHash });
  }

  async register(req: Request, res: Response) {
    const dbUser = await UserServiceInstance.getByEmail(req.body.email);
    if (dbUser) {
      return res
        .status(400)
        .json({ message: JSON_MESSAGES.USER_ALREADY_PRESENT });
    }
    const registeredUser = await AuthServiceInstance.register(req.body);
    if (!registeredUser) {
      return res
        .status(400)
        .json({ message: JSON_MESSAGES.INTERNAL_SERVER_ERROR });
    }
    const userWithOutHash = exclude(registeredUser, ["hash"] as never);
    const token = getAuthToken(registeredUser.id);
    return res.status(200).json({ token, user: userWithOutHash });
  }
}

export const AuthControllerInstance = new AuthController();
