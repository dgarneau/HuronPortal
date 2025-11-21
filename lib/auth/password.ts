import * as bcrypt from 'bcryptjs';

// Use bcryptjs for password hashing (pure JS implementation)
const SALT_ROUNDS = 12;

/**
 * Hash a password using bcrypt
 * @param password Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Verify a password against a hash
 * @param password Plain text password
 * @param hash Stored password hash
 * @returns True if password matches
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
