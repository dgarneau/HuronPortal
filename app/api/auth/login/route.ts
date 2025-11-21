import { NextRequest, NextResponse } from 'next/server';
import { getUserByUsername, getUserByEmail, updateLastLogin } from '@/lib/cosmos/models/user';
import { verifyPassword } from '@/lib/auth/password';
import { createSession, setSessionCookie } from '@/lib/auth/session';
import { loginSchema } from '@/lib/validation/schemas';
import { handleError, createErrorResponse, createSuccessResponse } from '@/lib/utils/errors';
import { messages } from '@/lib/validation/messages';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Login request body:', body);
    
    // Validate input
    const validation = loginSchema.safeParse(body);
    if (!validation.success) {
      console.log('Validation error:', validation.error);
      return handleError(validation.error);
    }
    
    const { username, password } = validation.data;
    
    // Find user by username or email
    let user = await getUserByUsername(username);
    if (!user) {
      user = await getUserByEmail(username);
    }
    
    if (!user || !user.isActive) {
      return createErrorResponse(
        messages.auth.invalidCredentials,
        'INVALID_CREDENTIALS',
        401
      );
    }
    
    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return createErrorResponse(
        messages.auth.invalidCredentials,
        'INVALID_CREDENTIALS',
        401
      );
    }
    
    // Create session
    const token = await createSession(user.id, user.username, user.role);
    
    // Update last login
    await updateLastLogin(user.id, user.username);
    
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
    return handleError(error);
  }
}
