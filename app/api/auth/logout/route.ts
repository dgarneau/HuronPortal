import { NextRequest, NextResponse } from 'next/server';
import { clearSessionCookie } from '@/lib/auth/session';
import { messages } from '@/lib/validation/messages';

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/login', request.url));
  
  const cookieOptions = clearSessionCookie();
  response.cookies.set(cookieOptions);
  
  return response;
}
