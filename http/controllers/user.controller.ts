/** @format */

import { Request, Response } from "express";
import { UserServiceInstance } from "@application";
import { JSON_MESSAGES } from "./utils";
class UserController {
  async getUsers(req: Request, res: Response) {
    const limit = Number(req.body.limit) || 10;
    const page = Number(req.body.page) || 1;
    const users = await UserServiceInstance.getList({ limit, page });
    return res.status(200).json({ success: true, users });
  }  

  async getUserById(req: Request, res: Response) {
    const { userId } = req.params;
    const user = await UserServiceInstance.getById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: JSON_MESSAGES.RESOURCE_NOT_FOUND });
    }

    return res.status(200).json({ success: true, user });
  }    

  async deleteAll(req: Request, res: Response) {
    const count = await UserServiceInstance.deleteAllUsers();
    if (!!count) {
      return res.status(200).json({ success: true, count });
    }
    return res
      .status(500)
      .json({ success: false, error: JSON_MESSAGES.INTERNAL_SERVER_ERROR });
  }
}

export const UserControllerInstance = new UserController();
