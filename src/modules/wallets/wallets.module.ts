import {
  Module,
  forwardRef,
} from '@nestjs/common';

import { PrismaModule } from '@infra/prisma/prisma.module';

import { IdentityModule } from '@modules/identity/identity.module';

import { WalletPrismaRepository } from '@modules/wallets/infrastructure/prisma/wallet.prisma.repository';

import { WalletController } from '@modules/wallets/presentation/controllers/wallet.controller';

import { AdminWalletController } from '@modules/wallets/presentation/controllers/admin-wallet.controller';

import { CreateWalletUseCase } from '@modules/wallets/application/use-cases/create-wallet.usecase';

import { CreditWalletUseCase } from '@modules/wallets/application/use-cases/credit-wallet.usecase';

import { DebitWalletUseCase } from '@modules/wallets/application/use-cases/debit-wallet.usecase';

import { TransferWalletUseCase } from '@modules/wallets/application/use-cases/transfer-wallet.usecase';

import { GetMyWalletUseCase } from '@modules/wallets/application/use-cases/get-my-wallet.usecase';

import { GetWalletTransactionsUseCase } from '@modules/wallets/application/use-cases/get-wallet-transactions.usecase';

import { CreateWithdrawalUseCase } from '@modules/wallets/application/use-cases/create-withdrawal.usecase';

import { ApproveWithdrawalUseCase } from '@modules/wallets/application/use-cases/admin/approve-withdrawal.usecase';

import { RejectWithdrawalUseCase } from '@modules/wallets/application/use-cases/admin/reject-withdrawal.usecase';

@Module({
  imports: [
    PrismaModule,

    forwardRef(
      () => IdentityModule,
    ),
  ],

  controllers: [
    WalletController,

    AdminWalletController,
  ],

  providers: [
    WalletPrismaRepository,

    {
      provide: 'WalletRepository',

      useExisting:
        WalletPrismaRepository,
    },

    CreateWalletUseCase,

    CreditWalletUseCase,

    DebitWalletUseCase,

    TransferWalletUseCase,

    GetMyWalletUseCase,

    GetWalletTransactionsUseCase,

    CreateWithdrawalUseCase,

    ApproveWithdrawalUseCase,

    RejectWithdrawalUseCase,
  ],

  exports: [
    'WalletRepository',

    CreateWalletUseCase,

    CreditWalletUseCase,

    DebitWalletUseCase,

    TransferWalletUseCase,

    GetMyWalletUseCase,

    GetWalletTransactionsUseCase,

    CreateWithdrawalUseCase,
  ],
})
export class WalletsModule {}