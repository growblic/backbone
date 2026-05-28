import { Permission } from '../enums/permission.enum';

import { Role } from '../enums/role.enum';

export const ROLE_PERMISSIONS_MAP: Record<
  Role,
  Permission[]
> = {
  // =====================================================
  // 👤 USER
  // =====================================================

  [Role.USER]: [],

  // =====================================================
  // 👑 SUPER ADMIN
  // =====================================================

  [Role.SUPER_ADMIN]: [
    ...Object.values(Permission),
  ],

  // =====================================================
  // 🎧 SUPPORT ADMIN
  // =====================================================

  [Role.SUPPORT_ADMIN]: [
    // USERS
    Permission.USER_READ,

    Permission.USER_BLOCK,

    // SUPPORT
    Permission.SUPPORT_TICKET_READ,

    Permission.SUPPORT_TICKET_REPLY,

    // KYC VIEW
    Permission.KYC_READ,
  ],

  // =====================================================
  // 💰 FINANCE ADMIN
  // =====================================================

  [Role.FINANCE_ADMIN]: [
    // WALLET
    Permission.WALLET_READ,

    Permission.WALLET_CREDIT,

    Permission.WALLET_DEBIT,

    // WITHDRAWALS
    Permission.WITHDRAWAL_APPROVE,

    Permission.WITHDRAWAL_REJECT,

    Permission.WITHDRAWAL_READ,

    // TRANSACTIONS
    Permission.TRANSACTION_READ,
  ],

  // =====================================================
  // 🪪 KYC AGENT
  // =====================================================

  [Role.KYC_AGENT]: [
    Permission.KYC_READ,

    Permission.KYC_APPROVE,

    Permission.KYC_REJECT,
  ],

  // =====================================================
  // 🛡️ MODERATOR
  // =====================================================

  [Role.MODERATOR]: [
    // USERS
    Permission.USER_READ,

    Permission.USER_BLOCK,

    // TASKS
    Permission.TASK_READ,

    Permission.TASK_APPROVE,

    Permission.TASK_REJECT,
  ],
};