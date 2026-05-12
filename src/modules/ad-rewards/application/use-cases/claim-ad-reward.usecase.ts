import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { AdRewardRepository }
from '@modules/ad-rewards/domain/repositories/ad-reward.repository';

import { WalletRepository }
from '@modules/wallets/domain/repositories/wallet.repository';

@Injectable()
export class ClaimAdRewardUseCase {
  constructor(
    @Inject( AdRewardRepository )
    private readonly adRepo:
      AdRewardRepository,

    @Inject(
      'WalletRepository',
    )
    private readonly walletRepo:
      WalletRepository,
  ) {}

  async execute(data: {
    userId: string;

    campaignId: string;

    providerTransactionId?: string;
  }) {

    const campaign =
      await this.adRepo.findCampaignById(
        data.campaignId,
      );

    if (!campaign) {
      throw new NotFoundException(
        'Campaign not found',
      );
    }

    if (!campaign.isActive) {
      throw new BadRequestException(
        'Campaign inactive',
      );
    }

    const todayClaims =
      await this.adRepo.countUserClaimsToday(
        data.userId,
        data.campaignId,
      );

    if (
      todayClaims >=
      campaign.dailyLimit
    ) {
      throw new BadRequestException(
        'Daily limit exceeded',
      );
    }

    const hasCooldown =
      await this.adRepo.hasRecentClaim(
        data.userId,
        data.campaignId,
        1,
      );

    if (hasCooldown) {
      throw new BadRequestException(
        'Please wait before next claim',
      );
    }

    const claim =
      await this.adRepo.createClaim({
        userId:
          data.userId,

        campaignId:
          data.campaignId,

        rewardAmount:
          campaign.rewardAmount,

        providerTransactionId:
          data.providerTransactionId,
      });

    await this.walletRepo.credit({
      userId:
        data.userId,

      amount:
        campaign.rewardAmount,

      currency:
        'INR',

      reason:
        'AD_REWARD',

      referenceId:
        claim.id,
    });

    return {
      success: true,

      rewardAmount:
        campaign.rewardAmount,

      claim,
    };
  }
}