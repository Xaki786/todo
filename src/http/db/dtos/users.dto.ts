/** @format */

export interface CreateUserDto {
  email: string;
  password: string;
  name?: string;
}
export interface UpdateUserDto {
  id: string;
  email?: string;
  password?: string;
}
export interface DeleteUserDto {
  id: string;
}
