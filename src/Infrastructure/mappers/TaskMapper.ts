/** @format */

import { ITaskProps } from "../../domain/entities/interfaces";
import { Task } from "../../domain/entities/Task";

export class TaskMapper {
  public static toDomain(dbTask: ITaskProps) {
    return dbTask;
  }
  public static toDomainList(dbTasks: ITaskProps[]) {
    return dbTasks.map((task) => this.toDomain(task));
  }
  public static toDb(task: Task): ITaskProps {
    return task.taskProps;
  }
}
