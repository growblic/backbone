import {
  IsEmail,
  IsNegative,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

export class AdminLoginDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password!: string;
} 