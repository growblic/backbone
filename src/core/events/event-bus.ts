/**
 * CORE EVENT BUS (PURE DOMAIN)
 * ❌ No Nest imports
 * ❌ No infra logic
 */

export interface EventBus {
  publish(event: DomainEvent): void;
}

/**
 * Base interface for all domain events
 * Every domain event MUST implement this
 */
export interface DomainEvent {
  /**
   * Unique name of the event
   * Example: identity.user.verified
   */
  readonly eventName: string;

  /**
   * When event occurred
   */
  readonly occurredAt: Date;
}