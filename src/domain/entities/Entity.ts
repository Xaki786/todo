/** @format */

import { IDomainEvent } from "@domain/events";
import { DomainEventsService } from "@domain/events/DomainEventsService";
import { UniqueIdGenerator } from "@Infrastructure";

const isEntity = <T>(v: Entity<T>): v is Entity<T> => {
  return v instanceof Entity;
};

export abstract class Entity<T> {
  protected readonly _id: UniqueIdGenerator;
  protected props: T;
  private _domainEvents: IDomainEvent[] = [];

  get domainEvents() {
    return this._domainEvents;
  }

  constructor(props: T, id?: UniqueIdGenerator) {
    this._id = id ?? UniqueIdGenerator.generateId();
    this.props = props;
  }

  public equals(object?: Entity<T>): boolean {
    if (object === null || object === undefined) {
      return false;
    }
    if (this === object) return true;
    if (!isEntity(object)) return false;
    return this._id === object._id;
  }

  protected addDomainEvent(event: IDomainEvent) {
    this._domainEvents.push(event);
    DomainEventsService.markEntityForDispatch(this);
    this.logDomainEventAdded(event);
  }

  private logDomainEventAdded(domainEvent: IDomainEvent): void {
    const thisClass = Reflect.getPrototypeOf(this);
    const domainEventClass = Reflect.getPrototypeOf(domainEvent);
    console.info(
      `[Domain Event Created]:`,
      thisClass?.constructor.name,
      "==>",
      domainEventClass?.constructor.name
    );
  }

  public clearDomainEvents() {
    this._domainEvents = [];
  }
}
