/** @format */

import { UniqueIdGenerator } from "@Infrastructure";

export interface IDomainEvent {
  createdAt: Date;
  getEntityId(): UniqueIdGenerator;
}

type TEventCallback = (event: IDomainEvent) => void;

export interface IHandleEvent {
  setupSubscriptions: () => void;
}

export interface IRegisterEvent {
  callback: TEventCallback;
  eventClassName: string;
}
