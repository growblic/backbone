import { Module } from '@nestjs/common';

import { PrismaModule }
from '@infra/prisma/prisma.module';

import { WalletsModule }
from '@modules/wallets/wallets.module';

import { IdentityModule }
from '@modules/identity/identity.module';

import { AdRewardRepository }
from '@modules/ad-rewards/domain/repositories/ad-reward.repository';

import { AdRewardPrismaRepository }
from '@modules/ad-rewards/infrastructure/prisma/ad-reward.prisma.repository';

import { CreateAdCampaignUseCase }
from '@modules/ad-rewards/application/use-cases/create-ad-campaign.usecase';

import { ClaimAdRewardUseCase }
from '@modules/ad-rewards/application/use-cases/claim-ad-reward.usecase';

import { GetActiveCampaignsUseCase }
from '@modules/ad-rewards/application/use-cases/get-active-campaigns.usecase';

import { AdminAdRewardController }
from '@modules/ad-rewards/presentation/controllers/admin-ad-reward.controller';

import { AdRewardController }
from '@modules/ad-rewards/presentation/controllers/ad-reward.controller';

@Module({
  imports: [
    PrismaModule,
    IdentityModule,
    WalletsModule,
  ],

  controllers: [
    AdminAdRewardController,
    AdRewardController,
  ],

  providers: [
    AdRewardPrismaRepository,

    CreateAdCampaignUseCase,

    ClaimAdRewardUseCase,

    GetActiveCampaignsUseCase,

    {
      provide:
        AdRewardRepository,

      useExisting:
        AdRewardPrismaRepository,
    },
  ],
})
export class AdRewardsModule {}