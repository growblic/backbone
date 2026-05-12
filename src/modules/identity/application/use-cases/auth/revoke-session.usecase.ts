import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { SessionService } from '@modules/identity/application/services/session.service';

@Injectable()
export class RevokeSessionUseCase {
  constructor(
    private readonly sessionService: SessionService,
  ) {}

  async execute(
    currentUserId: string,
    sessionId: string,
  ) {
    // get session
    const session =
      await this.sessionService.getSession(
        sessionId,
      );

    if (!session) {
      throw new UnauthorizedException(
        'Session not found',
      );
    }

    // security check
    if (session.userId !== currentUserId) {
      throw new UnauthorizedException(
        'Access denied',
      );
    }

    // delete session
    await this.sessionService.deleteSession(
      sessionId,
    );

    return {
      message:
        'Session revoked successfully',
    };
  }
}