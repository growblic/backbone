import {
  Inject,
  Injectable,
} from '@nestjs/common';

import { ProfileRepository } from '@modules/profiles/domain/repositories/profile.repository';

@Injectable()
export class CreateProfileUseCase {
  constructor(
    @Inject('ProfileRepository')
    private readonly profileRepo: ProfileRepository,
  ) {}

  async execute(userId: string) {
    const existing =
      await this.profileRepo.findByUserId(
        userId,
      );

    if (existing) {
      return existing;
    }

    return this.profileRepo.create({
      userId,
    });
  }
}