/** @format */

import { Request, Response } from "express";
import { Todo } from "../models";
import { v4 as uuidv4 } from "uuid";
import { appDevelopmentLogger } from "../../common";

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

  static async updateTodo(req: Request, res: Response) {
    const { todoId } = req.params;
    const { label } = req.body;
    const dbTodo = await Todo.update(
      { label },
      {
        where: {
          id: todoId,
        },
        returning: true,
      }
    );
    appDevelopmentLogger({ dbTodo }, { context: "updateTodo" });
    const updatedTodo = dbTodo[1].map((t) => t.dataValues)[0];
    return res.json({ task: updatedTodo });
  }

  static async fetchSingleTodo(req: Request, res: Response) {
    const { todoId } = req.params;
    const dbTodo = await Todo.findByPk(todoId);
    appDevelopmentLogger({ dbTodo }, { context: "fetchSingleTodo" });
    // const updatedTodo = dbTodo[1].map((t) => t.dataValues)[0];
    return res.json({ task: dbTodo });
  }
}
