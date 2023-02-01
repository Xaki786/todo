/** @format */

import { UniqueIdGenerator } from "../../Infrastructure";

export const USER_FIELDS = {
  EMAIL: "email",
  HASH: "hash",
  NAME: "name",
  ID: "id",
  USER_ID: "userId",
};
export interface IGetUsersListDto {
  limit: number;
  page: number;
}
