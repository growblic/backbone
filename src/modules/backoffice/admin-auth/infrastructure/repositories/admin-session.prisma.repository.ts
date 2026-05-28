import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../../infrastructure/prisma/prisma.service';

@Injectable()
export class AdminSessionPrismaRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(data: {
    adminId: string;
    refreshToken: string;
    ipAddress?: string;
    userAgent?: string;
    expiresAt: Date;
  }) {
    return this.prisma.adminSession.create({
      data: {
        adminUser: {
          connect: {
            id: data.adminId,
          },
        },

        refreshTokenHash: data.refreshToken,

        ipAddress: data.ipAddress,

        userAgent: data.userAgent,

        expiresAt: data.expiresAt,
      },
    });
  }

  async revokeSession(
  refreshToken: string,
) {
  return this.prisma.adminSession.updateMany({
    where: {
      refreshTokenHash: refreshToken,
      isRevoked: false,
    },

    data: {
      isRevoked: true,
      lastUsedAt: new Date(),
    },
  });
}

  async findByRefreshToken(
    refreshToken: string,
  ) {
    return this.prisma.adminSession.findFirst({
      where: {
        refreshTokenHash: refreshToken,
        isRevoked: false,
      },
    });
  }
}