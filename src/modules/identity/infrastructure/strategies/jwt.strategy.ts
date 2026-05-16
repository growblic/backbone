import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { PassportStrategy } from '@nestjs/passport';

import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';

import { PrismaService } from '@infra/prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
) {
  constructor(
    private readonly prisma:
      PrismaService,
  ) {
    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),

      ignoreExpiration: false,

      secretOrKey:
        process.env.JWT_ACCESS_SECRET as string,
    });
  }

  async validate(payload: {
    sub: string;

    role: string;
  }) {
    // =====================================================
    // ✅ FIND USER
    // =====================================================

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

        
        },
      });

    // =====================================================
    // ❌ USER NOT FOUND
    // =====================================================

    if (!user) {
      throw new UnauthorizedException(
        'User not found',
      );
    }

  

    // =====================================================
    // ✅ ATTACH TO request.user
    // =====================================================

    return {
      id: user.id,

      phone: user.phone,

      role: user.role,

      country: user.country,

      source: user.source,

    
    };
  }
}