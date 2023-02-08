/** @format */

import { User } from "@domain/entities";
import { UniqueIdGenerator } from "@Infrastructure";
import { IDomainEvent } from "./interfaces";

export class UserCreatedEvent implements IDomainEvent {
  createdAt: Date;
  user: User;

  constructor(user: User) {
    this.user = user;
    this.createdAt = new Date();
  }

  getEntityId(): UniqueIdGenerator {
    return this.user.id;
  }
}
