import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class VerifyLoginDto {
  @ApiProperty({
    example: '+919876543210',
    description:
      'Registered mobile number with country code',
  })
  @IsNotEmpty()
  @IsPhoneNumber()
  phone!: string;

  @ApiProperty({
    example: '123456',
    description: 'Login OTP',
  })
  @IsString()
  @Length(4, 6)
  otp!: string;

  @ApiProperty({
    example: 'android',
    description:
      'Device source like android, ios or web',
  })
  @IsString()
  @IsNotEmpty()
  source!: string;
}