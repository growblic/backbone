import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';

import { GetPublicTasksUseCase } from '@modules/task-catalog/application/use-cases/get-public-tasks.usecase';

import { GetTasksQueryDto } from '../dto/get-tasks-query.dto';

@Controller('tasks')
export class TaskController {
  constructor(
    private readonly getTasks:
      GetPublicTasksUseCase,
  ) {}

  @Get()
  async findAll(
    @Query()
    query: GetTasksQueryDto,
  ) {
    return this.getTasks.execute(
      query,
    );
  }
}