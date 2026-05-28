import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ProfileRepository } from '@modules/profiles/domain/repositories/profile.repository';

import { RESERVED_USERNAMES } from '@modules/profiles/constants/reserved-usernames';

@Injectable()
export class UpdateProfileUseCase {
  constructor(
    @Inject('ProfileRepository')
    private readonly profileRepo: ProfileRepository,
  ) {}

  async execute(
    userId: string,
    data: {
      username?: string;

      firstName?: string;

      lastName?: string;

      bio?: string;

      gender?: string;

      timezone?: string;

      photoUrl?: string;
    },
  ) {
    const profile =
      await this.profileRepo.findByUserId(
        userId,
      );

    if (!profile) {
      throw new NotFoundException(
        'Profile not found',
      );
    }

    // ✅ USERNAME VALIDATION
    if (data.username) {
      const normalized =
        data.username
          .trim()
          .toLowerCase();

      if (!normalized) {
        throw new BadRequestException(
          'Invalid username',
        );
      }

      // ✅ RESERVED USERNAMES
      if (
        RESERVED_USERNAMES.includes(
          normalized,
        )
      ) {
        throw new BadRequestException(
          'Username is reserved',
        );
      }

      // ✅ DUPLICATE CHECK
      const existing =
        await this.profileRepo.findByUsername(
          normalized,
        );

      if (
        existing &&
        existing.userId !== userId
      ) {
        throw new ConflictException(
          'Username already taken',
        );
      }

      data.username = normalized;
    }

    return this.profileRepo.update(
      userId,
      data,
    );
  }
}