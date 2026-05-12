import { Module } from '@nestjs/common';

import { PrismaModule } from '@infra/prisma/prisma.module';

import { IdentityModule } from '@modules/identity/identity.module';

import { TaskPrismaRepository } from '@modules/task-catalog/infrastructure/prisma/task.prisma.repository';

import { CreateTaskUseCase } from '@modules/task-catalog/application/use-cases/create-task.usecase';

import { GetActiveTasksUseCase } from '@modules/task-catalog/application/use-cases/get-active-tasks.usecase';

import { AdminTaskController } from '@modules/task-catalog/presentation/controllers/admin-task.controller';

import { TaskController } from '@modules/task-catalog/presentation/controllers/task.controller';
import { UpdateTaskUseCase } from './application/use-cases/update-task.usecase';

import { PauseTaskUseCase } from '@modules/task-catalog/application/use-cases/pause-task.usecase';

import { ActivateTaskUseCase } from '@modules/task-catalog/application/use-cases/activate-task.usecase';
import { GetPublicTasksUseCase } from '@modules/task-catalog/application/use-cases/get-public-tasks.usecase';

@Module({
  imports: [
    PrismaModule,
    IdentityModule,
  ],

  controllers: [
    AdminTaskController,
    TaskController,
  ],

  providers: [
    TaskPrismaRepository,
    UpdateTaskUseCase,
    GetPublicTasksUseCase,

    PauseTaskUseCase,

ActivateTaskUseCase,

    {
      provide: 'TaskRepository',

      useExisting:
        TaskPrismaRepository,
    },

    CreateTaskUseCase,

    GetActiveTasksUseCase,
  ],

  exports: [
    'TaskRepository',
  ],
})
export class TaskCatalogModule {}