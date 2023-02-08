/** @format */

import { Entity } from "@domain/entities";
import { IDomainEvent, IRegisterEvent } from "./interfaces";

export class DomainEventsService {
  private static eventHandlersMap = new Map();
  private static markedEntities: Entity<any>[] = [];

  public static markEntityForDispatch(entity: Entity<any>): void {
    const isEntityPresent = this.findMarkedEntity(entity);
    if (!isEntityPresent) {
      this.markedEntities.push(entity);
    }
  }

  public static removeEntityFromMarkedList(entity: Entity<any>): void {
    const entityIndex = this.markedEntities.findIndex((markedEntity) =>
      markedEntity.equals(entity)
    );
    if (entityIndex >= 0) {
      this.markedEntities.splice(entityIndex, 1);
    }
  }

  public static dispatchEntityEvents(entity: Entity<any>): void {
    const foundEntity = this.findMarkedEntity(entity);
    if (foundEntity) {
      entity.domainEvents.forEach((event) => this.dispatch(event));
      entity.clearDomainEvents();
      this.removeEntityFromMarkedList(entity);
    }
  }

  public static registerEvent({ callback, eventClassName }: IRegisterEvent) {
    if (!this.eventHandlersMap.has(eventClassName)) {
      this.eventHandlersMap.set(eventClassName, []);
    }
    this.eventHandlersMap.set(eventClassName, [
      ...this.eventHandlersMap.get(eventClassName),
      callback,
    ]);
  }

  public static clearEventHandlersMap() {
    this.eventHandlersMap.clear();
  }

  public static clearMarkedEntities() {
    this.markedEntities = [];
  }

  private static dispatch(event: IDomainEvent) {
    const eventClassName = event.constructor.name;
    if (this.eventHandlersMap.has(eventClassName)) {
      const handlers: any[] = this.eventHandlersMap.get(eventClassName);
      handlers.forEach((handler) => handler(event));
    }
  }

  private static findMarkedEntity(
    entity: Entity<any>
  ): Entity<any> | undefined {
    return this.markedEntities.find((markedEntity) =>
      markedEntity.equals(entity)
    );
  }
}
