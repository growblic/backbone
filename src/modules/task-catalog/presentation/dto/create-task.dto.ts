import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsJSON,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateTaskDto {
  @IsString()
  title!: string;

  @IsString()
  slug!: string;

  @IsString()
  shortDescription!: string;

  @IsString()
  description!: string;

  @IsEnum([
    'APP_RATING',
    'APP_INSTALL',
    'LEAD_GENERATION',
    'CREDIT_CARD',
    'SURVEY',
    'CUSTOM',
  ])
  type!: string;

  @IsInt()
  @Min(1)
  rewardAmount!: number;

  @IsOptional()
  metadata?: any;

  @IsOptional()
  instructions?: any;

  @IsOptional()
  validationRules?: any;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;
}