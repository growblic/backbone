import {
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import Redis from 'ioredis';

import crypto from 'crypto';

type SessionData = {
  id: string;

  userId: string;

  refreshTokenHash: string;

  ipAddress: string;

  userAgent: string;

  deviceName: string;

  fingerprint: string;

  createdAt: string;

  expiresAt: string;

  revokedAt?: string;

  lastUsedAt?: string;
};

@Injectable()
export class SessionService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redis: Redis,
  ) {}

  // =====================================================
  // 🔐 HASH TOKEN
  // =====================================================

  private hashToken(
    token: string,
  ): string {
    return crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');
  }

  // =====================================================
  // 🔥 CREATE SESSION
  // =====================================================

  async createSession(
    userId: string,

    refreshToken: string,

    metadata?: {
      ipAddress?: string;

      userAgent?: string;

      deviceName?: string;

      fingerprint?: string;
    },
  ) {
    const sessionId =
      crypto.randomUUID();

    const session: SessionData = {
      id: sessionId,

      userId,

      refreshTokenHash:
        this.hashToken(
          refreshToken,
        ),

      ipAddress:
        metadata?.ipAddress ||
        'unknown',

      userAgent:
        metadata?.userAgent ||
        'unknown',

      deviceName:
        metadata?.deviceName ||
        'unknown',

      fingerprint:
        metadata?.fingerprint ||
        'unknown',

      createdAt:
        new Date().toISOString(),

      expiresAt: new Date(
        Date.now() +
          7 *
            24 *
            60 *
            60 *
            1000,
      ).toISOString(),
    };

    await this.redis.set(
      `session:${sessionId}`,

      JSON.stringify(session),

      'EX',

      60 * 60 * 24 * 7,
    );

    return session;
  }

  // =====================================================
  // 🔥 GET SESSION
  // =====================================================

  async getSession(
    sessionId: string,
  ) {
    const raw =
      await this.redis.get(
        `session:${sessionId}`,
      );

    if (!raw) {
      return null;
    }

    return JSON.parse(
      raw,
    ) as SessionData;
  }

  // =====================================================
  // 🔥 VALIDATE SESSION
  // =====================================================

  async validateSession(
    sessionId: string,

    refreshToken: string,
  ) {
    const session =
      await this.getSession(
        sessionId,
      );

    if (!session) {
      return false;
    }

    return (
      session.refreshTokenHash ===
      this.hashToken(
        refreshToken,
      )
    );
  }

  // =====================================================
  // 🔥 ROTATE REFRESH TOKEN
  // =====================================================

  async rotateRefreshToken(
    sessionId: string,

    newRefreshToken: string,
  ) {
    const session =
      await this.getSession(
        sessionId,
      );

    if (!session) {
      return;
    }

    session.refreshTokenHash =
      this.hashToken(
        newRefreshToken,
      );

    session.lastUsedAt =
      new Date().toISOString();

    await this.redis.set(
      `session:${sessionId}`,

      JSON.stringify(session),

      'EX',

      60 * 60 * 24 * 7,
    );
  }

  // =====================================================
  // 🔥 DELETE ONE SESSION
  // =====================================================

  async deleteSession(
    sessionId: string,
  ) {
    await this.redis.del(
      `session:${sessionId}`,
    );
  }

  // =====================================================
  // 🔥 LOGOUT ALL DEVICES
  // =====================================================

  async deleteAllUserSessions(
    userId: string,
  ) {
    const keys =
      await this.redis.keys(
        'session:*',
      );

    for (const key of keys) {
      const raw =
        await this.redis.get(key);

      if (!raw) {
        continue;
      }

      const session =
        JSON.parse(
          raw,
        ) as SessionData;

      if (
        session.userId ===
        userId
      ) {
        await this.redis.del(key);
      }
    }
  }

  // =====================================================
  // 🔥 GET USER SESSIONS
  // =====================================================

  async getUserSessions(
    userId: string,
  ) {
    const keys =
      await this.redis.keys(
        'session:*',
      );

    const sessions:
      SessionData[] = [];

    for (const key of keys) {
      const raw =
        await this.redis.get(key);

      if (!raw) {
        continue;
      }

      const session =
        JSON.parse(
          raw,
        ) as SessionData;

      if (
        session.userId ===
        userId
      ) {
        sessions.push({
          id: session.id,

          userId:
            session.userId,

          refreshTokenHash: '',

          ipAddress:
            session.ipAddress,

          userAgent:
            session.userAgent,

          deviceName:
            session.deviceName,

          fingerprint:
            session.fingerprint,

          createdAt:
            session.createdAt,

          expiresAt:
            session.expiresAt,

          revokedAt:
            session.revokedAt,

          lastUsedAt:
            session.lastUsedAt,
        });
      }
    }

    return sessions;
  }

  // =====================================================
  // 🔥 REQUIRE VALID SESSION
  // =====================================================

  async requireSession(
    sessionId: string,
  ) {
    const session =
      await this.getSession(
        sessionId,
      );

    if (!session) {
      throw new UnauthorizedException(
        'Session expired',
      );
    }

    return session;
  }
}