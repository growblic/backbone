import {
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class GetAdminUsersDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  @IsString()
  search?: string;
}