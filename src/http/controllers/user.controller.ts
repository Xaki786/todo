/** @format */

import argon2 from "argon2";
import { Request, Response } from "express";
import { appDevelopmentLogger } from "../../common";
import { UserServiceInstance } from "../services";

function exclude<User, Key extends keyof User>(
  user: User,
  keys: Key[]
): Omit<User, Key> {
  for (let key of keys) {
    delete user[key];
  }
  return user;
}
class UserController {
  async getUsers(req: Request, res: Response) {
    const users = await UserServiceInstance.getList(100, 0);
    return res.status(200).json({ users });
  }

  async login(req: Request, res: Response) {
    const user = await UserServiceInstance.getByEmail(req.body.email);
    if (user) {
      const isVerified = await argon2.verify(user.hash, req.body.hash);
      if (isVerified) {
        return res.status(200).json({ message: "LoggedIn" });
      }
      return res.status(404).json({ message: "Invalid Credentials" });
    }
    return res.status(404).json({ message: "Invalid Credentials" });
  }
  async addUser(req: Request, res: Response) {
    req.body.hash = await argon2.hash(req.body.hash);
    const user = await UserServiceInstance.create(req.body);
    return res.status(200).json({ user });
  }

  async getUserById(req: Request, res: Response) {
    const { userId } = req.params;
    const user = await UserServiceInstance.getById(userId);
    const userWithOutHash = exclude(user, ["hash"] as never);
    appDevelopmentLogger({ userWithOutHash }, { context: "getUserById" });

    return res.status(200).json({ userWithOutHash });
  }
  async updateUserById(req: Request, res: Response) {
    const { userId } = req.params;
    if (req.body.hash) {
      req.body.hash = undefined;
    }
    const user = await UserServiceInstance.updateById(userId, req.body);
    appDevelopmentLogger({ user }, { context: "updateUserById" });
    return res.status(200).json({ user });
  }

  async deleteUserById(req: Request, res: Response) {
    const { userId } = req.params;
    const user = await UserServiceInstance.deleteById(userId);
    appDevelopmentLogger({ user }, { context: "deleteUserById" });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: "Resource Not Found" });
    }
    return res.json({ success: true, message: "deleted" });
  }
}

export const UserControllerInstance = new UserController();
