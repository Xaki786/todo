/** @format */

import { v4 as uuid } from "uuid";
export class UniqueIdGenerator {
  public static generateId() {
    return uuid();
  }
}
