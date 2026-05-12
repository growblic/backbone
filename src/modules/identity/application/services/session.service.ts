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

  refreshToken: string;

  ipAddress: string;

  userAgent: string;

  deviceName: string;

  fingerprint: string;

  createdAt: string;

  expiresAt: string;
};

@Injectable()
export class SessionService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redis: Redis,
  ) {}

  // 🔥 create session
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
    const sessionId = crypto.randomUUID();

    const session: SessionData = {
      id: sessionId,

      userId,

      refreshToken,

      ipAddress:
        metadata?.ipAddress || 'unknown',

      userAgent:
        metadata?.userAgent || 'unknown',

      deviceName:
        metadata?.deviceName || 'unknown',

      fingerprint:
        metadata?.fingerprint || 'unknown',

      createdAt: new Date().toISOString(),

      expiresAt: new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000,
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

  // 🔥 get session
  async getSession(sessionId: string) {
    const raw = await this.redis.get(
      `session:${sessionId}`,
    );

    if (!raw) {
      return null;
    }

    return JSON.parse(raw) as SessionData;
  }

  // 🔥 validate session
  async validateSession(
    sessionId: string,
    refreshToken: string,
  ) {
    const session =
      await this.getSession(sessionId);

    if (!session) {
      return false;
    }

    return (
      session.refreshToken === refreshToken
    );
  }

  // 🔥 rotate refresh token
  async rotateRefreshToken(
    sessionId: string,
    newRefreshToken: string,
  ) {
    const session =
      await this.getSession(sessionId);

    if (!session) {
      return;
    }

    session.refreshToken =
      newRefreshToken;

    await this.redis.set(
      `session:${sessionId}`,
      JSON.stringify(session),
      'EX',
      60 * 60 * 24 * 7,
    );
  }

  // 🔥 delete one session
  async deleteSession(
    sessionId: string,
  ) {
    await this.redis.del(
      `session:${sessionId}`,
    );
  }

  // 🔥 logout all devices
  async deleteAllUserSessions(
    userId: string,
  ) {
    const keys = await this.redis.keys(
      'session:*',
    );

    for (const key of keys) {
      const raw =
        await this.redis.get(key);

      if (!raw) {
        continue;
      }

      const session =
        JSON.parse(raw) as SessionData;

      if (session.userId === userId) {
        await this.redis.del(key);
      }
    }
  }

  // 🔥 get all user sessions
  async getUserSessions(
    userId: string,
  ) {
    const keys = await this.redis.keys(
      'session:*',
    );

    const sessions: SessionData[] = [];

    for (const key of keys) {
      const raw =
        await this.redis.get(key);

      if (!raw) {
        continue;
      }

      const session =
        JSON.parse(raw) as SessionData;

      if (session.userId === userId) {
        // 🔥 NEVER expose refresh token
        sessions.push({
          id: session.id,

          userId: session.userId,

          refreshToken: '',

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
        });
      }
    }

    return sessions;
  }

  // 🔥 require valid session
  async requireSession(
    sessionId: string,
  ) {
    const session =
      await this.getSession(sessionId);

    if (!session) {
      throw new UnauthorizedException(
        'Session expired',
      );
    }

    return session;
  }
}