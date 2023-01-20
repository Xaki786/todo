import { IUserProps } from "../../domain/entities/interfaces";

export interface IUserRepo {
  getList(limit: number, page: number): Promise<IUserProps[]>;
  exists(userId: string): Promise<boolean>;
  userWithSameEmailExists(email: string): Promise<boolean>;
  create(user: IUserProps): Promise<IUserProps>;
  updateById(id: string, resource: IUserProps): Promise<IUserProps>;
  deleteById(id: string): Promise<boolean>;
  getById(id: string): Promise<IUserProps>;
  getByEmail(email: string): Promise<IUserProps>;
}
