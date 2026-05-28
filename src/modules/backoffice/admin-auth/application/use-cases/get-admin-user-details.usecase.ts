import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { AdminUsersPrismaRepository } from '../../infrastructure/repositories/admin-user.prisma.repository';

@Injectable()
export class GetAdminUserDetailsUseCase {
  constructor(
    private readonly adminUsersRepository: AdminUsersPrismaRepository,
  ) {}

  async execute(userId: string) {
    const user =
      await this.adminUsersRepository.findById(
        userId,
      );

    if (!user) {
      throw new NotFoundException(
        'User not found',
      );
    }

    return {
      success: true,

      data: user,
    };
  }
}