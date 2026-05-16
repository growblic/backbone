import {
  IsNotEmpty,
  IsPhoneNumber,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class StartRegisterDto {
  @ApiProperty({
    example: '+919876543210',
    description:
      'User mobile number with country code',
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  phone!: string;
}