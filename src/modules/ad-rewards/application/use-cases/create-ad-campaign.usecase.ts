import {
  Inject,
  Injectable,
} from '@nestjs/common';

import { AdRewardRepository }
from '@modules/ad-rewards/domain/repositories/ad-reward.repository';

@Injectable()
export class CreateAdCampaignUseCase {
  constructor(
    @Inject( AdRewardRepository )
    private readonly adRepo:
      AdRewardRepository,
  ) {}

  async execute(data: {
    title: string;

    description?: string;

    rewardAmount: number;

    dailyLimit: number;

    totalLimit?: number;

    adsProvider: string;

    placementId: string;
  }) {
    return this.adRepo.createCampaign({
      ...data,

      isActive: true,
    });
  }
}