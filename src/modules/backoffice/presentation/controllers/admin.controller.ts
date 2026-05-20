import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard }
from '@common/guards/auth/jwt-auth.guard';

import { RolesGuard }
from '@common/guards/authorization/roles.guard';

import { PermissionsGuard }
from '@common/guards/authorization/permissions.guard';

import { Roles }
from '@common/decorators/roles.decorator';

import { Permissions }
from '@common/decorators/permissions.decorator';

import { Role }
from '@modules/identity/domain/enums/role.enum';

import { Permission }
from '@modules/identity/domain/enums/permission.enum';


@Controller('admin')
export class AdminController {
  // =====================================================
  // 👑 SUPER ADMIN TEST
  // =====================================================

  @Get('test')

  @UseGuards(
    JwtAuthGuard,

    RolesGuard,

    PermissionsGuard,
  )

  @Roles(Role.SUPER_ADMIN)

  @Permissions(
    Permission.USER_READ,
  )

  testAdminRoute() {
    return {
      success: true,

      message:
        'Welcome Super Admin 👑',
    };
  }
}