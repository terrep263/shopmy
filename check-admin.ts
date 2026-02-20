import prisma from './src/lib/prisma'

async function checkAdmin() {
  const user = await prisma.user.findFirst({
    where: { email: 'admin@shopmyneighborhood.com' }
  })
  console.log('Admin user:', JSON.stringify(user, null, 2))
  process.exit(0)
}

checkAdmin()
