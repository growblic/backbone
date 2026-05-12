import { Controller, Get, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '@modules/identity/presentation/guards/jwt-auth.guard';

import { CurrentUser } from '@common/decorators/current-user.decorator';

@Controller('me')
export class MeController {
  @Get()
  @UseGuards(JwtAuthGuard)
  getMe(@CurrentUser() user: any) {
    return {
      message: 'Protected route accessed',
      user,
    };
  }
}