/** @format */

import { UniqueIdGenerator } from "@Infrastructure";

export interface IGetTasksListRequestDto {
  limit: number;
  page: number;
  authodId: UniqueIdGenerator;
}

export interface ITaskResponseDto {
  id: UniqueIdGenerator;
  label: string;
  createdAt: Date;
  updatedAt: Date;
  authodId: UniqueIdGenerator;
}
export interface IGetTasksListResponseDto {
  tasks: ITaskResponseDto[];
}
