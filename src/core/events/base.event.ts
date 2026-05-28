import { DomainEvent } from './event-bus';

export abstract class BaseEvent implements DomainEvent {
  readonly occurredAt: Date = new Date();

  abstract readonly eventName: string;
}