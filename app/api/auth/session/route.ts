import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth/session';
import { createErrorResponse } from '@/lib/utils/errors';
import { messages } from '@/lib/validation/messages';

export async function GET(request: NextRequest) {
  const session = await getSessionFromRequest(request);
  
  if (!session) {
    return createErrorResponse(
      messages.auth.unauthorized,
      'UNAUTHORIZED',
      401
    );
  }
  
  return NextResponse.json({
    data: {
      userId: session.userId,
      username: session.username,
      role: session.role,
    },
  });
}
