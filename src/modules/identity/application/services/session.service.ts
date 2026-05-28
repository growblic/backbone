import {
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import Redis from 'ioredis';

import { PrismaService } from '@infra/prisma/prisma.service';

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
    private readonly prisma: PrismaService,
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
  // 🔥 GET ALL SESSION KEYS (SCAN SAFE)
  // =====================================================

  private async getAllSessionKeys(): Promise<
    string[]
  > {
    let cursor = '0';

    const keys: string[] = [];

    do {
      const result =
        await this.redis.scan(
          cursor,

          'MATCH',

          'session:*',

          'COUNT',

          100,
        );

      cursor = result[0];

      keys.push(...result[1]);
    } while (cursor !== '0');

    return keys;
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

  const expiresAt = new Date(
    Date.now() +
      7 *
        24 *
        60 *
        60 *
        1000,
  );

  const refreshTokenHash =
    this.hashToken(
      refreshToken,
    );

  // =====================================================
  // ✅ SAVE IN DATABASE
  // =====================================================

  const session =
    await this.prisma.session.create({
      data: {
        id: sessionId,

        userId,

        refreshTokenHash,

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

        expiresAt,
      },
    });

  // =====================================================
  // ✅ CACHE IN REDIS
  // =====================================================

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
  // =====================================================
  // ✅ TRY REDIS FIRST
  // =====================================================

  const cached =
    await this.redis.get(
      `session:${sessionId}`,
    );

  if (cached) {
    return JSON.parse(cached);
  }

  // =====================================================
  // ✅ FALLBACK TO DATABASE
  // =====================================================

  const session =
    await this.prisma.session.findUnique({
      where: {
        id: sessionId,
      },
    });

  if (!session) {
    return null;
  }

  // =====================================================
  // ✅ RESTORE CACHE
  // =====================================================

  await this.redis.set(
    `session:${sessionId}`,

    JSON.stringify(session),

    'EX',

    60 * 60 * 24 * 7,
  );

  return session;
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
  await Promise.all([
    this.redis.del(
      `session:${sessionId}`,
    ),

    this.prisma.session.update({
      where: {
        id: sessionId,
      },

      data: {
        status: 'REVOKED',

        revokedAt: new Date(),
      },
    }),
  ]);
}

  // =====================================================
  // 🔥 LOGOUT ALL DEVICES
  // =====================================================

  async deleteAllUserSessions(
  userId: string,
) {
  // =====================================================
  // ✅ GET USER SESSIONS
  // =====================================================

  const sessions =
    await this.prisma.session.findMany({
      where: {
        userId,

        status: 'ACTIVE',
      },

      select: {
        id: true,
      },
    });

  // =====================================================
  // ✅ DELETE REDIS CACHE
  // =====================================================

  if (sessions.length > 0) {
    const pipeline =
      this.redis.pipeline();

    for (const session of sessions) {
      pipeline.del(
        `session:${session.id}`,
      );
    }

    await pipeline.exec();
  }

  // =====================================================
  // ✅ REVOKE DATABASE SESSIONS
  // =====================================================

  await this.prisma.session.updateMany({
    where: {
      userId,

      status: 'ACTIVE',
    },

    data: {
      status: 'REVOKED',

      revokedAt: new Date(),
    },
  });
}

  // =====================================================
  // 🔥 GET USER SESSIONS
  // =====================================================

  async getUserSessions(
  userId: string,
) {
  return this.prisma.session.findMany({
    where: {
      userId,

      status: 'ACTIVE',
    },

    orderBy: {
      createdAt: 'desc',
    },

    select: {
      id: true,

      userId: true,

      ipAddress: true,

      userAgent: true,

      deviceName: true,

      fingerprint: true,

      createdAt: true,

      expiresAt: true,

      revokedAt: true,

      lastUsedAt: true,
    },
  });
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