/** @format */

export interface SingleEntityCrud {
  getList(limit: number, page: number): Promise<any>;
  create(resource: any): Promise<any>;
  updateById(id: string, resource: any): Promise<any>;
  deleteById(id: string): Promise<any>;
  getById(id: string): Promise<any>;
}

export interface DependantEntityCrud {
  getList(limit: number, page: number, parentResourceId: string): Promise<any>;
  create(childResource: any, parentResourceId: string): Promise<any>;
  updateById(
    childResourceId: string,
    childResource: any,
    parentResourceId: string
  ): Promise<any>;
  deleteById(childResourceId: string, parentResourceId: string): Promise<any>;
  getById(childResourceId: string, parentResourceId: string): Promise<any>;
}