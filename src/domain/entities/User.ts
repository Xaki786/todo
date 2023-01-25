/** @format */

import { Guard, IGuardProps, Result } from "../../common/ErrorHandling";
import { UniqueIdGenerator } from "../../Infrastructure/UniqueIdGenerator";
import { Entity } from "./Entity";
import { ITaskProps, IUserProps } from "./interfaces";
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

  public addTask(task: Task) {
    this._tasks.push(task);
  }

  get userProps(): IUserProps {
    return {
      id: this._id,
      ...this.props,
    };
  }

  public updateTask(taskToBeUpdated: Task) {
    const taskIndex = this._tasks.findIndex(
      (task) => task.id === taskToBeUpdated.id && task.authorId === this._id
    );
    if (!taskIndex) {
      return Result.fail<User>("Task Not Found");
    }
    this._tasks[taskIndex] = taskToBeUpdated;
    return Result.ok<User>(this);
  }

  public deleteTask(taskId: string) {
    const taskIndex = this._tasks.findIndex((task) => task.id === taskId);
    if (!taskId) {
      throw new Error("Task Not Found");
    }
    this._tasks.splice(taskIndex, 1);
  }

  public getTasks() {
    return this._tasks;
  }
}
