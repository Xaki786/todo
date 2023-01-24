import { v4 as uuid } from "uuid";
import { appDevelopmentLogger } from "../../common";
export class UniqueIdGenerator {
  public static generateId() {
    return uuid();
  }
}
