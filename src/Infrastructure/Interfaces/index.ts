/** @format */

import { ITask, IUserProps } from "../../domain/entities/interfaces";
import { UniqueIdGenerator } from "../UniqueIdGenerator";

export interface IUserRepo {
  getList(limit: number, page: number): Promise<IUserProps[]>;
  exists(userId: UniqueIdGenerator): Promise<boolean>;
  userWithSameEmailExists(email: string): Promise<boolean>;
  create(user: IUserProps): Promise<IUserProps>;
  updateById(id: UniqueIdGenerator, resource: IUserProps): Promise<IUserProps>;
  deleteById(id: UniqueIdGenerator): Promise<boolean>;
  getById(id: UniqueIdGenerator): Promise<IUserProps>;
  getByEmail(email: string): Promise<IUserProps>;
}

export interface ITaskRepo {
  getUserTasksList(
    limit: number,
    page: number,
    userId: string
  ): Promise<ITask[]>;

  addUserTask(task: ITask, userId: UniqueIdGenerator): Promise<ITask>;
  updateUserTaskById(
    taskId: string,
    task: ITask,
    userId: string
  ): Promise<ITask>;
  getUserTaskById(taskId: string, userId: UniqueIdGenerator): Promise<ITask>;
  deleteUserTaskById(
    taskId: string,
    userId: UniqueIdGenerator
  ): Promise<boolean>;
}
