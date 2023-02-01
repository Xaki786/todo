/** @format */

import { UniqueIdGenerator } from "@Infrastructure";

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