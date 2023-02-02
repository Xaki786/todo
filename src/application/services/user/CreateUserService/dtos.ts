/** @format */

import { UniqueIdGenerator } from "@Infrastructure";

export interface ICreateUserRequestDto {
  email: string;
  hash: string;
}

export interface ICreateUserResponseDto {
  id: UniqueIdGenerator;
  email: string;
  name: string;
}
