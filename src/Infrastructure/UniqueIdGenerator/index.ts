import { v4 as uuid } from "uuid";
export class UniqueIdGenerator {
  constructor() {
    return uuid();
  }
}
