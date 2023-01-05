/** @format */

export interface CRUD {
  getList(limit: number, page: number): Promise<any>;
  create(resource: any): Promise<any>;
  updateById(id: string, resource: any): Promise<any>;
  deleteById(id: string): Promise<any>;
  getById(id: string): Promise<any>;
}
