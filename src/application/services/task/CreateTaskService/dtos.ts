/** @format */

import { UniqueIdGenerator } from "@Infrastructure";

export interface ICreateTaskRequestDto {
  label: string;
  authorId: UniqueIdGenerator;
}
export interface ICreateTaskResponseDto {
  id: UniqueIdGenerator;
  label: string;
  authorId: UniqueIdGenerator;
}
