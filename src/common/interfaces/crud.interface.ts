/** @format */

import { UniqueIdGenerator } from "../../Infrastructure";

export interface SingleEntityCrud {
  getList(limit: number, page: number): Promise<any>;
  create(resource: any): Promise<any>;
  updateById(id: UniqueIdGenerator, resource: any): Promise<any>;
  deleteById(id: UniqueIdGenerator): Promise<any>;
  getById(id: UniqueIdGenerator): Promise<any>;
}

export interface DependantEntityCrud {
  getList(
    limit: number,
    page: number,
    parentResourceId: UniqueIdGenerator
  ): Promise<any>;
  create(childResource: any, parentResourceId: UniqueIdGenerator): Promise<any>;
  updateById(
    childResourceId: string,
    childResource: any,
    parentResourceId: UniqueIdGenerator
  ): Promise<any>;
  deleteById(
    childResourceId: string,
    parentResourceId: UniqueIdGenerator
  ): Promise<any>;
  getById(
    childResourceId: string,
    parentResourceId: UniqueIdGenerator
  ): Promise<any>;
}