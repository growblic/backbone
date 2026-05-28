import { PrismaClient, AdminRole } from '@prisma/client';

import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function bootstrap() {
  const email = 'admin@growblic.com';

  const existingAdmin = await prisma.adminUser.findUnique({
    where: {
      email,
    },
  });

  if (existingAdmin) {
    console.log('Super admin already exists');
    return;
  }

  const passwordHash = await bcrypt.hash('Admin@123', 10);

  await prisma.adminUser.create({
    data: {
      email,
      passwordHash,
      fullName: 'Super Admin',
      role: AdminRole.SUPER_ADMIN,
    },
  });

  console.log('Super admin created successfully');
}

bootstrap()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });