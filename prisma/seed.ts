import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const password = 'test1234';
  const hashedPassword = await bcrypt.hash(password, 10);

  // Admin
  await prisma.accounts.create({
    data: {
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
    },
  });

  // Vendor
  //   await prisma.accounts.create({
  //     data: {
  //       email: 'vendor@example.com',
  //       password: hashedPassword,
  //       role: 'VENDOR',
  //     },
  //   });

  // Customer
  //   await prisma.accounts.create({
  //     data: {
  //       email: 'customer@example.com',
  //       password: hashedPassword,
  //       role: 'CUSTOMER',
  //     },
  //   });

  console.log('✅ Seeded test accounts!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });



// password -: Pa$$w0rd!

// buyer -:
//  matyfuva@mailinator.com

// vendor -:
// tydetixety @mailinator.com

// admin -:
// fidimahyn @mailinator.com