import { pbkdf2 } from '@noble/hashes/pbkdf2';
import { sha256 } from '@noble/hashes/sha256';

// Use PBKDF2 for password hashing (pure JS, zero dependencies)
const ITERATIONS = 100000;
const KEY_LENGTH = 32;

/**
 * Hash a password using PBKDF2
 * @param password Plain text password
 * @returns Hashed password in format: salt:hash
 */
export async function hashPassword(password: string): Promise<string> {
  // Generate a random salt
  const salt = crypto.getRandomValues(new Uint8Array(16));
  
  // Hash the password
  const hash = pbkdf2(sha256, password, salt, {
    c: ITERATIONS,
    dkLen: KEY_LENGTH
  });
  
  // Return salt and hash as hex strings separated by :
  return Buffer.from(salt).toString('hex') + ':' + Buffer.from(hash).toString('hex');
}

/**
 * Verify a password against a hash
 * @param password Plain text password
 * @param storedHash Stored password hash in format: salt:hash
 * @returns True if password matches
 */
export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  // Split the stored hash into salt and hash
  const [saltHex, hashHex] = storedHash.split(':');
  
  if (!saltHex || !hashHex) {
    return false;
  }
  
  // Convert hex strings back to Uint8Array
  const salt = new Uint8Array(Buffer.from(saltHex, 'hex'));
  const expectedHash = Buffer.from(hashHex, 'hex');
  
  // Hash the provided password with the stored salt
  const actualHash = pbkdf2(sha256, password, salt, {
    c: ITERATIONS,
    dkLen: KEY_LENGTH
  });
  
  // Compare hashes (constant-time comparison)
  if (actualHash.length !== expectedHash.length) {
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < actualHash.length; i++) {
    result |= actualHash[i] ^ expectedHash[i];
  }
  
  return result === 0;
}
