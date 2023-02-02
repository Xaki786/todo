/** @format */

import { UniqueIdGenerator } from "@Infrastructure";

export interface IUpdateTaskRequestDto {
  id: UniqueIdGenerator;
  label: string;
  authorId: UniqueIdGenerator;
}

export interface IUpdateTaskResponseDto {
  id: UniqueIdGenerator;
  label: string;
  authorId: UniqueIdGenerator;
  createdAt: Date;
  updatedAt: Date;
}
