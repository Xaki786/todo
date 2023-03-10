/** @format */

import { UniqueIdGenerator } from "@Infrastructure";

export interface IUpdateUserRequestDto {
  id: UniqueIdGenerator;
  email?: string;
  name?: string;
}
export interface IUpdateUserResponseDto {
  id: UniqueIdGenerator;
  email: string;
  name: string;
}
