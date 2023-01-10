/** @format */

export const USER_FIELDS = {
  EMAIL: "email",
  HASH: "hash",
  NAME: "name",
  ID: "id",
  USER_ID: "userId",
};
export interface CreateUserDto {
  email: string;
  hash: string;
  name?: string;
}
export interface UpdateUserDto {
  id: string;
  email?: string;
  hash?: string;
}
export interface DeleteUserDto {
  id: string;
}
