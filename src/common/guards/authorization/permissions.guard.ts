import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';

import { Reflector }
from '@nestjs/core';

import {
  PERMISSIONS_KEY,
} from '../../decorators/permissions.decorator';

import { Permission }
from '@modules/identity/domain/enums/permission.enum';

import { Role }
from '@modules/identity/domain/enums/role.enum';

import { ROLE_PERMISSIONS_MAP }
from '@modules/identity/domain/permissions/role-permissions.map';

@Injectable()
export class PermissionsGuard
  implements CanActivate
{
  constructor(
    private readonly reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean {
    // =====================================================
    // 🎯 REQUIRED PERMISSIONS
    // =====================================================

    const requiredPermissions =
      this.reflector.getAllAndOverride<
        Permission[]
      >(PERMISSIONS_KEY, [
        context.getHandler(),

        context.getClass(),
      ]);

    // =====================================================
    // ✅ NO PERMISSION REQUIRED
    // =====================================================

    if (
      !requiredPermissions ||
      requiredPermissions.length === 0
    ) {
      return true;
    }

    // =====================================================
    // 👤 REQUEST
    // =====================================================

    const request =
      context
        .switchToHttp()
        .getRequest();

    // =====================================================
    // 👤 USER
    // =====================================================

    const user = request.user;

    // =====================================================
    // ❌ NO USER
    // =====================================================

    if (!user) {
      return false;
    }

    // =====================================================
    // 👑 USER ROLE
    // =====================================================

    const role: Role =
      user.role;

    // =====================================================
    // 👑 SUPER ADMIN BYPASS
    // =====================================================

    if (
      role === Role.SUPER_ADMIN
    ) {
      return true;
    }

    // =====================================================
    // 🔐 ROLE PERMISSIONS
    // =====================================================

    const userPermissions =
      ROLE_PERMISSIONS_MAP[
        role
      ] || [];

    // =====================================================
    // ✅ CHECK PERMISSIONS
    // =====================================================

    return requiredPermissions.every(
      (permission) =>
        userPermissions.includes(
          permission,
        ),
    );
  }
}