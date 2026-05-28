export class Session {
  constructor(
    public readonly id: string,
    public readonly userId: string,

    public readonly refreshToken: string,

    public readonly ipAddress: string,
    public readonly userAgent: string,
    public readonly deviceName: string,

    public readonly createdAt: Date = new Date(),
    public readonly expiresAt: Date,
  ) {}
}