import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import bcrypt from 'bcrypt';

async function testLogin() {
  try {
    // Initialize Prisma
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      console.error('❌ DATABASE_URL not set');
      process.exit(1);
    }

    const pool = new pg.Pool({ connectionString });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    // Check if admin user exists
    console.log('🔍 Checking for admin user...');
    const user = await prisma.user.findUnique({
      where: { email: 'admin@shopmyneighborhood.com' },
    });

    if (!user) {
      console.error('❌ Admin user not found in database');
      process.exit(1);
    }

    console.log('✅ Admin user found:');
    console.log('   - ID:', user.id);
    console.log('   - Email:', user.email);
    console.log('   - Role:', user.role);
    console.log('   - Password Hash:', user.password_hash?.substring(0, 20) + '...');

    // Test password verification
    console.log('\n🔑 Testing password verification...');
    const password = 'admin123';
    const isValid = await bcrypt.compare(password, user.password_hash || '');
    
    if (isValid) {
      console.log('✅ Password verification SUCCESS');
    } else {
      console.log('❌ Password verification FAILED');
      console.log('   The stored password hash does not match "admin123"');
      
      // Try creating a fresh hash
      console.log('\n🔄 Re-hashing password and updating...');
      const newHash = await bcrypt.hash(password, 10);
      await prisma.user.update({
        where: { email: 'admin@shopmyneighborhood.com' },
        data: { password_hash: newHash },
      });
      console.log('✅ Password hash updated');
      
      // Verify it works now
      const isValidNow = await bcrypt.compare(password, newHash);
      console.log('✅ New password verification:', isValidNow);
    }

    await prisma.$disconnect();
    console.log('\n✅ All tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

testLogin();
