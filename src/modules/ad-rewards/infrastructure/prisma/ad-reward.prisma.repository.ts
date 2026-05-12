import {
  Injectable,
} from '@nestjs/common';

import { PrismaService }
from '@infra/prisma/prisma.service';

import { AdRewardRepository }
from '@modules/ad-rewards/domain/repositories/ad-reward.repository';

@Injectable()
export class AdRewardPrismaRepository
  implements AdRewardRepository {

  constructor(
    private readonly prisma:
      PrismaService,
  ) {}

  async createCampaign(
    data: any,
  ) {
    return this.prisma.adRewardCampaign.create({
      data,
    });
  }

  async findCampaignById(
    campaignId: string,
  ) {
    return this.prisma.adRewardCampaign.findUnique({
      where: {
        id: campaignId,
      },
    });
  }

  async findActiveCampaigns() {
    return this.prisma.adRewardCampaign.findMany({
      where: {
        isActive: true,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async createClaim(
    data: any,
  ) {
    return this.prisma.adRewardClaim.create({
      data,
    });
  }

  async countUserClaimsToday(
    userId: string,
    campaignId: string,
  ) {
    const startOfDay =
      new Date();

    startOfDay.setHours(
      0,
      0,
      0,
      0,
    );

    return this.prisma.adRewardClaim.count({
      where: {
        userId,
        campaignId,

        createdAt: {
          gte: startOfDay,
        },
      },
    });
  }

  async hasRecentClaim(
    userId: string,
    campaignId: string,
    cooldownMinutes: number,
  ) {
    const cooldownTime =
      new Date(
        Date.now() -
        cooldownMinutes *
        60 *
        1000,
      );

    const claim =
      await this.prisma.adRewardClaim.findFirst({
        where: {
          userId,
          campaignId,

          createdAt: {
            gte: cooldownTime,
          },
        },
      });

    return !!claim;
  }
}