import {
  Inject,
  Injectable,
} from '@nestjs/common';

import { TaskSubmissionRepository } from '@modules/task-submissions/domain/repositories/task-submission.repository';

@Injectable()
export class GetPendingTaskSubmissionsUseCase {
  constructor(
    @Inject(TaskSubmissionRepository)
    private readonly submissionRepo: TaskSubmissionRepository,
  ) {}

  async execute() {
    return this.submissionRepo.getPendingSubmissions();
  }
}