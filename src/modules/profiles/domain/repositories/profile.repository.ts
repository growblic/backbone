import { Profile } from '@modules/profiles/domain/entities/profile.entity';

export abstract class ProfileRepository {
  abstract findByUserId(
    userId: string,
  ): Promise<Profile | null>;

  abstract findByUsername(
    username: string,
  ): Promise<Profile | null>;

  abstract create(data: {
    userId: string;
  }): Promise<Profile>;

  abstract update(
    userId: string,
    data: Partial<Profile>,
  ): Promise<Profile>;
}