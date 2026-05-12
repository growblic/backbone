import {
  Inject,
  Injectable,
} from '@nestjs/common';

import { TaskRepository } from '@modules/task-catalog/domain/repositories/task.repository';

@Injectable()
export class CreateTaskUseCase {
  constructor(
    @Inject('TaskRepository')
    private readonly taskRepo: TaskRepository,
  ) {}

  async execute(data: {
    title: string;

    slug: string;

    shortDescription: string;

    description: string;

    type: string;

    rewardAmount: number;

    metadata?: any;

    instructions?: any;

    validationRules?: any;

    isFeatured?: boolean;
  }) {
    const existingTask =
      await this.taskRepo.findBySlug(
        data.slug,
      );

    if (existingTask) {
      throw new Error(
        'Task slug already exists',
      );
    }

    return this.taskRepo.create({
      ...data,

      status: 'ACTIVE',
    });
  }
}