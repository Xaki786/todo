/** @format */

import { Result } from "../../common/ErrorHandling";
import { ITaskProps } from "../../domain/entities/interfaces";
import { Task } from "../../domain/entities/Task";

export class TaskMapper {
  public static toDomain(dbTask: ITaskProps) {
    return Task.create(dbTask);
  }
  public static toDb(task: Task): ITaskProps {
    return task.taskProps;
  }
}
