/** @format */
import jwt from "jsonwebtoken";
import { envConfigObject } from "../../src/config";
export const JSON_MESSAGES = {
  INVALID_CREDENTIALS: "Invalid Credentials",
  USER_ALREADY_PRESENT: "User with this email alreay exists",
  BAD_REQUEST: "Bad Request",
  INTERNAL_SERVER_ERROR: "Internal Server Error",
  UN_AUTHORIZED: "Unauthorized",
  RESOURCE_NOT_FOUND: "Resource Not Found",
  DELETED: "Deleted",
};

export const getAuthToken = (id: string) =>
  jwt.sign({ id: id }, envConfigObject.ACCESS_TOKEN_SECRET, {
    expiresIn: envConfigObject.EXPIRATION_TIME,
  });

export const verifyAuthToken = (token: string) => {
  try {
    return jwt.verify(token, envConfigObject.ACCESS_TOKEN_SECRET);
  } catch (error) {
    null;
  }
};
