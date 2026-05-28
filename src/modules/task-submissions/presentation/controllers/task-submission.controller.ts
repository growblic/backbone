import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '@common/guards/auth/jwt-auth.guard';

import { SubmitTaskSubmissionUseCase } from '@modules/task-submissions/application/use-cases/submit-task-submission.usecase';

import { CreateTaskSubmissionDto } from '../dto/create-task-submission.dto';

@Controller('tasks/submissions')
@UseGuards(JwtAuthGuard)
export class TaskSubmissionController {
  constructor(
    private readonly submitTask:
      SubmitTaskSubmissionUseCase,
  ) {}

  @Post()
  async submit(
    @Req() req: any,

    @Body()
    body: CreateTaskSubmissionDto,
  ) {
    return this.submitTask.execute({
      userId: req.user.sub,

      taskId: body.taskId,

      submissionData:
        body.submissionData,
    });
  }
}