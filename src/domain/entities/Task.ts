/** @format */

import { Guard, IGuardProps, Result } from "../../common/ErrorHandling";
import { Entity } from "./Entity";
import { ITaskProps } from "./interfaces";

export class Task extends Entity<ITaskProps> {
  private constructor({ id, ...data }: ITaskProps) {
    super(data, id);
  }

  public static create(taskProps: ITaskProps) {
    const guardedProps: IGuardProps[] = [
      { arguement: taskProps.authorId, arguementName: "author id" },
      { arguement: taskProps.label, arguementName: "label" },
    ];
    const guardResult = Guard.guardAgainstNullOrUndefinedBulk(guardedProps);
    if (!guardResult.succeeded) {
      return Result.fail<Task>(guardResult.message);
    }
    const task = new Task(taskProps);
    return Result.ok<Task>(task);
  }

  public static update(taskProps: ITaskProps) {
    const guardedProps: IGuardProps[] = [
      { arguement: taskProps.authorId, arguementName: "author id" },
      { arguement: taskProps.id, arguementName: "task id" },
      { arguement: taskProps.label, arguementName: "label" },
    ];
    const guardResult = Guard.guardAgainstNullOrUndefinedBulk(guardedProps);
    if (!guardResult.succeeded) {
      return Result.fail<Task>(guardResult.message);
    }
    const task = new Task(taskProps);
    return Result.ok<Task>(task);
  }

  get taskProps() {
    return {...this.props };
  }

  get id() {
    return this._id;
  }

  get authorId() {
    return this.props.authorId;
  }

  set updatedAt(date: Date) {
    this.props.updatedAt = date;
  }

  set createdAt(date: Date) {
    this.props.createdAt = date;
  }

  set label(label: string) {
    this.props.label = label;
  }
}
