/** @format */

export interface CreateTaskDto {
  label: string;
  authorId: string;
}
export interface UpdateTaskDto {
  id: string;
  label: string;
  authorId: string;
}
export interface DeleteTaskDto {
  id: string;
}
