import {
  Inject,
  Injectable,
} from '@nestjs/common';

import { AdRewardRepository }
from '@modules/ad-rewards/domain/repositories/ad-reward.repository';

@Injectable()
export class GetActiveCampaignsUseCase {
  constructor(
    @Inject(AdRewardRepository)
    private readonly adRewardRepo:
      AdRewardRepository,
  ) {}

  async execute() {
    return this.adRewardRepo.findActiveCampaigns();
  }
}