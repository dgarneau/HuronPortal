// Add detailed logging for module loading
console.log('[password.ts] Starting module load...');
console.log('[password.ts] Node version:', process.version);
console.log('[password.ts] CWD:', process.cwd());
console.log('[password.ts] NODE_ENV:', process.env.NODE_ENV);

let bcrypt: any;
try {
  console.log('[password.ts] Attempting to import bcryptjs...');
  bcrypt = require('bcryptjs');
  console.log('[password.ts] bcryptjs loaded successfully:', typeof bcrypt);
  console.log('[password.ts] bcryptjs exports:', Object.keys(bcrypt));
} catch (error) {
  console.error('[password.ts] FAILED to load bcryptjs:', error);
  if (error instanceof Error) {
    console.error('[password.ts] Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
  }
  throw error;
}

// Use bcryptjs for password hashing (pure JS implementation)
const SALT_ROUNDS = 12;

/**
 * Hash a password using bcrypt
 * @param password Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  try {
    console.log('[password.ts] hashPassword called');
    const result = await bcrypt.hash(password, SALT_ROUNDS);
    console.log('[password.ts] hashPassword completed successfully');
    return result;
  } catch (error) {
    console.error('[password.ts] hashPassword failed:', error);
    throw error;
  }
}

/**
 * Verify a password against a hash
 * @param password Plain text password
 * @param hash Stored password hash
 * @returns True if password matches
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    console.log('[password.ts] verifyPassword called');
    const result = await bcrypt.compare(password, hash);
    console.log('[password.ts] verifyPassword completed:', result);
    return result;
  } catch (error) {
    console.error('[password.ts] verifyPassword failed:', error);
    throw error;
  }
}
