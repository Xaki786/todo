/** @format */

import { Request, Response } from "express";
export class TodoController {
  static async fetchTodos(req: Request, res: Response) {
    return res.json({ message: "Todo" });
  }
}