import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import type { Session, UserRole } from '@/types';

const SECRET_KEY = new TextEncoder().encode(
  process.env.SESSION_SECRET || 'development-secret-key-change-in-production'
);
const SESSION_DURATION = Number(process.env.SESSION_DURATION) || 3600; // 1 hour in seconds
const COOKIE_NAME = 'session';

/**
 * Create a new session JWT token
 */
export async function createSession(userId: string, username: string, role: UserRole): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = now + SESSION_DURATION;

  const token = await new SignJWT({
    userId,
    username,
    role,
    createdAt: now,
    expiresAt,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now)
    .setExpirationTime(expiresAt)
    .sign(SECRET_KEY);

  return token;
}

/**
 * Verify and decode a session token
 */
export async function verifySession(token: string): Promise<Session | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    
    // Check if session is expired
    const now = Math.floor(Date.now() / 1000);
    if (payload.expiresAt && typeof payload.expiresAt === 'number' && payload.expiresAt < now) {
      return null;
    }

    return payload as unknown as Session;
  } catch (error) {
    return null;
  }
}

/**
 * Get session from request cookies
 */
export async function getSessionFromRequest(request: NextRequest): Promise<Session | null> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;
  
  return verifySession(token);
}

/**
 * Get session from server cookies (Server Components)
 */
export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;
  
  return verifySession(token);
}

/**
 * Set session cookie in response
 */
export function setSessionCookie(token: string): {
  name: string;
  value: string;
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax';
  maxAge: number;
  path: string;
} {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_DURATION,
    path: '/',
  };
}

/**
 * Clear session cookie
 */
export function clearSessionCookie(): {
  name: string;
  value: string;
  httpOnly: boolean;
  secure: boolean;
  sameSite: 'lax';
  maxAge: number;
  path: string;
} {
  return {
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  };
}
