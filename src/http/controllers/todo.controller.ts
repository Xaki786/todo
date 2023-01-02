/** @format */

import { Request, Response } from "express";
import { Todo } from "../models";
export class TodoController {
  static async fetchTodos(req: Request, res: Response) {
    const todos = await Todo.findAll();
    const todosResponse = todos.map((todo) => todo.dataValues);
    return res.json({ tasks: todosResponse });
  }
}
