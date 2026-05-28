import {
  Controller,
  Param,
  Patch,
  Req,
  Get,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '@common/guards/auth/jwt-auth.guard';
import { ApproveTaskSubmissionUseCase } from '@modules/task-submissions/application/use-cases/approve-task-submission.usecase';

import { GetPendingTaskSubmissionsUseCase } from '@modules/task-submissions/application/use-cases/get-pending-task-submissions.usecase';

@Controller('admin/task-submissions')
@UseGuards(JwtAuthGuard)
export class AdminTaskSubmissionController {
  constructor(
    private readonly getPending:
      GetPendingTaskSubmissionsUseCase,

      private readonly approveSubmission:
      ApproveTaskSubmissionUseCase,
  ) {}

  @Patch(':id/approve')
async approve(
  @Param('id') id: string,

  @Req() req: any,
) {
  return this.approveSubmission.execute({
    submissionId: id,

    reviewedBy: req.user.sub,
  });
}

  @Get('pending')
  async pending() {
    return this.getPending.execute();
  }
}