export interface ITask {
  id?: string;
  label: string;
  updatedAt?: Date;
  authorId?: string;
}

export interface IUser {}
export interface IUserProps {
  id?: string;
  email: string;
  hash: string;
  name: string;
  tasks?: ITask[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserLogin {
  email: string;
  hash: string;
}
