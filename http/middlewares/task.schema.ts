/** @format */

import { toZod } from "tozod";
import { z } from "zod";
import { ICreateTaskRequestDto, IUpdateTaskRequestDto } from "@application";
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

  static GetTaskSchema: toZod<{
    params: { userId: string; taskId: string };
  }> = z.object({
    params: z.object({ userId: z.string().uuid(), taskId: z.string().uuid() }),
  });

  static DeleteTaskSchema: toZod<{
    params: { userId: string; taskId: string };
  }> = z.object({
    params: z.object({ userId: z.string().uuid(), taskId: z.string().uuid() }),
  });

  static UpdateTaskSchema: toZod<{
    params: { userId: string; taskId: string };
    body: Omit<IUpdateTaskRequestDto, "id" | "authorId">;
  }> = z.object({
    params: z
      .object({
        userId: z.string().uuid(),
        taskId: z.string().uuid(),
      })
      .required(),
    body: z.object({
      label: z.string().trim().min(1, { message: "Task label is empty" }),
    }),
  });
}
