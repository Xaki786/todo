/** @format */

import { UniqueIdGenerator } from "@Infrastructure";

export interface ITaskProps {
  id?: UniqueIdGenerator;
  label: string;
  updatedAt?: Date;
  authorId?: UniqueIdGenerator;
  createdAt?: Date;
}
export interface IUserProps {
  id?: UniqueIdGenerator;
  email: string;
  hash: string;
  name?: string;
  tasks?: ITaskProps[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserLogin {
  email: string;
  hash: string;
}
