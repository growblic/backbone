import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { randomUUID } from 'crypto';

import { TaskSubmissionRepository } from '@modules/task-submissions/domain/repositories/task-submission.repository';

import { WalletRepository } from '@modules/wallets/domain/repositories/wallet.repository';

@Injectable()
export class ApproveTaskSubmissionUseCase {
  constructor(
  private readonly taskSubmissionRepo: TaskSubmissionRepository,

  @Inject('WalletRepository')
  private readonly walletRepo: WalletRepository,
) {}

  async execute(data: {
    submissionId: string;

    reviewedBy: string;
  }) {
    // FIND SUBMISSION
    const submission =
      await this.taskSubmissionRepo.findById(
        data.submissionId,
      );

    if (!submission) {
      throw new NotFoundException(
        'Submission not found',
      );
    }

    // ALREADY REVIEWED
    if (
      submission.status !== 'PENDING'
    ) {
      throw new BadRequestException(
        'Submission already reviewed',
      );
    }

    // REWARD ALREADY GIVEN
    if (
      submission.rewardTransactionId
    ) {
      throw new BadRequestException(
        'Reward already processed',
      );
    }

    // FIND USER WALLET
    const wallet =
      await this.walletRepo.findByUserId(
        submission.userId,
      );

    if (!wallet) {
      throw new NotFoundException(
        'Wallet not found',
      );
    }

    // CREDIT REWARD
    const updatedWallet =
      await this.walletRepo.incrementBalance(
        wallet.id,

        submission.task.rewardAmount,
      );

    // CREATE TRANSACTION
    const transaction =
      await this.walletRepo.createTransaction(
        {
          referenceId:
            randomUUID(),

          receiverWalletId:
            wallet.id,

          amount:
            submission.task.rewardAmount,

          type: 'TASK_REWARD',

          status: 'SUCCESS',

          note:
            'Task reward credited',
        },
      );

    // SAVE REWARD TX
    await this.taskSubmissionRepo.attachRewardTransaction(
      submission.id,

      transaction.id,
    );

    // APPROVE SUBMISSION
    await this.taskSubmissionRepo.approve(
      submission.id,

      data.reviewedBy,
    );

    return {
      success: true,

      reward:
        submission.task.rewardAmount,

      walletBalance:
        updatedWallet.availableBalance,
    };
  }
}