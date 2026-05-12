import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { TaskRepository } from '@modules/task-catalog/domain/repositories/task.repository';

@Injectable()
export class ActivateTaskUseCase {
  constructor(
    @Inject('TaskRepository')
    private readonly taskRepo: TaskRepository,
  ) {}

  async execute(taskId: string) {
    const task =
      await this.taskRepo.findById(
        taskId,
      );

    if (!task) {
      throw new NotFoundException(
        'Task not found',
      );
    }

    return this.taskRepo.activate(
      taskId,
    );
  }
}