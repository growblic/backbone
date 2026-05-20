import {
  IsNotEmpty,
  IsPhoneNumber,
} from 'class-validator';

export class StartRegisterDto {
  @IsNotEmpty()
  @IsPhoneNumber()
  phone!: string;
}