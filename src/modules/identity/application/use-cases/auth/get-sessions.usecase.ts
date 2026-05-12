import {
  Injectable,
} from '@nestjs/common';

import { SessionService } from '@modules/identity/application/services/session.service';

@Injectable()
export class GetSessionsUseCase {
  constructor(
    private readonly sessionService: SessionService,
  ) {}

  async execute(userId: string) {
    const sessions =
      await this.sessionService.getUserSessions(
        userId,
      );

    return {
      sessions: sessions.map((session) => ({
        id: session.id,
        userId: session.userId,

        ipAddress:
          session.ipAddress,

        userAgent:
          session.userAgent,

        deviceName:
          session.deviceName,

        createdAt:
          session.createdAt,

        expiresAt:
          session.expiresAt,
      })),
    };
  }
}