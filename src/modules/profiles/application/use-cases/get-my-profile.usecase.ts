import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { ProfileRepository } from '@modules/profiles/domain/repositories/profile.repository';

@Injectable()
export class GetMyProfileUseCase {
  constructor(
    @Inject('ProfileRepository')
    private readonly profileRepo: ProfileRepository,
  ) {}

  async execute(userId: string) {


    const profile =
      await this.profileRepo.findByUserId(
        userId,
      );

    if (!profile) {
      throw new NotFoundException(
        'Profile not found',
      );
    }

    return profile;
  }
}