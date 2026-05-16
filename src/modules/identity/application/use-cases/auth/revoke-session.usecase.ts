import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { SessionService } from '@modules/identity/application/services/session.service';

@Injectable()
export class RevokeSessionUseCase {
  constructor(
    private readonly sessionService:
      SessionService,
  ) {}

  async execute(
    currentUserId: string,

    sessionId: string,
  ) {
    // =====================================================
    // ✅ GET SESSION
    // =====================================================

    const session =
      await this.sessionService.getSession(
        sessionId,
      );

    // =====================================================
    // ❌ SESSION NOT FOUND
    // =====================================================

    if (!session) {
      throw new UnauthorizedException(
        'Session not found',
      );
    }

    // =====================================================
    // ❌ SECURITY CHECK
    // =====================================================

    if (
      session.userId !==
      currentUserId
    ) {
      throw new UnauthorizedException(
        'Access denied',
      );
    }

    // =====================================================
    // ✅ DELETE SESSION
    // =====================================================

    await this.sessionService.deleteSession(
      sessionId,
    );

    // =====================================================
    // ✅ RESPONSE
    // =====================================================

    return {
      success: true,

      message:
        'Session revoked successfully',
    };
  }
}