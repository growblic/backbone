import {
  IsNotEmpty,
  IsPhoneNumber,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class StartLoginDto {
  @ApiProperty({
    example: '+919876543210',
    description:
      'Registered mobile number with country code',
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  phone!: string;
}