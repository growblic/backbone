import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../infrastructure/prisma/prisma.service';

import { UserRepository } from '../domain/repositories/user.repository';

import { User } from '../domain/entities/user.entity';

import { Role } from '../domain/enums/role.enum';

@Injectable()
export class UserPrismaRepository
  implements UserRepository
{
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  // 🔍 find by phone
  async findByPhone(
    phone: string,
  ): Promise<User | null> {
    const user =
      await this.prisma.user.findUnique({
        where: { phone },
      });

    if (!user) {
      return null;
    }

    return this.toEntity(user);
  }

  // 🔍 find by id
  async findById(
    id: string,
  ): Promise<User | null> {
    const user =
      await this.prisma.user.findUnique({
        where: { id },
      });

    if (!user) {
      return null;
    }

    return this.toEntity(user);
  }

  // 🆕 create user
  async create(data: {
    phone: string;

    country: string;

    source: string;

    role: Role;
  }): Promise<User> {
    const user =
      await this.prisma.user.create({
        data: {
          phone: data.phone,

          country: data.country,

          source: data.source,

          role: data.role,
        },
      });

    return this.toEntity(user);
  }

  // 💾 save user
  async save(user: User): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: user.id,
      },

      data: {
        phone: user.phone,

        country: user.country,

        source: user.source,

        role: user.role,
      },
    });
  }

  // 🔥 entity mapper
  private toEntity(user: any): User {
    return {
      id: user.id,

      phone: user.phone,

      country: user.country,

      source: user.source,

      role: user.role,

      createdAt: user.createdAt,

      updatedAt: user.updatedAt,
    };
  }
}