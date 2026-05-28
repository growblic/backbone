import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '@common/guards/auth/jwt-auth.guard';

import { CreateTaskUseCase } from '@modules/task-catalog/application/use-cases/create-task.usecase';

import { UpdateTaskUseCase } from '@modules/task-catalog/application/use-cases/update-task.usecase';

import { PauseTaskUseCase } from '@modules/task-catalog/application/use-cases/pause-task.usecase';

import { ActivateTaskUseCase } from '@modules/task-catalog/application/use-cases/activate-task.usecase';

import { CreateTaskDto } from '../dto/create-task.dto';

import { UpdateTaskDto } from '../dto/update-task.dto';

@Controller('admin/tasks')
@UseGuards(JwtAuthGuard)
export class AdminTaskController {
  constructor(
    private readonly createTask:
      CreateTaskUseCase,

    private readonly updateTask:
      UpdateTaskUseCase,

    private readonly pauseTask:
      PauseTaskUseCase,

    private readonly activateTask:
      ActivateTaskUseCase,
  ) {}

  @Post()
  async create(
    @Body()
    body: CreateTaskDto,
  ) {
    return this.createTask.execute(
      body,
    );
  }

  @Patch(':taskId')
  async update(
    @Param('taskId')
    taskId: string,

    @Body()
    body: UpdateTaskDto,
  ) {
    return this.updateTask.execute(
      taskId,
      body,
    );
  }

  @Patch(':taskId/pause')
  async pause(
    @Param('taskId')
    taskId: string,
  ) {
    return this.pauseTask.execute(
      taskId,
    );
  }

  @Patch(':taskId/activate')
  async activate(
    @Param('taskId')
    taskId: string,
  ) {
    return this.activateTask.execute(
      taskId,
    );
  }
}