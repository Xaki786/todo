/** @format */

import { Router } from "express";
import { ROUTES_PATHS } from "./RoutesConfig";
import { UserControllerInstance } from "../controllers";
const userRoutes = Router({ mergeParams: true });

userRoutes
  .route(ROUTES_PATHS.USERS)
  .get(UserControllerInstance.getUsers)
  .post(UserControllerInstance.addUser);

userRoutes
  .route(ROUTES_PATHS.SINGLE_USER)
  .get(UserControllerInstance.getUserById)
  .put(UserControllerInstance.updateUserById)
  .delete(UserControllerInstance.deleteUserById);
export { userRoutes };
