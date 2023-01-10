/** @format */

const tasks = "tasks";
const users = "users";
const taskId = "taskId";
const userId = "userId";
export const ROUTES_PATHS = {
  TASKS: `/${tasks}`,
  SINGLE_TASK: `/${tasks}/:${taskId}`,
  USERS: `/${users}`,
  SINGLE_USER: `/${users}/:${userId}`,
  USER_TASK_LIST: `/${users}/:${userId}/${tasks}`,
  USER_TASK_SINGLE: `/${users}/:${userId}/${tasks}/:${taskId}`,
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
};
