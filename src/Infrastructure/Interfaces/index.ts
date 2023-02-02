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
  getList(limit: number, page: number, userId: string): Promise<ITaskProps[]>;

  exists({
    label,
    id,
  }: {
    id?: UniqueIdGenerator;
    label?: string;
  }): Promise<boolean>;

  create(task: ITaskProps): Promise<void>;

  updateById(
    taskId: UniqueIdGenerator,
    task: ITaskProps,
    userId: UniqueIdGenerator
  ): Promise<ITaskProps>;

  getById(
    taskId: UniqueIdGenerator,
    userId: UniqueIdGenerator
  ): Promise<ITaskProps>;

  deleteById(
    taskId: UniqueIdGenerator,
    userId: UniqueIdGenerator
  ): Promise<void>;
}
