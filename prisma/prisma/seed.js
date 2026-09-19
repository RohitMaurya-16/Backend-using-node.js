const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seed() {
  const userExists = await prisma.user.findFirst({ where: { email: 'admin@example.com' } });

  if (!userExists) {
    const passwordHash = await bcrypt.hash('admin123', 10);
    await prisma.user.create({
      data: {
        username: 'admin',
        email: 'admin@example.com',
        passwordHash,
      },
    });
  }

  const folderCount = await prisma.folder.count();
  if (folderCount === 0) {
    const user = await prisma.user.findUnique({ where: { email: 'admin@example.com' } });
    await prisma.folder.createMany({
      data: [
        { name: 'Projects', description: 'Current project files', userId: user.id },
        { name: 'Reports', description: 'Monthly summaries', userId: user.id },
      ],
    });
  }

  console.log('Seed complete.');
}

seed()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
