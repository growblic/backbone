import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class VerifyRegisterDto {
  @ApiProperty({
    example: '+919876543210',
    description:
      'User mobile number with country code',
  })
  @IsNotEmpty() 
  @IsPhoneNumber()
  phone!: string;

  @ApiProperty({
    example: '123456',
    description: '6 digit OTP',
  })
  @IsString()
  @Length(4, 6)
  otp!: string;

  @ApiProperty({
    example: 'India',
    description: 'User country name',
  })
  @IsString()
  @IsNotEmpty()
  country!: string;

  @ApiProperty({
    example: 'android',
    description:
      'Device source like android, ios or web',
  })
  @IsString()
  @IsNotEmpty()
  source!: string;
}