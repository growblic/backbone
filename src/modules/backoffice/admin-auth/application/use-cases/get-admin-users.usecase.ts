import { Injectable } from '@nestjs/common';

import { AdminUsersPrismaRepository } from '../../infrastructure/repositories/admin-user.prisma.repository';

@Injectable()
export class GetAdminUsersUseCase {
  constructor(
    private readonly adminUsersRepository: AdminUsersPrismaRepository,
  ) {}

  async execute(
    page = 1,
    limit = 20,
    search?: string,
  ) {
    const result =
      await this.adminUsersRepository.findMany(
        page,
        limit,
        search,
      );

    return {
      success: true,

      data: {
        items: result.items,

        pagination:
          result.pagination,
      },
    };
  }
}