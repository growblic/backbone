export class UserCreatedEvent {
  static EVENT_NAME = 'user.created';

  constructor(
    public readonly userId: string,
    public readonly phone: string,
    public readonly country: string,
    public readonly appId: string,
  ) {}
}