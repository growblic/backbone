import { Injectable } from '@nestjs/common';

import { PrismaService } from '@infra/prisma/prisma.service';

@Injectable()
export class AdminUsersPrismaRepository {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findByEmail(
    email: string,
  ) {
    return this.prisma.adminUser.findUnique({
      where: {
        email,
      },
    });
  }

  async findMany(
    page: number,
    limit: number,
    search?: string,
  ) {
    const skip =
      (page - 1) * limit;

    const where = search
      ? {
          OR: [
            {
              email: {
                contains: search,
                mode: 'insensitive' as const,
              },
            },

            {
              phoneNumber: {
                contains: search,
                mode: 'insensitive' as const,
              },
            },
          ],
        }
      : {};

    const [items, total] =
      await Promise.all([
        this.prisma.user.findMany({
          where,

          skip,

          take: limit,

          orderBy: {
            createdAt: 'desc',
          },

          include: {
            profile: {
              select: {
                firstName: true,

                lastName: true,

                username: true,
              },
            },

            wallet: {
              select: {
                walletNumber: true,

                walletHandle: true,

                availableBalance: true,

                lockedBalance: true,
              },
            },

            kyc: {
              select: {
                status: true,
              },
            },
          },
        }),

        this.prisma.user.count({
          where,
        }),
      ]);

    return {
      items,

      pagination: {
        total,

        page,

        limit,

        totalPages: Math.ceil(
          total / limit,
        ),
      },
    };
  }

  async findById(
    id: string,
  ) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },

      include: {
        profile: true,

        wallet: true,

        kyc: true,

        taskSubmissions: {
          take: 10,

          orderBy: {
            createdAt: 'desc',
          },

          include: {
            task: {
              select: {
                id: true,

                title: true,

                rewardAmount: true,
              },
            },
          },
        },

        adRewardClaims: {
          take: 10,

          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }
}