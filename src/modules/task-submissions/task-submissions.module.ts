import { Module } from '@nestjs/common';

import { PrismaModule } from '@infra/prisma/prisma.module';

import { IdentityModule } from '@modules/identity/identity.module';

import { TaskCatalogModule } from '@modules/task-catalog/task-catalog.module';

import { TaskSubmissionRepository } from '@modules/task-submissions/domain/repositories/task-submission.repository';
import { WalletsModule } from '@modules/wallets/wallets.module';

import { ApproveTaskSubmissionUseCase } from '@modules/task-submissions/application/use-cases/approve-task-submission.usecase';

import { TaskSubmissionPrismaRepository } from '@modules/task-submissions/infrastructure/prisma/task-submission.prisma.repository';

import { SubmitTaskSubmissionUseCase } from '@modules/task-submissions/application/use-cases/submit-task-submission.usecase';

import { TaskSubmissionController } from '@modules/task-submissions/presentation/controllers/task-submission.controller';
import { AdminTaskSubmissionController } from '@modules/task-submissions/presentation/controllers/admin-task-submission.controller';

import { GetPendingTaskSubmissionsUseCase } from '@modules/task-submissions/application/use-cases/get-pending-task-submissions.usecase';

@Module({
  imports: [
    PrismaModule,
    IdentityModule,
    TaskCatalogModule,
    WalletsModule,
  ],

  controllers: [
    TaskSubmissionController,
    AdminTaskSubmissionController,
  ],

  providers: [
    SubmitTaskSubmissionUseCase,
    GetPendingTaskSubmissionsUseCase,
    ApproveTaskSubmissionUseCase,

    {
      provide:
        TaskSubmissionRepository,

      useClass:
        TaskSubmissionPrismaRepository,
    },
  ],

  exports: [
    TaskSubmissionRepository,
  ],
})
export class TaskSubmissionsModule {}