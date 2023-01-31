/** @format */

import { UniqueIdGenerator } from "../../Infrastructure";

export const USER_FIELDS = {
  EMAIL: "email",
  HASH: "hash",
  NAME: "name",
  ID: "id",
  USER_ID: "userId",
};
export interface ICreateUserDto {
  email: string;
  hash: string;
}
export interface IUpdateUserDto {
  id: UniqueIdGenerator;
  email?: string;
  name?: string;
}
export interface IDeleteUserDto {
  id: UniqueIdGenerator;
}

export interface IGetUsersListDto {
  limit: number;
  page: number;
}

export interface IGetUserByIdDto {
  id: UniqueIdGenerator;
}
export interface IGetUserByEmailDto {
  email: string;
}
