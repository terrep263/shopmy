import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcrypt'
import { randomUUID } from 'crypto'

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
  const defaultTenantId = 'tenant_lake_county'

  try {
    await prisma.tenant.upsert({
      where: { id: defaultTenantId },
      update: {},
      create: {
        id: defaultTenantId,
        name: 'Lake County',
        slug: 'lake',
        domain: null,
      },
    })

    // Hash the actual admin password
    const adminPasswordHash = await bcrypt.hash('changeme', 10)

    await prisma.user.upsert({
      where: { email: 'admin@shopmyneighborhood.com' },
      update: {
        role: 'admin',
        tenant_id: defaultTenantId,
        password_hash: adminPasswordHash,
      },
      create: {
        id: randomUUID(),
        email: 'admin@shopmyneighborhood.com',
        password_hash: adminPasswordHash,
        role: 'admin',
        tenant_id: defaultTenantId,
      },
    })
    console.log('✅ Admin user created/updated: admin@shopmyneighborhood.com')
    console.log('🔑 Password: changeme')
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
