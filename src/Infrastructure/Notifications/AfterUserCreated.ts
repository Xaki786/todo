/** @format */

import {
  DomainEventsService,
  IDomainEvent,
  IHandleEvent,
  UserCreatedEvent,
} from "@domain/events";

export class AfterUserCreated implements IHandleEvent {
  constructor() {
    this.setupSubscriptions();
  }
  setupSubscriptions() {
    DomainEventsService.registerEvent({
      callback: this.onUserCreatedEvent.bind(this),
      eventClassName: UserCreatedEvent.name,
    });
  }
  private async onUserCreatedEvent(event: IDomainEvent) {
    console.log("I am here for notifying to Slack");
    console.log("I am here for notifying to Email");
  }
}
