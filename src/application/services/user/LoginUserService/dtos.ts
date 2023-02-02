/** @format */

import { UniqueIdGenerator } from "@Infrastructure";

export interface ILoginUserRequestDto {
  email: string;
  hash: string;
}
export interface ILoginUserResponseDto {
  id: UniqueIdGenerator;
  email: string;
  token: string;
}
