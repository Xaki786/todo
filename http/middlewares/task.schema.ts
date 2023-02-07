/** @format */

import { ICreateTaskRequestDto } from "@application";
import { toZod } from "tozod";
import { z } from "zod";
export class TaskSchema {
  static CreateTaskSchema: toZod<{
    params: { userId: string };
    body: Omit<ICreateTaskRequestDto, "authorId">;
  }> = z.object({
    params: z.object({ userId: z.string().uuid() }),
    body: z.object({
      label: z.string().trim().min(1, { message: "Task label is empty" }),
    }),
  });

  static GetTasksListSchema: toZod<{
    params: { userId: string };
  }> = z.object({
    params: z.object({ userId: z.string().uuid() }),
  });
}
