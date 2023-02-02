/** @format */

import { UniqueIdGenerator } from "@Infrastructure";

export interface IDeleteTaskRequestDto {
  id: UniqueIdGenerator;
  authorId: UniqueIdGenerator;
}

export interface IDeleteTaskResponseDto {
  id: UniqueIdGenerator;
}
