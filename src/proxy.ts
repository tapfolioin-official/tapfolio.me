import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from './lib/auth';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. CORS Preflight Pre-emption
  if (pathname.startsWith('/api/')) {
    if (request.method === 'OPTIONS') {
      const origin = request.headers.get('origin') || '*';
      return new NextResponse(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Origin': origin,
          'Access-Control-Allow-Methods': 'GET,DELETE,PATCH,POST,PUT,OPTIONS',
          'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Cookie, Authorization, X-Pertap-Token',
        },
      });
    }
  }

  const token = request.cookies.get('pertap_jwt')?.value;

  // 2. Handle dynamic /@username path rewriting
  if (pathname.startsWith('/@')) {
    const username = pathname.substring(2); // Remove /@
    if (username) {
      const rewriteUrl = request.nextUrl.clone();
      rewriteUrl.pathname = `/connect/${username}`;
      return NextResponse.rewrite(rewriteUrl);
    }
  }

  // 3. Handle protected routes redirects
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isProtectedRoute = 
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/history') || 
    pathname.startsWith('/leaderboard') || 
    pathname.startsWith('/onboarding') ||
    pathname.startsWith('/admin');

  if (isProtectedRoute) {
    if (!token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    const payload = await verifyJWT(token);
    if (!payload) {
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('pertap_jwt');
      return response;
    }

    // Role-based authorization for administrative console paths
    if (pathname.startsWith('/admin') && payload.email !== 'nibrasulhaqqamini@gmail.com') {
      console.warn(`[PROXY] Access denied to /admin for user: ${payload.email}`);
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  // 4. Handle auth routes redirects if already logged in
  if (isAuthRoute && token) {
    const payload = await verifyJWT(token);
    if (payload) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  const response = NextResponse.next();

  // 5. Append CORS headers to dynamic API responses
  if (pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin') || '*';
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Origin', origin);
    response.headers.set('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT,OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Cookie, Authorization, X-Pertap-Token');
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
