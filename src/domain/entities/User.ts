import { UniqueIdGenerator } from "../../Infrastructure/UniqueIdGenerator";
import { Entity } from "./Entity";
import { ITask, IUserProps } from "./interfaces";

export class User extends Entity<IUserProps> {
  private _tasks: ITask[] = [];
  private constructor({ id, ...data }: IUserProps) {
    super(data, id);
  }

  public static create(props: IUserProps) {
    return new User(props);
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

  get tasks(): ITask[] {
    return this._tasks;
  }

  public addTask(task: ITask) {
    this._tasks.push(task);
  }

  get userProps(): IUserProps {
    return {
      id: this._id,
      ...this.props,
    };
  }

  public updateTask(taskId: string, task: ITask) {
    const taskIndex = this._tasks.findIndex((task) => task.id === taskId);
    if (!taskId) {
      throw new Error("Task Not Found");
    }
    this._tasks[taskIndex] = task;
    this._tasks[taskIndex].updatedAt = new Date();
  }

  public deleteTask(taskId: string) {
    const taskIndex = this._tasks.findIndex((task) => task.id === taskId);
    if (!taskId) {
      throw new Error("Task Not Found");
    }
    this._tasks.splice(taskIndex, 1);
  }
}
