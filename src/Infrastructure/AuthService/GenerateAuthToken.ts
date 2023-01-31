/** @format */

import { envConfigObject } from "@config";
import jwt from "jsonwebtoken";
export abstract class GenerateAuthToken {
  public static generateToken(id: string) {
    return jwt.sign({ id: id }, envConfigObject.ACCESS_TOKEN_SECRET, {
      expiresIn: envConfigObject.EXPIRATION_TIME,
    });
  }
}
