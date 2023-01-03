/** @format */

import { Request, Response } from "express";
import { Todo } from "../models";
import { v4 as uuidv4 } from "uuid";

export class TodoController {
  static async fetchTodos(req: Request, res: Response) {
    const todos = await Todo.findAll();
    const todosResponse = todos.map((todo) => todo.dataValues);
    return res.json({ tasks: todosResponse });
  }

  static async addTodo(req: Request, res: Response) {
    const task = req.body;
    const dbTodo = await Todo.create({
      ...task,
      id: uuidv4(),
    });
    const todo = dbTodo.dataValues;
    return res.json({ task: todo });
  }
}
