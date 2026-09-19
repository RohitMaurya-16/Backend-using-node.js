const app = require('./app');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await prisma.$connect();
    app.listen(PORT, () => {
      console.log(`Blog API running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to database:', error.message);
    process.exit(1);
  }
}

startServer();
