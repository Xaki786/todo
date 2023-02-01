/** @format */

import { Request, Response } from "express";
import { UserServiceInstance } from "@application";
import { JSON_MESSAGES } from "./utils";
class UserController {
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
