import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
} from 'class-validator';

export class VerifyRegisterDto {
  @IsNotEmpty()
  @IsPhoneNumber()
  phone!: string;

  @IsString()
  @Length(4, 6)
  otp!: string;

  @IsString()
  @IsNotEmpty()
  country!: string;

  @IsString()
  @IsNotEmpty()
  source!: string;
}