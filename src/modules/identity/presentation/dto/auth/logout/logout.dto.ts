import {
  IsNotEmpty,
  IsUUID,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class LogoutDto {
  @ApiProperty({
    example:
      '550e8400-e29b-41d4-a716-446655440000',
    description:
      'Active user session id',
  })
  @IsUUID()
  @IsNotEmpty()
  sessionId!: string;
}