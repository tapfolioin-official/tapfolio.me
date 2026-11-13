import { NextResponse } from 'next/server';
import { generateCsrfToken, CSRF_COOKIE_NAME, CSRF_TTL_MS } from '@/lib/web-security';

export const dynamic = 'force-dynamic';

export async function GET() {
  const token = await generateCsrfToken();
  const response = NextResponse.json({
    success: true,
    csrfToken: token,
  });

  response.cookies.set(CSRF_COOKIE_NAME, token, {
    httpOnly: false, // Accessible to client-side fetch wrapper
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: Math.floor(CSRF_TTL_MS / 1000),
  });

  return response;
}
