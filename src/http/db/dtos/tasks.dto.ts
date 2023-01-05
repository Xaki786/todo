/** @format */

import { CreateUserDto } from "./users.dto";

export interface CreateTaskDto {
  label: string;
  authorId: string;
}
export interface UpdateTaskDto {
  id: string;
  label: string;
  authorId: string;
}
export interface DeleteTaskDto {
  id: string;
}
