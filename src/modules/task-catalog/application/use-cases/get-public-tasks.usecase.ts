import {
  Inject,
  Injectable,
} from '@nestjs/common';

import { TaskRepository } from '@modules/task-catalog/domain/repositories/task.repository';

@Injectable()
export class GetPublicTasksUseCase {
  constructor(
    @Inject('TaskRepository')
    private readonly taskRepo: TaskRepository,
  ) {}

  async execute(query: {
    page?: string;

    limit?: string;

    type?: string;

    featured?: string;

    search?: string;
  }) {
    return this.taskRepo.findPublicTasks(
      {
        page: Number(
          query.page || 1,
        ),

        limit: Number(
          query.limit || 10,
        ),

        type: query.type,

        featured:
          query.featured ===
          'true'
            ? true
            : query.featured ===
                'false'
              ? false
              : undefined,

        search: query.search,
      },
    );
  }
}