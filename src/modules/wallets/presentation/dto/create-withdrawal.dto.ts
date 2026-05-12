import {
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsNumber,
} from 'class-validator';

export class CreateWithdrawalDto {
  @IsNumber()
  @IsPositive()
  amount!: number;

  @IsOptional()
  @IsString()
  bankName?: string;

  @IsOptional()
  @IsString()
  accountNumber?: string;

  @IsOptional()
  @IsString()
  ifscCode?: string;

  @IsOptional()
  @IsString()
  upiId?: string;
}