/**
 * Domain Event
 * Fired when a user successfully verifies OTP
 * This event is PURE DOMAIN (no Nest imports)
 */
export class UserVerifiedEvent {
  public static readonly EVENT_NAME = 'identity.user.verified';

  constructor(
    public readonly userId: string,
    public readonly phone: string,
    public readonly country: string,
    public readonly appId: string,
    public readonly occurredAt: Date = new Date(),
  ) {}
}