import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from './lib/auth';
import { ROUTES } from './config/routes';

export async function middleware(request: NextRequest) {
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

  let token = request.cookies.get('pertap_jwt')?.value;
  if (!token) {
    const authHeader = request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    } else {
      token = request.headers.get('X-Pertap-Token') || undefined;
    }
    if (token) {
      request.cookies.set('pertap_jwt', token);
      const existingCookie = request.headers.get('Cookie');
      if (existingCookie) {
        request.headers.set('Cookie', `${existingCookie}; pertap_jwt=${token}`);
      } else {
        request.headers.set('Cookie', `pertap_jwt=${token}`);
      }
    }
  }

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
  const isAuthRoute = pathname.startsWith(ROUTES.LOGIN) || pathname.startsWith(ROUTES.REGISTER);
  const isProtectedRoute = 
    pathname.startsWith(ROUTES.DASHBOARD) || 
    pathname.startsWith(ROUTES.HISTORY) || 
    pathname.startsWith(ROUTES.LEADERBOARD) || 
    pathname.startsWith(ROUTES.ONBOARDING) ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/invoice-printer') ||
    pathname.startsWith(ROUTES.CONNECTIONS); // Added connections to protection map explicitly just in case
 
  if (isProtectedRoute) {
    if (!token) {
      const loginUrl = new URL(ROUTES.LOGIN, request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
    const payload = await verifyJWT(token);
    if (!payload) {
      const response = NextResponse.redirect(new URL(ROUTES.LOGIN, request.url));
      response.cookies.delete('pertap_jwt');
      return response;
    }

    // Role-based authorization for administrative console paths and invoice printer
    const isAdminPath = pathname.startsWith('/admin') || pathname.startsWith('/invoice-printer');
    const isAdminEmail = 
      payload.email === 'nibrasulhaqqamini@gmail.com' || 
      payload.email === 'tapfolio.in@gmail.com' ||
      (process.env.ADMIN_EMAIL && payload.email === process.env.ADMIN_EMAIL);

    if (isAdminPath && !isAdminEmail) {
      console.warn(`[PROXY] Access denied to admin-only path ${pathname} for user: ${payload.email}`);
      return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
    }
  }

  // 4. Handle auth routes redirects if already logged in
  if (isAuthRoute && token) {
    const payload = await verifyJWT(token);
    if (payload) {
      return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
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
