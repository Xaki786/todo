/** @format */

import { UniqueIdGenerator } from "@Infrastructure";

export interface IGetUsersListRequestDto {
  limit: number;
  page: number;
}

export interface IUserResponseDto {
  id: UniqueIdGenerator;
  email: string;
  name: string;
}
export interface IGetUsersListResponseDto {
  users: IUserResponseDto[];
}
