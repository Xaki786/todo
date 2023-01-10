/** @format */

import { Request, Response } from "express";

class AuthController {
  async login(req: Request, res: Response) {
    return res.status(200).json({ message: "Login" });
    // const user = await UserServiceInstance.getByEmail(req.body.email);
    // if (user) {
    //   const isVerified = await argon2.verify(user.hash, req.body.hash);
    //   if (isVerified) {
    //     return res.status(200).json({ message: "LoggedIn" });
    //   }
    //   return res.status(404).json({ message: "Invalid Credentials" });
    // }
    // return res.status(404).json({ message: "Invalid Credentials" });
  }

  async register(req: Request, res: Response) {
    return res.status(200).json({ message: "Register" });
  }
}

export const AuthControllerInstance = new AuthController();
