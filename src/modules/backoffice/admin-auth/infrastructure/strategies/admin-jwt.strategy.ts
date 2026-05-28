import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import {
  PassportStrategy,
} from '@nestjs/passport';

import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';

import { PrismaService } from '../../../../../infrastructure/prisma/prisma.service';

@Injectable()
export class AdminJwtStrategy extends PassportStrategy(
  Strategy,
  'admin-jwt',
) {
  constructor(
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration: false,

      secretOrKey:
        process.env.JWT_ACCESS_SECRET as string,
    });
  }

  async validate(
    payload: {
      sub: string;
      email: string;
      role: string;
      type: string;
    },
  ) {
    if (payload.type !== 'access') {
      throw new UnauthorizedException(
        'Invalid token type',
      );
    }

    const admin =
      await this.prisma.adminUser.findUnique({
        where: {
          id: payload.sub,
        },
      });

    if (!admin) {
      throw new UnauthorizedException(
        'Admin not found',
      );
    }

    return {
      adminId: admin.id,
      email: admin.email,
      role: admin.role,
    };
  }
}