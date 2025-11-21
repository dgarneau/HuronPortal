// Load environment variables FIRST before any imports
import { config } from 'dotenv';
config({ path: '.env.local' });

// Now import after env is loaded
import { createUser, getUserByUsername } from '@/lib/cosmos/models/user';
import { hashPassword } from '@/lib/auth/password';

export async function seedAdminUser() {
  try {
    // Check if admin user already exists
    const existing = await getUserByUsername('admin');
    if (existing) {
      console.log('Admin user already exists');
      return;
    }

    // Create admin user with default password
    const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'Admin123!';
    const passwordHash = await hashPassword(defaultPassword);

    await createUser({
      username: 'admin',
      email: 'admin@huronportal.com',
      name: 'Administrateur',
      password: defaultPassword,
      passwordHash,
      role: 'Admin',
      isActive: true,
    });

    console.log('Admin user created successfully');
    console.log('Username: admin');
    console.log('Email: admin@huronportal.com');
    console.log(`Password: ${defaultPassword}`);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    throw error;
  }
}

// Run if executed directly
if (require.main === module) {
  seedAdminUser()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
