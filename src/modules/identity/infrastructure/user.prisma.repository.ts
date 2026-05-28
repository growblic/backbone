import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../infrastructure/prisma/prisma.service';

import { UserRepository } from '../domain/repositories/user.repository';

import { User } from '../domain/entities/user.entity';

import { AppSource } from '@prisma/client';

import { Role } from '../domain/enums/role.enum';

import { UserRole } from '@prisma/client';
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

async findByEmail(
  email: string,
): Promise<User | null> {
  return this.prisma.user.findUnique({
    where: {
      email,
    },
  });
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

          source: data.source as AppSource,

          role: UserRole.USER,
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

        source: user.source as AppSource,

        role: user.role as UserRole,
      },
    });
  }

  // 🔥 entity mapper
  private toEntity(user: any): User {
    return {
      id: user.id,

      phone: user.phone,

      email: user.email,

      passwordHash: user.passwordHash,

      country: user.country,

      source: user.source as AppSource,

      role: user.role as UserRole,

      createdAt: user.createdAt,

      updatedAt: user.updatedAt,
    };
  }
}