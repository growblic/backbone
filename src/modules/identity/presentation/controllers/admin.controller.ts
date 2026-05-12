import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../guards/jwt-auth.guard';

import { RolesGuard } from '../guards/roles.guard';

import { Roles } from '../decorators/roles.decorator';
import { Role } from '@modules/identity/domain/enums/role.enum';

@Controller('admin')
export class AdminController {
  @Get('test')
  @UseGuards(
    JwtAuthGuard,
    RolesGuard,
  )
  @Roles(Role.ADMIN)
  testAdminRoute() {
    return {
      message:
        'Welcome Admin 👑',
    };
  }
}