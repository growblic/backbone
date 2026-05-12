import { Injectable } from '@nestjs/common';

import { PrismaService } from '@infra/prisma/prisma.service';

import { ProfileRepository } from '@modules/profiles/domain/repositories/profile.repository';

import { Profile } from '@modules/profiles/domain/entities/profile.entity';

@Injectable()
export class ProfilePrismaRepository
  implements ProfileRepository
{
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findByUserId(
    userId: string,
  ): Promise<Profile | null> {
    if (!userId) {
      return null;
    }

    const profile =
      await this.prisma.profile.findUnique({
        where: {
          userId: userId,
        },
      });

    if (!profile) {
      return null;
    }

    return this.toEntity(profile);
  }

  async findByUsername(
    username: string,
  ): Promise<Profile | null> {
    if (!username) {
      return null;
    }

    const profile =
      await this.prisma.profile.findUnique({
        where: {
          username: username,
        },
      });

    if (!profile) {
      return null;
    }

    return this.toEntity(profile);
  }

  async create(data: {
    userId: string;
  }): Promise<Profile> {
    const profile =
      await this.prisma.profile.create({
        data: {
          userId: data.userId,
        },
      });

    return this.toEntity(profile);
  }

  async update(
    userId: string,
    data: Partial<Profile>,
  ): Promise<Profile> {
    const profile =
      await this.prisma.profile.update({
        where: {
          userId: userId,
        },

        data: {
          username: data.username,

          firstName: data.firstName,

          lastName: data.lastName,

          bio: data.bio,

          gender: data.gender,

          timezone: data.timezone,

          email: data.email,

          phone: data.phone,

          photoUrl: data.photoUrl,
        },
      });

    return this.toEntity(profile);
  }

  private toEntity(profile: any): Profile {
    return {
      id: profile.id,

      userId: profile.userId,

      username: profile.username,

      firstName: profile.firstName,

      lastName: profile.lastName,

      bio: profile.bio,

      gender: profile.gender,

      timezone: profile.timezone,

      email: profile.email,

      phone: profile.phone,

      photoUrl: profile.photoUrl,

      createdAt: profile.createdAt,

      updatedAt: profile.updatedAt,
    };
  }
}