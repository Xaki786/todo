/** @format */

import { UniqueIdGenerator } from "@Infrastructure";

export interface IGetUserRequestDto {
  id: UniqueIdGenerator;
}

export interface IGetUserResponseDto {
  id: UniqueIdGenerator;
  email: string;
  name: string;
}
