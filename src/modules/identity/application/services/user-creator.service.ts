import {
  Injectable,
} from '@nestjs/common';

import { PrismaService } from '@infra/prisma/prisma.service';
import { AppSource } from '@prisma/client';

@Injectable()
export class UserCreatorService {
  constructor(
    private readonly prisma:
      PrismaService,
  ) {}

  async createUser(
    phone: string,
  ) {
    // =====================================================
    // ✅ GENERATE UNIQUE WALLET NUMBER
    // =====================================================

    const walletNumber =
      `GW${Date.now()}${Math.floor(
        Math.random() * 1000,
      )}`;

    // =====================================================
    // ✅ GENERATE UNIQUE WALLET HANDLE
    // =====================================================

    const cleanPhone =
      phone.replace(/\D/g, '');

    const lastDigits =
      cleanPhone.slice(-6);

    const walletHandle =
      `growblic${lastDigits}`;

    // =====================================================
    // ✅ CREATE USER
    // =====================================================

    return this.prisma.user.create({
      data: {
        phone,

        country: 'IN',

        source: AppSource.FLUTTER_APP,

        // ===============================================
        // ✅ AUTO PROFILE CREATE
        // ===============================================

        profile: {
          create: {
            phone,
          },
        },

        // ===============================================
        // ✅ AUTO WALLET CREATE
        // ===============================================

        wallet: {
          create: {
            walletNumber,

            walletHandle,
            availableBalance: 0,
            lockedBalance: 0,
          },
        },
      },

      include: {
        profile: true,

        wallet: true,
      },
    });
  }
}