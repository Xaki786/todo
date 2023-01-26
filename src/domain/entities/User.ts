/** @format */

import { Guard, IGuardProps, Result } from "../../common/ErrorHandling";
import { UniqueIdGenerator } from "../../Infrastructure/UniqueIdGenerator";
import { Entity } from "./Entity";
import { IUserProps } from "./interfaces";
import { Task } from "./Task";

export class User extends Entity<IUserProps> {
  private _tasks: Task[] = [];
  private constructor({ id, ...data }: IUserProps) {
    super(data, id);
  }

  public static create(props: IUserProps) {
    const guardedProps: IGuardProps[] = [
      { arguement: props.email, arguementName: "email" },
      { arguement: props.hash, arguementName: "hash" },
    ];
    const guardResult = Guard.guardAgainstNullOrUndefinedBulk(guardedProps);
    if (!guardResult.succeeded) {
      return Result.fail<User>(guardResult.message);
    }
    const user = new User({ ...props, name: props?.name || "" });
    return Result.ok<User>(user);
  }

  get id(): UniqueIdGenerator {
    return this._id;
  }

  get name(): string {
    return this.name;
  }

  get email(): string {
    return this.email;
  }

  get tasks(): Task[] {
    return this._tasks;
  }

  get userProps(): IUserProps {
    return {
      id: this._id,
      ...this.props,
    };
  }

  set name(name: string) {
    if (name) {
      this.props.name = name;
    }
  }
  set email(email: string) {
    this.props.email = email;
  }
}
