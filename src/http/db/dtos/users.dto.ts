/** @format */

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
