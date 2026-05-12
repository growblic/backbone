import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { TaskSubmissionRepository } from '@modules/task-submissions/domain/repositories/task-submission.repository';

import { TaskRepository } from '@modules/task-catalog/domain/repositories/task.repository';

@Injectable()
export class SubmitTaskSubmissionUseCase {
  constructor(
    @Inject(TaskSubmissionRepository)
    private readonly submissionRepo: TaskSubmissionRepository,

    @Inject('TaskRepository')
    private readonly taskRepo: TaskRepository,
  ) {}

  async execute(data: {
    userId: string;

    taskId: string;

    submissionData: any;
  }) {
    // FIND TASK
    const task =
      await this.taskRepo.findById(
        data.taskId,
      );

    if (!task) {
      throw new NotFoundException(
        'Task not found',
      );
    }

    // TASK MUST BE ACTIVE
    if (task.status !== 'ACTIVE') {
      throw new BadRequestException(
        'Task is not active',
      );
    }

    // CHECK EXPIRY
    if (
      task.expiresAt &&
      new Date(task.expiresAt) <
        new Date()
    ) {
      throw new BadRequestException(
        'Task expired',
      );
    }

    // CHECK DUPLICATE SUBMISSION
    const existing =
      await this.submissionRepo.findUserSubmission(
        data.userId,
        data.taskId,
      );

    if (existing) {
      throw new BadRequestException(
        'Task already submitted',
      );
    }

    // CREATE SUBMISSION
    return this.submissionRepo.create({
      userId: data.userId,

      taskId: data.taskId,

      submissionData:
        data.submissionData,
    });
  }
}