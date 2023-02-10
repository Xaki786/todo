/** @format */

import { UniqueIdGenerator } from "@Infrastructure";

export interface IDomainEvent {
  createdAt: Date;
  getEntityId(): UniqueIdGenerator;
}

type TEventCallback = (event: any) => void;

export interface ISubscribeEvent {
  setupSubscriptions: () => void;
}

export interface IRegisterEvent {
  callback: TEventCallback;
  eventClassName: string;
}
