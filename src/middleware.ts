import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from './lib/auth';
import { ROUTES } from './config/routes';
import { verifyTransactionSecurity, generateResponseSignature } from './lib/security';
import {
  isAllowedOrigin,
  isAllowedHost,
  validateWebRequest,
  generateCsrfToken,
  acquireIdempotencyLock,
  CSRF_COOKIE_NAME,
  CSRF_TTL_MS,
} from './lib/web-security';

function isPublicApiRoute(pathname: string): boolean {
  return (
    pathname.startsWith('/api/cards/public/') ||
    pathname.startsWith('/api/version') ||
    pathname === '/api/cards/public'
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Production HTTPS Redirection
  if (process.env.NODE_ENV === 'production') {
    const proto = request.headers.get('x-forwarded-proto');
    // On Vercel, HTTPS is already terminated and redirected at the edge.
    // Avoid double redirect loops on internal Vercel edge proxies.
    if (proto === 'http' && !request.headers.get('x-vercel-id')) {
      const httpsUrl = request.nextUrl.clone();
      httpsUrl.protocol = 'https:';
      return NextResponse.redirect(httpsUrl, 301);
    }
  }

  // 2. Host Validation
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  if (!isAllowedHost(host)) {
    return NextResponse.json(
      { error: 'Invalid or untrusted Host header.', code: 'INVALID_HOST' },
      { status: 400 }
    );
  }

  // 3. CORS Preflight Pre-emption
  if (pathname.startsWith('/api/')) {
    if (request.method === 'OPTIONS') {
      const origin = request.headers.get('origin');
      const isAllowed = isAllowedOrigin(origin);
      const isPublic = isPublicApiRoute(pathname);

      if (isAllowed) {
        return new NextResponse(null, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': origin!,
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Methods': 'GET,DELETE,PATCH,POST,PUT,OPTIONS',
            'Access-Control-Allow-Headers':
              'X-CSRF-Token, X-Idempotency-Key, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Cookie, Authorization, X-Pertap-Token, X-Pertap-Client, X-Pertap-Timestamp, X-Pertap-Nonce, X-Pertap-Body-Hash, X-Pertap-Signature, X-Pertap-Handshake',
            'Access-Control-Expose-Headers':
              'X-Pertap-Response-Signature, X-Pertap-Response-Timestamp, X-Pertap-Token, Set-Cookie',
            'Access-Control-Max-Age': '86400',
            Vary: 'Origin',
          },
        });
      }

      if (isPublic) {
        return new NextResponse(null, {
          status: 204,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS',
            'Access-Control-Allow-Headers':
              'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Pertap-Client, X-Pertap-Timestamp, X-Pertap-Nonce, X-Pertap-Body-Hash, X-Pertap-Signature',
            'Access-Control-Expose-Headers':
              'X-Pertap-Response-Signature, X-Pertap-Response-Timestamp',
            'Access-Control-Max-Age': '86400',
          },
        });
      }

      return new NextResponse(null, { status: 204 });
    }
  }

  // 4. Request Validation: Mobile HMAC vs Browser Web Security
  const clientHeader = request.headers.get('x-pertap-client');
  const signature = request.headers.get('x-pertap-signature');
  const isMobile = clientHeader?.toLowerCase().startsWith('mobile-') || Boolean(signature);

  let mobileVerification: Awaited<ReturnType<typeof verifyTransactionSecurity>> | null = null;

  if (pathname.startsWith('/api/')) {
    if (isMobile) {
      // 4A. Mobile Transaction Security (HMAC-SHA256, Anti-Replay Nonce & Freshness)
      mobileVerification = await verifyTransactionSecurity(request);
      if (!mobileVerification.valid) {
        console.warn(`[SECURITY/MOBILE] Rejected request ${request.method} ${pathname}: ${mobileVerification.error}`);
        return NextResponse.json(
          { error: mobileVerification.error, code: 'SECURITY_INTEGRITY_VIOLATION' },
          { status: mobileVerification.status || 403 }
        );
      }
    } else {
      // 4B. Browser Web Request Security (Origin, Sec-Fetch-Site, Content-Type, CSRF)
      const webVerification = await validateWebRequest(request);
      if (!webVerification.valid) {
        console.warn(`[SECURITY/WEB] Rejected request ${request.method} ${pathname}: ${webVerification.error}`);
        return NextResponse.json(
          { error: webVerification.error, code: 'SECURITY_WEB_VIOLATION' },
          { status: webVerification.status || 403 }
        );
      }

      // 4C. Replay & Idempotency Protection for Sensitive Operations
      const idempotencyKey =
        request.headers.get('x-idempotency-key') || request.headers.get('idempotency-key');
      if (idempotencyKey && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
        const lockRes = await acquireIdempotencyLock(
          idempotencyKey,
          pathname,
          request.method,
          idempotencyKey
        );
        if (lockRes.duplicate) {
          return NextResponse.json(
            {
              error: lockRes.error || 'Duplicate transaction detected.',
              code: 'DUPLICATE_TRANSACTION',
              status: lockRes.status,
            },
            { status: 409 }
          );
        }
      }
    }
  }

  // 5. Token Extraction & Cookie Synchronization
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

  // 6. Dynamic /@username Path Rewriting
  if (pathname.startsWith('/@')) {
    const username = pathname.substring(2);
    if (username) {
      const rewriteUrl = request.nextUrl.clone();
      rewriteUrl.pathname = `/connect/${username}`;
      return NextResponse.rewrite(rewriteUrl);
    }
  }

  // 7. Protected Route Redirection & RBAC Authorization
  const isAuthRoute = pathname.startsWith(ROUTES.LOGIN) || pathname.startsWith(ROUTES.REGISTER);
  const isProtectedRoute =
    pathname.startsWith(ROUTES.DASHBOARD) ||
    pathname.startsWith(ROUTES.HISTORY) ||
    pathname.startsWith(ROUTES.LEADERBOARD) ||
    pathname.startsWith(ROUTES.ONBOARDING) ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/invoice-printer') ||
    pathname.startsWith(ROUTES.CONNECTIONS);

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

    // Role-based authorization for administrative console paths
    const isAdminPath = pathname.startsWith('/admin') || pathname.startsWith('/invoice-printer');
    const isAdminEmail =
      payload.email === 'nibrasulhaqqamini@gmail.com' ||
      payload.email === 'tapfolio.in@gmail.com' ||
      (process.env.ADMIN_EMAIL && payload.email === process.env.ADMIN_EMAIL);

    if (isAdminPath && !isAdminEmail) {
      console.warn(`[PROXY] Access denied to admin path ${pathname} for user: ${payload.email}`);
      return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
    }
  }

  // 8. Auth Route Redirect if already authenticated
  if (isAuthRoute && token) {
    const payload = await verifyJWT(token);
    if (payload) {
      return NextResponse.redirect(new URL(ROUTES.DASHBOARD, request.url));
    }
  }

  const response = NextResponse.next();

  // 9. Sign Response for Mobile Client
  if (pathname.startsWith('/api/') && mobileVerification?.isMobile && mobileVerification.nonce) {
    const { signature: respSig, timestamp: respTime } = await generateResponseSignature(
      response.status,
      mobileVerification.nonce,
      mobileVerification.resolvedSecret
    );
    response.headers.set('X-Pertap-Response-Signature', respSig);
    response.headers.set('X-Pertap-Response-Timestamp', respTime);
  }

  // 10. Provision CSRF Token Cookie for Browser Sessions
  if (!isMobile && !request.cookies.has(CSRF_COOKIE_NAME)) {
    const csrfToken = await generateCsrfToken();
    response.cookies.set(CSRF_COOKIE_NAME, csrfToken, {
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      httpOnly: false,
      maxAge: Math.floor(CSRF_TTL_MS / 1000),
    });
  }

  // 11. Security Headers & Browser Hardening
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=63072000; includeSubDomains; preload'
  );
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(self)');

  if (pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  }

  // 12. Strict CORS Headers on API Responses
  if (pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin');
    const isAllowed = isAllowedOrigin(origin);
    const isPublic = isPublicApiRoute(pathname);

    if (isAllowed) {
      response.headers.set('Access-Control-Allow-Origin', origin!);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      response.headers.set('Access-Control-Allow-Methods', 'GET,DELETE,PATCH,POST,PUT,OPTIONS');
      response.headers.set(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Idempotency-Key, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Cookie, Authorization, X-Pertap-Token, X-Pertap-Client, X-Pertap-Timestamp, X-Pertap-Nonce, X-Pertap-Body-Hash, X-Pertap-Signature, X-Pertap-Handshake'
      );
      response.headers.set(
        'Access-Control-Expose-Headers',
        'X-Pertap-Response-Signature, X-Pertap-Response-Timestamp, X-Pertap-Token, Set-Cookie'
      );
      response.headers.set('Vary', 'Origin');
    } else if (isPublic && (request.method === 'GET' || request.method === 'HEAD')) {
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS');
      response.headers.set(
        'Access-Control-Expose-Headers',
        'X-Pertap-Response-Signature, X-Pertap-Response-Timestamp'
      );
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
};
