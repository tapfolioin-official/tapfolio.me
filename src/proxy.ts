import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from './lib/auth';

export async function proxy(request: NextRequest) {
  const token = request.cookies.get('pertap_jwt')?.value;
  const { pathname } = request.nextUrl;
  console.log(`[PROXY] Intercepted path: ${pathname}`);

  // 1. Handle dynamic /@username path rewriting
  if (pathname.startsWith('/@')) {
    const username = pathname.substring(2); // Remove /@
    if (username) {
      const rewriteUrl = request.nextUrl.clone();
      rewriteUrl.pathname = `/connect/${username}`;
      return NextResponse.rewrite(rewriteUrl);
    }
  }

  // 2. Handle protected routes redirects
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

  // 3. Handle auth routes redirects if already logged in
  if (isAuthRoute && token) {
    const payload = await verifyJWT(token);
    if (payload) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
