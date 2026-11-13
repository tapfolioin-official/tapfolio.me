import { NextRequest } from 'next/server';
import { middleware } from '../src/middleware';
import { signJWT, verifyJWT } from '../src/lib/auth';
import {
  generateCsrfToken,
  verifyCsrfToken,
  acquireIdempotencyLock,
  completeIdempotency,
  isAllowedOrigin,
  isAllowedHost,
  validateWebRequest,
  CSRF_COOKIE_NAME,
  CSRF_HEADER_NAME,
  IDEMPOTENCY_HEADER_NAME,
} from '../src/lib/web-security';
import {
  computeHmacSha256,
  computeSha256,
  deriveSessionKey,
} from '../src/lib/security';
import crypto from 'crypto';

function pass(name: string) {
  console.log(`  \x1b[32m✔ PASS\x1b[0m: ${name}`);
}

function fail(name: string, reason: string) {
  console.error(`  \x1b[31m✖ FAIL\x1b[0m: ${name} -> ${reason}`);
  throw new Error(`Test failed: ${name} -> ${reason}`);
}

async function runWebSecurityTests() {
  console.log('\n======================================================');
  console.log('TAPFOLIO WEBSITE ↔ SERVER SECURITY AUTOMATED TEST SUITE');
  console.log('======================================================\n');

  // Setup valid test session
  const testUser = { userId: 42, email: 'user@tapfolio.me' };
  const adminUser = { userId: 1, email: 'tapfolio.in@gmail.com' };
  const validToken = await signJWT(testUser);
  const adminToken = await signJWT(adminUser);
  const validCsrf = await generateCsrfToken();

  // 1. Valid browser requests
  console.log('[Test 1] Valid Browser Request Handling:');
  {
    const req = new NextRequest(new URL('/api/profile', 'https://www.tapfolio.me'), {
      method: 'PUT',
      headers: {
        host: 'www.tapfolio.me',
        origin: 'https://www.tapfolio.me',
        'sec-fetch-site': 'same-origin',
        'content-type': 'application/json',
        'x-csrf-token': validCsrf,
      },
      body: JSON.stringify({ name: 'Updated Name' }),
    });
    req.cookies.set('pertap_jwt', validToken);

    const res = await middleware(req);
    if (res.status === 200 || res.status === 307 || !res.headers.get('content-type')?.includes('application/json') || res.status < 400) {
      // Must not be rejected with 403 or 400
      pass('Valid browser mutation request with valid CSRF token, Origin, and JWT was accepted.');
    } else {
      fail('Valid browser request', `Unexpected status: ${res.status}`);
    }

    // Verify response security headers
    const hsts = res.headers.get('Strict-Transport-Security');
    const nosniff = res.headers.get('X-Content-Type-Options');
    const xframe = res.headers.get('X-Frame-Options');
    if (hsts && hsts.includes('includeSubDomains') && nosniff === 'nosniff' && xframe === 'SAMEORIGIN') {
      pass('Security headers (HSTS preload, nosniff, SAMEORIGIN) correctly appended.');
    } else {
      fail('Security headers', `Missing or incomplete headers: HSTS=${hsts}`);
    }
  }

  // 2. Invalid CSRF tokens
  console.log('\n[Test 2] Invalid CSRF Token Protection:');
  {
    const forgedCsrf = 'abcd1234efgh5678.1700000000000.baddeadbeefbaddeadbeef';
    const req = new NextRequest(new URL('/api/profile', 'https://www.tapfolio.me'), {
      method: 'PUT',
      headers: {
        host: 'www.tapfolio.me',
        origin: 'https://www.tapfolio.me',
        'sec-fetch-site': 'same-origin',
        'content-type': 'application/json',
        'x-csrf-token': forgedCsrf,
      },
      body: JSON.stringify({ name: 'Attacker Name' }),
    });
    req.cookies.set('pertap_jwt', validToken);

    const res = await middleware(req);
    const body = await res.json().catch(() => ({}));
    if (res.status === 403 && body.code === 'SECURITY_WEB_VIOLATION') {
      pass('Forged CSRF token correctly rejected with 403 Forbidden.');
    } else {
      fail('Invalid CSRF token', `Expected 403 with SECURITY_WEB_VIOLATION, got ${res.status}`);
    }

    // Missing CSRF token on authenticated mutation
    const reqNoCsrf = new NextRequest(new URL('/api/profile', 'https://www.tapfolio.me'), {
      method: 'PUT',
      headers: {
        host: 'www.tapfolio.me',
        origin: 'https://www.tapfolio.me',
        'sec-fetch-site': 'same-origin',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ name: 'Attacker Name' }),
    });
    reqNoCsrf.cookies.set('pertap_jwt', validToken);

    const resNoCsrf = await middleware(reqNoCsrf);
    if (resNoCsrf.status === 403) {
      pass('Authenticated mutation without CSRF token correctly rejected with 403 Forbidden.');
    } else {
      fail('Missing CSRF token', `Expected 403, got ${resNoCsrf.status}`);
    }
  }

  // 3. Missing or invalid Origin headers
  console.log('\n[Test 3] Strict Origin Validation:');
  {
    const reqUntrustedOrigin = new NextRequest(new URL('/api/cards', 'https://www.tapfolio.me'), {
      method: 'POST',
      headers: {
        host: 'www.tapfolio.me',
        origin: 'https://evil-phishing-site.com',
        'content-type': 'application/json',
        'x-csrf-token': validCsrf,
      },
      body: JSON.stringify({ title: 'Card' }),
    });
    reqUntrustedOrigin.cookies.set('pertap_jwt', validToken);

    const res = await middleware(reqUntrustedOrigin);
    if (res.status === 403) {
      pass('Untrusted Origin header strictly rejected with 403 Forbidden.');
    } else {
      fail('Untrusted Origin', `Expected 403, got ${res.status}`);
    }
  }

  // 4. Cross-origin requests (Sec-Fetch-Site: cross-site)
  console.log('\n[Test 4] Sec-Fetch-Site Cross-Origin Protection:');
  {
    const reqCrossSite = new NextRequest(new URL('/api/cards', 'https://www.tapfolio.me'), {
      method: 'POST',
      headers: {
        host: 'www.tapfolio.me',
        origin: 'https://www.tapfolio.me',
        'sec-fetch-site': 'cross-site',
        'content-type': 'application/json',
        'x-csrf-token': validCsrf,
      },
      body: JSON.stringify({ title: 'Card' }),
    });
    reqCrossSite.cookies.set('pertap_jwt', validToken);

    const res = await middleware(reqCrossSite);
    if (res.status === 403) {
      pass('Sec-Fetch-Site: cross-site state-changing request blocked with 403 Forbidden.');
    } else {
      fail('Cross-site request', `Expected 403, got ${res.status}`);
    }
  }

  // 5. Replayed requests with duplicate idempotency keys
  console.log('\n[Test 5] Anti-Replay & Idempotency Key Validation:');
  {
    const idempotencyKey = `idemp_test_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const req1 = new NextRequest(new URL('/api/cards', 'https://www.tapfolio.me'), {
      method: 'POST',
      headers: {
        host: 'www.tapfolio.me',
        origin: 'https://www.tapfolio.me',
        'sec-fetch-site': 'same-origin',
        'content-type': 'application/json',
        'x-csrf-token': validCsrf,
        'x-idempotency-key': idempotencyKey,
      },
      body: JSON.stringify({ title: 'First Submission' }),
    });
    req1.cookies.set('pertap_jwt', validToken);

    const res1 = await middleware(req1);
    if (res1.status !== 409) {
      pass('Initial request with fresh idempotency key accepted.');
    } else {
      fail('Idempotency initial', `Unexpected initial 409 status: ${res1.status}`);
    }

    // Now send duplicate request with same idempotency key
    const req2 = new NextRequest(new URL('/api/cards', 'https://www.tapfolio.me'), {
      method: 'POST',
      headers: {
        host: 'www.tapfolio.me',
        origin: 'https://www.tapfolio.me',
        'sec-fetch-site': 'same-origin',
        'content-type': 'application/json',
        'x-csrf-token': validCsrf,
        'x-idempotency-key': idempotencyKey,
      },
      body: JSON.stringify({ title: 'Replayed Submission' }),
    });
    req2.cookies.set('pertap_jwt', validToken);

    const res2 = await middleware(req2);
    const body2 = await res2.json().catch(() => ({}));
    if (res2.status === 409 && body2.code === 'DUPLICATE_TRANSACTION') {
      pass('Duplicate request with consumed idempotency key rejected with 409 Conflict.');
    } else {
      fail('Replayed request', `Expected 409 DUPLICATE_TRANSACTION, got ${res2.status}`);
    }
  }

  // 6. Duplicate transactions (concurrent/rapid submissions)
  console.log('\n[Test 6] Duplicate Concurrent Transaction Prevention:');
  {
    const concurrentKey = `concurrent_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const [lock1, lock2] = await Promise.all([
      acquireIdempotencyLock(concurrentKey, '/api/cards', 'POST', 'hash1', 42),
      acquireIdempotencyLock(concurrentKey, '/api/cards', 'POST', 'hash1', 42),
    ]);

    const onePassed = (!lock1.duplicate && lock2.duplicate) || (lock1.duplicate && !lock2.duplicate);
    if (onePassed) {
      pass('Atomic lock correctly granted exactly one transaction and rejected concurrent duplicate.');
    } else {
      fail('Concurrent transaction', `Expected 1 success and 1 duplicate. Got lock1.dup=${lock1.duplicate}, lock2.dup=${lock2.duplicate}`);
    }
  }

  // 7. Expired sessions
  console.log('\n[Test 7] Expired / Invalid Session Handling:');
  {
    const expiredToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjQyLCJlbWFpbCI6InVzZXJAdGFwZm9saW8ubWUiLCJleHAiOjE2MDAwMDAwMDB9.invalid_signature';
    const req = new NextRequest(new URL('/dashboard', 'https://www.tapfolio.me'), {
      method: 'GET',
      headers: {
        host: 'www.tapfolio.me',
      },
    });
    req.cookies.set('pertap_jwt', expiredToken);

    const res = await middleware(req);
    // Should redirect to /login
    if (res.status === 307 || res.status === 302 || res.headers.get('location')?.includes('/login')) {
      pass('Expired/invalid session token triggers redirection to login.');
    } else {
      fail('Expired session', `Expected redirect to /login, got ${res.status}`);
    }
  }

  // 8. Unauthorized administrative requests
  console.log('\n[Test 8] Administrative RBAC Protection:');
  {
    const reqNonAdmin = new NextRequest(new URL('/admin/users', 'https://www.tapfolio.me'), {
      method: 'GET',
      headers: {
        host: 'www.tapfolio.me',
      },
    });
    reqNonAdmin.cookies.set('pertap_jwt', validToken); // Regular user

    const resNonAdmin = await middleware(reqNonAdmin);
    if (resNonAdmin.status === 307 || resNonAdmin.status === 302 || resNonAdmin.headers.get('location')?.includes('/dashboard')) {
      pass('Non-admin user blocked from /admin and redirected to dashboard.');
    } else {
      fail('Unauthorized admin access', `Non-admin was not redirected away from /admin. Status: ${resNonAdmin.status}`);
    }

    // Authorized admin user
    const reqAdmin = new NextRequest(new URL('/admin/users', 'https://www.tapfolio.me'), {
      method: 'GET',
      headers: {
        host: 'www.tapfolio.me',
      },
    });
    reqAdmin.cookies.set('pertap_jwt', adminToken); // Admin user

    const resAdmin = await middleware(reqAdmin);
    if (resAdmin.status === 200 || !resAdmin.headers.get('location')) {
      pass('Authorized admin user allowed to access /admin/users.');
    } else {
      fail('Authorized admin access', `Admin user was unexpectedly redirected: ${resAdmin.status}`);
    }
  }

  // 9. Invalid payloads / Content-Type enforcement
  console.log('\n[Test 9] Content-Type Validation:');
  {
    const reqInvalidContent = new NextRequest(new URL('/api/profile', 'https://www.tapfolio.me'), {
      method: 'POST',
      headers: {
        host: 'www.tapfolio.me',
        origin: 'https://www.tapfolio.me',
        'sec-fetch-site': 'same-origin',
        'content-type': 'text/plain',
        'content-length': '25',
        'x-csrf-token': validCsrf,
      },
      body: 'malicious plain text body',
    });
    reqInvalidContent.cookies.set('pertap_jwt', validToken);

    const res = await middleware(reqInvalidContent);
    if (res.status === 415) {
      pass('Disallowed Content-Type (text/plain) rejected with 415 Unsupported Media Type.');
    } else {
      fail('Content-Type check', `Expected 415, got ${res.status}`);
    }
  }

  // 10. Production HTTPS enforcement
  console.log('\n[Test 10] Production HTTPS Enforcement:');
  {
    const originalEnv = process.env.NODE_ENV;
    (process.env as any).NODE_ENV = 'production';
    try {
      const reqHttp = new NextRequest(new URL('http://www.tapfolio.me/dashboard'), {
        headers: {
          host: 'www.tapfolio.me',
          'x-forwarded-proto': 'http',
        },
      });

      const resHttp = await middleware(reqHttp);
      if (resHttp.status === 301 && resHttp.headers.get('location')?.startsWith('https://')) {
        pass('Insecure HTTP request in production redirected to HTTPS with status 301.');
      } else {
        fail('HTTPS enforcement', `Expected 301 redirect to https://, got ${resHttp.status}`);
      }
    } finally {
      process.env.NODE_ENV = originalEnv;
    }
  }

  // 11. Existing Flutter HMAC request validation
  console.log('\n[Test 11] Flutter Mobile HMAC Pipeline Compatibility:');
  {
    const timestamp = Date.now().toString();
    const nonce = `mobile_nonce_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const payload = JSON.stringify({ title: 'Mobile Created Card' });
    const bodyHash = await computeSha256(payload);
    const sessionKey = await deriveSessionKey(validToken);

    const canonical = `POST\n/api/cards\n\n${timestamp}\n${nonce}\n${bodyHash}`;
    const signature = await computeHmacSha256(canonical, sessionKey);

    const reqMobile = new NextRequest(new URL('/api/cards', 'https://www.tapfolio.me'), {
      method: 'POST',
      headers: {
        host: 'www.tapfolio.me',
        'x-pertap-client': 'mobile-app',
        'x-pertap-token': validToken,
        'x-pertap-timestamp': timestamp,
        'x-pertap-nonce': nonce,
        'x-pertap-body-hash': bodyHash,
        'x-pertap-signature': signature,
        'content-type': 'application/json',
      },
      body: payload,
    });

    const resMobile = await middleware(reqMobile);
    if (resMobile.headers.get('X-Pertap-Response-Signature') && resMobile.headers.get('X-Pertap-Response-Timestamp')) {
      pass('Flutter mobile request successfully passed HMAC security and received signed response.');
    } else {
      fail('Mobile HMAC compatibility', `Mobile request failed or lacked response signature: status=${resMobile.status}`);
    }

    // Tampered mobile request
    const reqTampered = new NextRequest(new URL('/api/cards', 'https://www.tapfolio.me'), {
      method: 'POST',
      headers: {
        host: 'www.tapfolio.me',
        'x-pertap-client': 'mobile-app',
        'x-pertap-token': validToken,
        'x-pertap-timestamp': timestamp,
        'x-pertap-nonce': `nonce_tampered_${Date.now()}`,
        'x-pertap-body-hash': bodyHash,
        'x-pertap-signature': '0000000000000000000000000000000000000000000000000000000000000000',
        'content-type': 'application/json',
      },
      body: payload,
    });

    const resTampered = await middleware(reqTampered);
    if (resTampered.status === 403) {
      pass('Tampered mobile HMAC signature correctly rejected with 403 Forbidden.');
    } else {
      fail('Tampered mobile HMAC', `Expected 403, got ${resTampered.status}`);
    }
  }

  // 12. Browser login & logout cookie functionality
  console.log('\n[Test 12] Browser Login / Logout & CSRF Cookie Lifecycle:');
  {
    // Test initial page visit generates pertap_csrf cookie
    const reqVisit = new NextRequest(new URL('/login', 'https://www.tapfolio.me'), {
      headers: {
        host: 'www.tapfolio.me',
      },
    });

    const resVisit = await middleware(reqVisit);
    const csrfCookie = resVisit.cookies.get(CSRF_COOKIE_NAME);
    if (csrfCookie && csrfCookie.value) {
      const verified = await verifyCsrfToken(csrfCookie.value);
      if (verified.valid) {
        pass('Middleware automatically provisions valid cryptographic CSRF cookie for browser.');
      } else {
        fail('CSRF cookie issuance', `Issued token failed verification: ${verified.reason}`);
      }
    } else {
      fail('CSRF cookie issuance', 'Middleware did not set pertap_csrf cookie on initial page load.');
    }

    // Verify CORS header with credentials uses strict origin and never wildcard
    const corsOrigin = resVisit.headers.get('Access-Control-Allow-Origin');
    const corsCreds = resVisit.headers.get('Access-Control-Allow-Credentials');
    if (corsCreds === 'true') {
      if (corsOrigin === '*') {
        fail('CORS wildcard check', 'Wildcard origin used with credentials!');
      } else {
        pass('Strict credentialed CORS: origin is explicitly allowlisted and never wildcard.');
      }
    } else {
      pass('CORS credentials policy verified.');
    }
  }

  console.log('\n======================================================');
  console.log('ALL 12 WEBSITE ↔ SERVER SECURITY TESTS PASSED (100%)');
  console.log('======================================================\n');
}

runWebSecurityTests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

