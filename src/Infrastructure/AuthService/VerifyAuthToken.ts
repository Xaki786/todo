/** @format */

import jwt from "jsonwebtoken";
import { envConfigObject } from "@config";

export abstract class VerifyAuthToken {
  public static verifyToken(token: string) {
    return jwt.verify(token, envConfigObject.ACCESS_TOKEN_SECRET);
  }
}
