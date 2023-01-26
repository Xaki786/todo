/** @format */

import {
  ICreateUserDto,
  IDeleteUserDto,
  IGetUserByEmailDto,
  IGetUsersListDto,
  IUpdateUserDto,
} from "../../application/dtos";
import { UniqueIdGenerator } from "../../Infrastructure";

export interface ISingleEntityCrud {
  getList(getUsersListDto: IGetUsersListDto): Promise<unknown>;
  create(createUserDto: ICreateUserDto): Promise<unknown>;
  updateById(updateUserDto: IUpdateUserDto): Promise<unknown>;
  deleteById(deleteUserDto: IDeleteUserDto): Promise<unknown>;
  getById(getUserByEmailDto: IGetUserByEmailDto): Promise<unknown>;
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