/** @format */

import argon2 from "argon2";
import { Request, Response } from "express";
import { exclude } from "../../common";
import { UserServiceInstance } from "../services";
import { AuthServiceInstance } from "../services/auth.service";

class AuthController {
  async login(req: Request, res: Response) {
    const dbUser = await UserServiceInstance.getByEmail(req.body.email);
    if (dbUser) {
      const isVerified = await argon2.verify(dbUser.hash, req.body.hash);
      if (isVerified) {
        const user = await AuthServiceInstance.login({
          email: req.body.email,
          hash: dbUser.hash,
        });
        
        if (!user) {
          return res.status(404).json({ message: "Invalid Credentials" });
        }
        const userWithOutHash = exclude(user, ["hash"] as never);
        return res.status(200).json({ user: userWithOutHash });
      }
      return res.status(404).json({ message: "Invalid Credentials" });
    }
    return res.status(404).json({ message: "Invalid Credentials" });
  }

  async register(req: Request, res: Response) {
    if (req.body.hash) {
      req.body.hash = await argon2.hash(req.body.hash);
    }
    const dbUser = await UserServiceInstance.getByEmail(req.body.email);
    if (dbUser) {
      return res
        .status(400)
        .json({ message: "User with this email alreay exists" });
    }
    const registeredUser = await AuthServiceInstance.register(req.body);
    const userWithOutHash = exclude(registeredUser, ["hash"] as never);
    return res.status(200).json({ user: userWithOutHash });
  }
}

export const AuthControllerInstance = new AuthController();
