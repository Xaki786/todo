/** @format */

import { UniqueIdGenerator } from "../../../Infrastructure";

export interface ITask {
  id?: string;
  label: string;
  updatedAt?: Date;
  authorId?: string;
}
export interface IUserProps {
  id?: UniqueIdGenerator;
  email: string;
  hash: string;
  name: string;
  tasks?: ITask[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserLogin {
  email: string;
  hash: string;
}
