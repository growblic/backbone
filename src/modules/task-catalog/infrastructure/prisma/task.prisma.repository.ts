import {
  Inject,
  Injectable,
} from '@nestjs/common';

import { PrismaService } from '@infra/prisma/prisma.service';

import { TaskRepository } from '@modules/task-catalog/domain/repositories/task.repository';

@Injectable()
export class TaskPrismaRepository
  implements TaskRepository
{
  constructor(
    @Inject(PrismaService)
    private readonly prisma: PrismaService,
  ) {}

  async create(data: any) {
    return this.prisma.task.create({
      data,
    });
  }

  async update(
    taskId: string,
    data: any,
  ) {
    return this.prisma.task.update({
      where: {
        id: taskId,
      },

      data,
    });
  }

  async pause(taskId: string) {
  return this.prisma.task.update({
    where: {
      id: taskId,
    },

    data: {
      status: 'PAUSED',
    },
  });
}

async activate(taskId: string) {
  return this.prisma.task.update({
    where: {
      id: taskId,
    },

    data: {
      status: 'ACTIVE',
    },
  });
}

  async delete(taskId: string) {
    return this.prisma.task.update({
      where: {
        id: taskId,
      },

      data: {
        status: 'DELETED',
      },
    });
  }

  async findById(
    taskId: string,
  ) {
    return this.prisma.task.findUnique({
      where: {
        id: taskId,
      },
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.task.findUnique({
      where: {
        slug,
      },
    });
  }

  async findAll() {
    return this.prisma.task.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findPublicTasks(data: {
  page: number;

  limit: number;

  type?: string;

  featured?: boolean;

  search?: string;
}) {
  const where: any = {
    status: 'ACTIVE',
  };

  if (data.type) {
    where.type = data.type;
  }

  if (
    typeof data.featured ===
    'boolean'
  ) {
    where.isFeatured =
      data.featured;
  }

  if (data.search) {
    where.OR = [
      {
        title: {
          contains:
            data.search,

          mode: 'insensitive',
        },
      },

      {
        shortDescription: {
          contains:
            data.search,

          mode: 'insensitive',
        },
      },
    ];
  }

  const skip =
    (data.page - 1) *
    data.limit;

  const [items, total] =
    await Promise.all([
      this.prisma.task.findMany({
        where,

        skip,

        take: data.limit,

        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.task.count({
        where,
      }),
    ]);

  return {
    items,

    pagination: {
      page: data.page,

      limit: data.limit,

      total,

      totalPages: Math.ceil(
        total / data.limit,
      ),
    },
  };
}

  async findActiveTasks() {
    return this.prisma.task.findMany({
      where: {
        status: 'ACTIVE',
      },

      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}