export abstract class AdRewardRepository {
  abstract createCampaign(
    data: any,
  ): Promise<any>;

  abstract findCampaignById(
    campaignId: string,
  ): Promise<any>;

  abstract findActiveCampaigns():
    Promise<any[]>;

  abstract createClaim(
    data: any,
  ): Promise<any>;

  abstract countUserClaimsToday(
    userId: string,
    campaignId: string,
  ): Promise<number>;

  abstract hasRecentClaim(
    userId: string,
    campaignId: string,
    cooldownMinutes: number,
  ): Promise<boolean>;
}