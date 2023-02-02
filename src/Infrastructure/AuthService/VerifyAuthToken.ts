/** @format */

import { envConfigObject } from "@config";
import jwt from "jsonwebtoken";

export abstract class VerifyAuthToken {
  public static verifyToken(token: string) {
    return jwt.verify(token, envConfigObject.ACCESS_TOKEN_SECRET);
  }
}
