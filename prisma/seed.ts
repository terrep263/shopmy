import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcrypt'

let prisma: PrismaClient
try {
  const connectionString = process.env.DATABASE_URL!
  const adapter = new PrismaPg({ connectionString })
  prisma = new PrismaClient({ adapter })
} catch (error) {
  console.error('Error initializing Prisma Client:', error)
  process.exit(1)
}

async function main() {
  const tempPassword = 'changeme';
  const password_hash = await bcrypt.hash(tempPassword, 10)

  try {
    await prisma.user.upsert({
      where: { email: 'admin@shopmyneighborhood.com' },
      update: {},
      create: {
        email: 'admin@shopmyneighborhood.com',
        password_hash,
        role: 'admin',
      },
    })
    console.log('✅ Admin user created/updated: admin@shopmyneighborhood.com')
    console.log('🔑 Temporary password: changeme (IMPORTANT: Change after first login)')
  } catch (error) {
    console.error('Error upserting admin user:', error)
    process.exit(1)
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error('Unhandled error during seeding:', e)
    prisma.$disconnect()
    process.exit(1)
  })
