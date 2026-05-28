import {
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '@common/guards/auth/jwt-auth.guard';

import { CreateAdCampaignUseCase } from '@modules/ad-rewards/application/use-cases/create-ad-campaign.usecase';

import { CreateAdCampaignDto } from '../dto/create-ad-campaign.dto';

@Controller('admin/ad-rewards')
@UseGuards(JwtAuthGuard)
export class AdminAdRewardController {
  constructor(
    private readonly createCampaign:
      CreateAdCampaignUseCase,
  ) {}

  @Post('campaigns')
  async create(
    @Body()
    body: CreateAdCampaignDto,
  ) {
    return this.createCampaign.execute(
      body,
    );
  }
}