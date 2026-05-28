import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';

import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';

import { ConfigService } from '@nestjs/config';

import { Role } from '../../domain/enums/role.enum';

import { PrismaService } from '@infra/prisma/prisma.service';

import { AuthenticatedUser } from '../../domain/interfaces/authenticated-user.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
) {
  constructor(
    private readonly prisma: PrismaService,

    private readonly configService:
      ConfigService,
  ) {
    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration: false,

      secretOrKey:
        configService.get<string>(
          'JWT_ACCESS_SECRET',
        )!,
    });
  }

  async validate(payload: {
    sub: string;

    role: string;

    sessionId?: string;
  }): Promise<AuthenticatedUser> {
    const user =
      await this.prisma.user.findUnique({
        where: {
          id: payload.sub,
        },

        select: {
          id: true,

          phone: true,

          role: true,

          country: true,

          source: true,

          isBlocked: true,

          isActive: true,
        },
      });

    if (!user) {
      throw new UnauthorizedException(
        'User not found',
      );
    }

    if (user.isBlocked) {
      throw new UnauthorizedException(
        'Account blocked',
      );
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        'Account inactive',
      );
    }

    return {
      id: user.id,

      phone: user.phone,

      role: user.role as Role,

      country: user.country,

      source: user.source,
    };
  }
}