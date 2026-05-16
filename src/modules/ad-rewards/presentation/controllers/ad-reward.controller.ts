import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard }
from '@common/guards/auth/jwt-auth.guard'; 

import { CurrentUser }
from '@common/decorators/current-user.decorator';

import { ClaimAdRewardUseCase }
from '@modules/ad-rewards/application/use-cases/claim-ad-reward.usecase';

import { GetActiveCampaignsUseCase }
from '@modules/ad-rewards/application/use-cases/get-active-campaigns.usecase';

@Controller('ad-rewards')
@UseGuards(JwtAuthGuard)
export class AdRewardController {
  constructor(
    private readonly claimAdReward:
      ClaimAdRewardUseCase,

    private readonly getActiveCampaigns:
      GetActiveCampaignsUseCase,
  ) {}

  @Get('campaigns')
  async getCampaigns() {
    return this.getActiveCampaigns.execute();
  }

  @Post('claim')
  async claim(
    @CurrentUser()
    user: any,

    @Body()
    body: {
      campaignId: string;

      providerTransactionId: string;
    },
  ) {
    return this.claimAdReward.execute({
      userId: user.id,

      campaignId:
        body.campaignId,

      providerTransactionId:
        body.providerTransactionId,
    });
  }
}