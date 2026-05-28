import {
  Inject,
  Injectable,
} from '@nestjs/common';

import { TaskRepository } from '@modules/task-catalog/domain/repositories/task.repository';

@Injectable()
export class GetActiveTasksUseCase {
  constructor(
    @Inject('TaskRepository')
    private readonly taskRepo: TaskRepository,
  ) {}

  async execute() {
    return this.taskRepo.findActiveTasks();
  }
}