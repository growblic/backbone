import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ProfileRepository } from '@modules/profiles/domain/repositories/profile.repository';

@Injectable()
export class GetPublicProfileUseCase {
  constructor(
    @Inject('ProfileRepository')
    private readonly profileRepo: ProfileRepository,
  ) {}

  async execute(username: string) {
    const profile =
      await this.profileRepo.findByUsername(
        username.toLowerCase(),
      );

    if (!profile) {
      throw new NotFoundException(
        'Profile not found',
      );
    }

    return {
      username: profile.username,

      firstName: profile.firstName,

      lastName: profile.lastName,

      bio: profile.bio,

      photoUrl: profile.photoUrl,

      createdAt: profile.createdAt,
    };
  }
}