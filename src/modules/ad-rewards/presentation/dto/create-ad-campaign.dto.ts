import {
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateAdCampaignDto {

  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @Min(1)
  rewardAmount!: number;

  @IsInt()
  @Min(1)
  dailyLimit!: number;

  @IsOptional()
  @IsInt()
  totalLimit?: number;

  @IsString()
  adsProvider!: string;

  @IsString()
  placementId!: string;
}