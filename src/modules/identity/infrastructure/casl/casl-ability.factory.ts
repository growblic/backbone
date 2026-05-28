import { Injectable } from '@nestjs/common';

import {
  AbilityBuilder,
  createMongoAbility,
} from '@casl/ability';

import { PERMISSIONS_MATRIX } from './permissions.matrix';

@Injectable()
export class CaslAbilityFactory {
  createForRole(role: string) {
    const { can, build } =
      new AbilityBuilder(createMongoAbility);

    const permissions =
      PERMISSIONS_MATRIX[role] || [];

    if (permissions.includes('*')) {
      can('manage', 'all');
    }

    for (const permission of permissions) {
      const [action, subject] =
        permission.split('.');

      can(action, subject);
    }

    return build();
  }
}