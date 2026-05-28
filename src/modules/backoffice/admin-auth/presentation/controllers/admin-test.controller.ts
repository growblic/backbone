import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';

import { CurrentAdmin } from '../../../../../common/decorators/current-admin.decorator';

import { AdminJwtGuard } from '../../infrastructure/guards/admin-jwt.guard';

@Controller(
  'backoffice/test',
)
export class AdminTestController {
  @Get()
  @UseGuards(AdminJwtGuard)
  getProtectedRoute(
    @CurrentAdmin()
    admin: any,
  ) {
    return {
      success: true,

      message:
        'Protected admin route working',

      admin,
    };
  }
}