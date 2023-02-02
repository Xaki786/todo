/** @format */

import { UniqueIdGenerator } from "@Infrastructure";

export interface IGetTaskRequestDto {
  id: UniqueIdGenerator;
  authorId: UniqueIdGenerator;
}
export interface IGetTaskResponseDto {
  id: UniqueIdGenerator;
  label: string;
  authorId: UniqueIdGenerator;
  createdAt: Date;
  updatedAt: Date;
}
