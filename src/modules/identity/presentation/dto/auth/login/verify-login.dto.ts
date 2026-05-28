import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';

export class VerifyLoginDto {
  @IsString()
  @IsNotEmpty()
  @IsPhoneNumber('IN')
  phone!: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 6)
  otp!: string;

  @IsString()
  @IsNotEmpty()
  source!: string;
}