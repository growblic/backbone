import {
  IsNotEmpty,
  IsPhoneNumber,
} from 'class-validator';


export class StartLoginDto {
  @IsNotEmpty()
  @IsPhoneNumber()
  phone!: string;
}