import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // =====================================================
  // ✅ CHECK EXISTING ADMIN
  // =====================================================

  const existingAdmin =
    await prisma.user.findFirst({
      where: {
        role: 'SUPER_ADMIN',
      },
    });

  if (existingAdmin) {

    return;
  }

  // =====================================================
  // 👑 CREATE SUPER ADMIN
  // =====================================================

  const admin =
    await prisma.user.create({
      data: {
        phone: '+919999999998',

        role: 'SUPER_ADMIN',

        country: 'IN',

        source: 'SYSTEM',

        profile: {
          create: {},
        },

        wallet: {
          create: {
            walletNumber:
              'ADMIN0001',

            walletHandle:
              'superadmin',
          },
        },
      },
    });


}

main()
  .catch((error) => {
    console.error(error);

    process.exit(1);
  })

  .finally(async () => {
    await prisma.$disconnect();
  });