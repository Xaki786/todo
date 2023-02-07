/** @format */

import jwt from "jsonwebtoken";
import { envConfigObject } from "@config";
export abstract class GenerateAuthToken {
  public static generateToken(id: string) {
    return jwt.sign({ id: id }, envConfigObject.ACCESS_TOKEN_SECRET, {
      expiresIn: envConfigObject.EXPIRATION_TIME,
    });
  }
}
