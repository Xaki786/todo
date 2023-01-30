/** @format */

import { Request, Response } from "express";
import { UserServiceInstance } from "@application";
import { JSON_MESSAGES } from "./utils";
class UserController {
  async getUsers(req: Request, res: Response) {
    const limit = parseInt(req.body.limit) || 10;
    const page = parseInt(req.body.page) || 1;
    const users = await UserServiceInstance.getList({ limit, page });
    return res.status(200).json({ success: true, users });
  }

  async addUser(req: Request, res: Response) {
    const user = await UserServiceInstance.create(req.body);
    if (!user) {
      return res
        .status(500)
        .json({ success: false, message: JSON_MESSAGES.INTERNAL_SERVER_ERROR });
    }
    return res.status(200).json({ success: true, user });
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
  async updateUserById(req: Request, res: Response) {
    const { userId } = req.params;
    if (req.body.hash) {
      req.body.hash = undefined;
    }
    const user = await UserServiceInstance.updateById({
      id: userId,
      ...req.body,
    });
    if (!user) {
      return res
        .status(500)
        .json({ success: false, message: JSON_MESSAGES.INTERNAL_SERVER_ERROR });
    }

    return res.status(200).json({ success: true, user });
  }

  async deleteUserById(req: Request, res: Response) {
    const { userId } = req.params;
    const user = await UserServiceInstance.deleteById({ id: userId });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, error: JSON_MESSAGES.RESOURCE_NOT_FOUND });
    }
    return res.json({ success: true, message: JSON_MESSAGES.DELETED });
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
