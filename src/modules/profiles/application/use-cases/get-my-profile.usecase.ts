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
    console.log(
      'GET PROFILE USER ID =>',
      userId,
    );

    const profile =
      await this.profileRepo.findByUserId(
        userId,
      );

    console.log(
      'PROFILE FOUND =>',
      profile,
    );

    if (!profile) {
      throw new NotFoundException(
        'Profile not found',
      );
    }

    return profile;
  }
}