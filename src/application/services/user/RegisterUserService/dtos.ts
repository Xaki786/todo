/** @format */

import { UniqueIdGenerator } from "@Infrastructure";

export interface IRegisterUserRequestDto {
  email: string;
  hash: string;
}

export interface IRegisterUserResponseDto {
  id: UniqueIdGenerator;
  email: string;
  token: string;
}
