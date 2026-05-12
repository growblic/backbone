import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  shortDescription?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  rewardAmount?: number;

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