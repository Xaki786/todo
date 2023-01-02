/** @format */

import { Request, Response } from "express";

export const fetchTodos = async (req: Request, res: Response) => {
  return res.json({ message: "Todo" });
};
