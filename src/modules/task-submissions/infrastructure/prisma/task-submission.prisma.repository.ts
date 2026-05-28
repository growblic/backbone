import {
  Inject,
  Injectable,
} from '@nestjs/common';

import { PrismaService } from '@infra/prisma/prisma.service';

import { TaskSubmissionRepository } from '@modules/task-submissions/domain/repositories/task-submission.repository';

@Injectable()
export class TaskSubmissionPrismaRepository
  implements TaskSubmissionRepository
{
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  async create(data: {
    userId: string;

    taskId: string;

    submissionData: any;
  }) {
    return this.prisma.taskSubmission.create({
      data: {
        userId: data.userId,

        taskId: data.taskId,

        submissionData:
          data.submissionData,
      },

      include: {
        task: true,

        user: true,
      },
    });
  }

  async findById(
    submissionId: string,
  ) {
    return this.prisma.taskSubmission.findUnique(
      {
        where: {
          id: submissionId,
        },

        include: {
          task: true,

          user: true,
        },
      },
    );
  }

  async findUserSubmission(
    userId: string,

    taskId: string,
  ) {
    return this.prisma.taskSubmission.findFirst(
      {
        where: {
          userId,

          taskId,
        },
      },
    );
  }

  async getPendingSubmissions() {
    return this.prisma.taskSubmission.findMany(
      {
        where: {
          status: 'PENDING',
        },

        include: {
          task: true,

          user: true,
        },

        orderBy: {
          createdAt: 'desc',
        },
      },
    );
  }

  async approve(
    submissionId: string,

    reviewedBy: string,
  ) {
    return this.prisma.taskSubmission.update(
      {
        where: {
          id: submissionId,
        },

        data: {
          status: 'APPROVED',

          reviewedBy,

          reviewedAt:
            new Date(),
        },
      },
    );
  }

  async attachRewardTransaction(
  submissionId: string,

  transactionId: string,
) {
  return this.prisma.taskSubmission.update(
    {
      where: {
        id: submissionId,
      },

      data: {
        rewardTransactionId:
          transactionId,
      },
    },
  );
}

  async reject(
    submissionId: string,

    reviewedBy: string,

    adminRemark?: string,
  ) {
    return this.prisma.taskSubmission.update(
      {
        where: {
          id: submissionId,
        },

        data: {
          status: 'REJECTED',

          reviewedBy,

          adminRemark,

          reviewedAt:
            new Date(),
        },
      },
    );
  }
}