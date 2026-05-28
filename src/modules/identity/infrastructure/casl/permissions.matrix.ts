import { Role } from '../../domain/enums/role.enum';

export const PERMISSIONS_MATRIX = {
  [Role.SUPER_ADMIN]: ['*'],

  [Role.SUPPORT_ADMIN]: [
    'users.read',
    'users.update',
    'kyc.read',
  ],

  [Role.FINANCE_ADMIN]: [
    'wallet.read',
    'wallet.credit',
    'withdrawal.approve',
  ],

  [Role.KYC_AGENT]: [
    'kyc.read',
    'kyc.update',
  ],

  [Role.MODERATOR]: [
    'tasks.read',
    'tasks.update',
  ],

  [Role.USER]: [],
};