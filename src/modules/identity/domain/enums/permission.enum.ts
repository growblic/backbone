export enum Permission {
  // =====================================================
  // USERS
  // =====================================================

  USER_READ = 'USER_READ',

  USER_BLOCK = 'USER_BLOCK',

  USER_CREATE = 'USER_CREATE',

  USER_UPDATE = 'USER_UPDATE',

  // =====================================================
  // TASKS
  // =====================================================

  TASK_READ = 'TASK_READ',

  TASK_CREATE = 'TASK_CREATE',

  TASK_UPDATE = 'TASK_UPDATE',

  TASK_DELETE = 'TASK_DELETE',

  TASK_APPROVE = 'TASK_APPROVE',

  TASK_REJECT = 'TASK_REJECT',

  // =====================================================
  // WALLET
  // =====================================================

  WALLET_READ = 'WALLET_READ',

  WALLET_CREDIT = 'WALLET_CREDIT',

  WALLET_DEBIT = 'WALLET_DEBIT',

  // =====================================================
  // WITHDRAWALS
  // =====================================================

  WITHDRAWAL_READ = 'WITHDRAWAL_READ',

  WITHDRAWAL_APPROVE =
    'WITHDRAWAL_APPROVE',

  WITHDRAWAL_REJECT =
    'WITHDRAWAL_REJECT',

  // =====================================================
  // TRANSACTIONS
  // =====================================================

  TRANSACTION_READ =
    'TRANSACTION_READ',

  // =====================================================
  // SUPPORT
  // =====================================================

  SUPPORT_TICKET_READ =
    'SUPPORT_TICKET_READ',

  SUPPORT_TICKET_REPLY =
    'SUPPORT_TICKET_REPLY',

  // =====================================================
  // KYC
  // =====================================================

  KYC_READ = 'KYC_READ',

  KYC_APPROVE = 'KYC_APPROVE',

  KYC_REJECT = 'KYC_REJECT',
}