import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard }
from '@common/guards/auth/jwt-auth.guard';

import { CurrentUser }
from '@common/decorators/current-user.decorator';

@Controller('me')
export class MeController {
  // =====================================================
  // 👤 CURRENT USER
  // =====================================================

  @Get()

  @UseGuards(JwtAuthGuard)

  getMe(
    @CurrentUser() user: any,
  ) {
    return {
      success: true,

      message:
        'Current user fetched successfully',

      data: {
        id: user.id,

        phone: user.phone,

        role: user.role,

        country: user.country,

        source: user.source,
      },
    };
  }
}