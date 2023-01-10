/** @format */

import argon2 from "argon2";
import { Request, Response } from "express";
import { appDevelopmentLogger, exclude } from "../../common";
import { UserServiceInstance } from "../services";
class UserController {
  async getUsers(req: Request, res: Response) {
    const users = await UserServiceInstance.getList(100, 0);
    if (users.length) {
      const usersWithOutHash = users.map((user) =>
        exclude(user, ["hash"] as never)
      );
      return res.status(200).json({ users: usersWithOutHash });
    }
    return res.status(200).json({ users });
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

    return res.status(200).json({ user: userWithOutHash });
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
