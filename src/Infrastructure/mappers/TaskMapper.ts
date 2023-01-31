/** @format */

import { ITaskProps } from "@domain";
import { Task } from "@domain";

export class TaskMapper {
  public static toDomain(dbTask: ITaskProps) {
    return Task.create(dbTask);
  }
  public static toDb(task: Task): ITaskProps {
    return task.taskProps;
  }
}
