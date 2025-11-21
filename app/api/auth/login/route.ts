import { NextRequest, NextResponse } from 'next/server';
import { getUserByUsername, getUserByEmail, updateLastLogin } from '@/lib/cosmos/models/user';

console.log('[route.ts] Loading password module...');
try {
  console.log('[route.ts] Module resolution paths:', require.resolve.paths('bcryptjs'));
} catch (e) {
  console.log('[route.ts] Could not get resolution paths:', e);
}

import { verifyPassword } from '@/lib/auth/password';
console.log('[route.ts] Password module loaded successfully');
import { createSession, setSessionCookie } from '@/lib/auth/session';
import { loginSchema } from '@/lib/validation/schemas';
import { handleError, createErrorResponse, createSuccessResponse } from '@/lib/utils/errors';
import { messages } from '@/lib/validation/messages';

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables
    if (!process.env.COSMOS_ENDPOINT || !process.env.COSMOS_KEY) {
      console.error('Missing required environment variables: COSMOS_ENDPOINT or COSMOS_KEY');
      return createErrorResponse(
        'Configuration serveur incorrecte',
        'SERVER_CONFIG_ERROR',
        500
      );
    }

    const body = await request.json();
    console.log('Login attempt for user:', body.username);
    
    // Validate input
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      console.log('Validation error:', validation.error);
      return handleError(validation.error);
    }
    
    const { username, password } = validation.data;
    
    // Find user by username or email
    console.log('Looking up user:', username);
    let user = await getUserByUsername(username);
    if (!user) {
      console.log('User not found by username, trying email');
      user = await getUserByEmail(username);
    }
    
    if (!user || !user.isActive) {
      console.log('User not found or inactive');
      return createErrorResponse(
        messages.auth.invalidCredentials,
        'INVALID_CREDENTIALS',
        401
      );
    }
    
    console.log('User found, verifying password');
    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      console.log('Password verification failed');
      return createErrorResponse(
        messages.auth.invalidCredentials,
        'INVALID_CREDENTIALS',
        401
      );
    }
    
    console.log('Password verified, creating session');
    // Create session
    const token = await createSession(user.id, user.username, user.role);
    
    // Update last login
    await updateLastLogin(user.id, user.username);
    
    console.log('Login successful for user:', username);
    // Set cookie and return response
    const cookieOptions = setSessionCookie(token);
    const response = NextResponse.json(
      {
        data: { username: user.username, role: user.role },
        message: messages.success.loginSuccess,
      },
      { status: 200 }
    );
    
    response.cookies.set(cookieOptions);
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    return handleError(error);
  }
}
