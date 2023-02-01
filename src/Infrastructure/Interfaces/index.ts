/** @format */

import { ITaskProps, IUserProps } from "@domain";
import { UniqueIdGenerator } from "../UniqueIdGenerator";

export interface IUserRepo {
  getList(limit: number, page: number): Promise<IUserProps[]>;
  exists({
    name,
    email,
    id,
  }: {
    id?: UniqueIdGenerator;
    email?: string;
    name?: string;
  }): Promise<boolean>;
  userWithSameEmailExists(email: string): Promise<boolean>;
  create(user: IUserProps): Promise<void>;
  updateById(id: UniqueIdGenerator, resource: IUserProps): Promise<void>;
  deleteById(id: UniqueIdGenerator): Promise<boolean>;
  getById(id: UniqueIdGenerator): Promise<IUserProps>;
  getByEmail(email: string): Promise<IUserProps>;
}

export interface ITaskRepo {
  getUserTasksList(
    limit: number,
    page: number,
    userId: string
  ): Promise<ITaskProps[]>;

  create(task: ITaskProps): Promise<void>;
  updateUserTaskById(
    taskId: string,
    task: ITaskProps,
    userId: string
  ): Promise<ITaskProps>;
  getUserTaskById(
    taskId: string,
    userId: UniqueIdGenerator
  ): Promise<ITaskProps>;
  deleteUserTaskById(
    taskId: string,
    userId: UniqueIdGenerator
  ): Promise<boolean>;
}
