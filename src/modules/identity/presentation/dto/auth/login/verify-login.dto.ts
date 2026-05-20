import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';

export class VerifyLoginDto {
  @IsString()
  @IsNotEmpty()
  phone!: string;
  otp!: string;
  source!: string;
}