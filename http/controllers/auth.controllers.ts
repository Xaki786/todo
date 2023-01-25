/** @format */

import { Request, Response } from "express";
import { AuthServiceInstance } from "../../src/application";
import { JSON_MESSAGES } from "./utils";

class AuthController {
  async login(req: Request, res: Response) {
    const user = await AuthServiceInstance.login(req.body);
    if (!user) {
      return res
        .status(404)
        .json({ message: JSON_MESSAGES.INVALID_CREDENTIALS });
    }
    return res.status(200).json({ user });
  }

  async register(req: Request, res: Response) {
    const user = await AuthServiceInstance.register(req.body);
    if (!user) {
      return res
        .status(400)
        .json({ message: JSON_MESSAGES.USER_ALREADY_PRESENT });
    }
    return res.status(200).json({ user });
  }
}

export const AuthControllerInstance = new AuthController();
