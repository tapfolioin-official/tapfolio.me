import { NextRequest } from 'next/server';

// Master transaction secret (shared across transaction & web security)
export const SERVER_MASTER_SECRET =
  process.env.API_TRANSACTION_SECRET ||
  process.env.JWT_SECRET ||
  'tapfolio_master_sec_2026_9f8a3c1e5b7d';

export const CSRF_COOKIE_NAME = 'pertap_csrf';
export const CSRF_HEADER_NAME = 'x-csrf-token';
export const IDEMPOTENCY_HEADER_NAME = 'x-idempotency-key';

// 24-hour token validity window
export const CSRF_TTL_MS = 24 * 60 * 60 * 1000;

// 15-minute idempotency TTL
export const IDEMPOTENCY_TTL_MS = 15 * 60 * 1000;

export const TRUSTED_ORIGINS = new Set([
  'https://tapfolio.me',
  'https://www.tapfolio.me',
]);

export const TRUSTED_HOSTS = new Set([
  'tapfolio.me',
  'www.tapfolio.me',
]);

function bufferToHex(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let hex = '';
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, '0');
  }
  return hex;
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a[i] ^ b[i];
  }
  return diff === 0;
}

function getRandomHex(bytesCount = 16): string {
  const bytes = new Uint8Array(bytesCount);
  crypto.getRandomValues(bytes);
  return bufferToHex(bytes.buffer);
}

/**
 * Validates if the given origin is trusted.
 */
export function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  if (TRUSTED_ORIGINS.has(origin)) return true;

  try {
    const url = new URL(origin);
    const hostname = url.hostname.toLowerCase();
    if (
      TRUSTED_HOSTS.has(hostname) ||
      hostname.endsWith('.vercel.app') ||
      hostname.endsWith('.tapfolio.me') ||
      hostname === 'tapfolio.me' ||
      hostname === 'www.tapfolio.me'
    ) {
      return true;
    }

    if (process.env.NODE_ENV !== 'production') {
      if (
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname === '0.0.0.0' ||
        hostname.startsWith('192.168.') ||
        hostname.startsWith('10.') ||
        hostname.endsWith('.local')
      ) {
        return true;
      }
    }
  } catch (_) {}

  return false;
}

/**
 * Validates if the given host / x-forwarded-host header is legitimate.
 */
export function isAllowedHost(host: string | null): boolean {
  if (!host) return true;

  // Handle multiple comma-separated hosts from proxies/load balancers
  const primaryHost = host.split(',')[0].trim();
  const hostWithoutPort = primaryHost.split(':')[0].toLowerCase();

  if (
    TRUSTED_HOSTS.has(hostWithoutPort) ||
    hostWithoutPort.endsWith('.vercel.app') ||
    hostWithoutPort.endsWith('.tapfolio.me') ||
    hostWithoutPort === 'tapfolio.me' ||
    hostWithoutPort === 'www.tapfolio.me'
  ) {
    return true;
  }

  if (process.env.NODE_ENV !== 'production') {
    if (
      hostWithoutPort === 'localhost' ||
      hostWithoutPort === '127.0.0.1' ||
      hostWithoutPort === '0.0.0.0' ||
      hostWithoutPort.startsWith('192.168.') ||
      hostWithoutPort.startsWith('10.') ||
      hostWithoutPort.endsWith('.local')
    ) {
      return true;
    }
  }

  return false;
}

/**
 * Computes SHA-256 hash in lowercase hex format using standard Web Crypto API.
 */
export async function computeSha256(data: string | Uint8Array): Promise<string> {
  const input = typeof data === 'string' ? new TextEncoder().encode(data) : data;
  const hash = await crypto.subtle.digest('SHA-256', input as any);
  return bufferToHex(hash);
}

/**
 * Computes HMAC-SHA256 signature in lowercase hex format using standard Web Crypto API.
 */
export async function computeHmacSha256(data: string, secret = SERVER_MASTER_SECRET): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret) as any,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data) as any);
  return bufferToHex(signature);
}

/**
 * Generates a cryptographically signed HMAC-SHA256 CSRF token.
 * Format: `<entropy>.<timestamp>.<hmacSignature>`
 */
export async function generateCsrfToken(): Promise<string> {
  const entropy = getRandomHex(16);
  const timestamp = Date.now().toString();
  const payload = `${entropy}:${timestamp}`;
  const signature = await computeHmacSha256(payload, SERVER_MASTER_SECRET);
  return `${entropy}.${timestamp}.${signature}`;
}

/**
 * Verifies the integrity, freshness, and signature of a CSRF token.
 */
export async function verifyCsrfToken(token: string | null | undefined): Promise<{ valid: boolean; reason?: string }> {
  if (!token || typeof token !== 'string') {
    return { valid: false, reason: 'CSRF token is missing.' };
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return { valid: false, reason: 'Malformed CSRF token structure.' };
  }

  const [entropy, timestampStr, signature] = parts;
  const timestamp = parseInt(timestampStr, 10);
  if (isNaN(timestamp)) {
    return { valid: false, reason: 'Invalid CSRF token timestamp.' };
  }

  const now = Date.now();
  if (now - timestamp > CSRF_TTL_MS) {
    return { valid: false, reason: 'CSRF token has expired.' };
  }

  // Prevent clock-skew / tokens issued unreasonably far in the future (5 minutes)
  if (timestamp - now > 5 * 60 * 1000) {
    return { valid: false, reason: 'CSRF token timestamp is in the future.' };
  }

  const payload = `${entropy}:${timestampStr}`;
  const expectedSignature = await computeHmacSha256(payload, SERVER_MASTER_SECRET);

  try {
    const sigBuf = hexToBytes(signature);
    const expectedBuf = hexToBytes(expectedSignature);

    if (sigBuf.length !== expectedBuf.length || !timingSafeEqual(sigBuf, expectedBuf)) {
      return { valid: false, reason: 'CSRF token cryptographic signature mismatch.' };
    }
  } catch (_) {
    return { valid: false, reason: 'Invalid CSRF token signature format.' };
  }

  return { valid: true };
}

/**
 * Validates request Content-Type for state-changing requests.
 */
export function validateContentType(request: NextRequest): { valid: boolean; reason?: string } {
  const method = request.method.toUpperCase();
  if (!['POST', 'PUT', 'PATCH'].includes(method)) {
    return { valid: true };
  }

  const contentLength = request.headers.get('content-length');
  if (contentLength === '0') {
    return { valid: true };
  }

  const contentType = request.headers.get('content-type');
  if (!contentType) {
    // If request has content-length > 0 or chunked encoding, Content-Type is required
    if (contentLength && parseInt(contentLength, 10) > 0) {
      return { valid: false, reason: 'Missing Content-Type header on state-changing request.' };
    }
    return { valid: true };
  }

  const lower = contentType.toLowerCase();
  if (
    lower.includes('application/json') ||
    lower.includes('multipart/form-data') ||
    lower.includes('application/x-www-form-urlencoded')
  ) {
    return { valid: true };
  }

  return { valid: false, reason: `Disallowed Content-Type: ${contentType}. Must be JSON or multipart/form-data.` };
}

// In-memory sliding fallback cache for idempotency records in Edge Middleware
interface MemoryIdempotencyEntry {
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  requestHash: string;
  responseCode?: number;
  responseBody?: string;
  expiresAt: number;
}
const memoryIdempotencyStore = new Map<string, MemoryIdempotencyEntry>();

function purgeExpiredIdempotencyKeys() {
  const now = Date.now();
  for (const [key, entry] of memoryIdempotencyStore.entries()) {
    if (now > entry.expiresAt) {
      memoryIdempotencyStore.delete(key);
    }
  }
}

/**
 * Atomically acquires an idempotency lock for sensitive operations.
 * Returns duplicate: true if key was already consumed or is currently processing.
 */
export async function acquireIdempotencyLock(
  key: string,
  path: string,
  method: string,
  requestHash: string,
  userId?: number
): Promise<{ duplicate: boolean; status?: string; responseCode?: number; responseBody?: string; error?: string }> {
  purgeExpiredIdempotencyKeys();
  const now = Date.now();

  const memoryEntry = memoryIdempotencyStore.get(key);
  if (memoryEntry && memoryEntry.expiresAt > now) {
    return {
      duplicate: true,
      status: memoryEntry.status,
      responseCode: memoryEntry.responseCode,
      responseBody: memoryEntry.responseBody,
      error:
        memoryEntry.status === 'PENDING'
          ? 'Transaction is currently processing. Please wait.'
          : 'Duplicate transaction: Request with this idempotency key was already executed.',
    };
  }

  memoryIdempotencyStore.set(key, {
    status: 'PENDING',
    requestHash,
    expiresAt: now + IDEMPOTENCY_TTL_MS,
  });

  return { duplicate: false, status: 'PENDING' };
}

/**
 * Completes an idempotency transaction with status and response body.
 */
export function completeIdempotency(
  key: string,
  responseCode: number,
  responseBody?: string
): void {
  const entry = memoryIdempotencyStore.get(key);
  if (entry) {
    entry.status = 'COMPLETED';
    entry.responseCode = responseCode;
    entry.responseBody = responseBody;
  }
}

export interface WebVerificationResult {
  valid: boolean;
  status?: number;
  error?: string;
  isMobile: boolean;
}

/**
 * Validates browser web requests for Origin, Sec-Fetch-Site, Content-Type, and CSRF token integrity.
 */
export async function validateWebRequest(request: NextRequest): Promise<WebVerificationResult> {
  const pathname = request.nextUrl.pathname;
  const method = request.method.toUpperCase();
  const isStateChanging = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

  // 1. Host Validation
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  if (!isAllowedHost(host)) {
    return {
      valid: false,
      status: 400,
      error: 'Invalid or untrusted Host header.',
      isMobile: false,
    };
  }

  // 2. Strict Origin & Sec-Fetch-Site Checking
  const origin = request.headers.get('origin');
  const secFetchSite = request.headers.get('sec-fetch-site');

  if (isStateChanging) {
    // If Sec-Fetch-Site indicates cross-site, reject immediately
    if (secFetchSite === 'cross-site') {
      return {
        valid: false,
        status: 403,
        error: 'Cross-site state-changing requests are strictly forbidden.',
        isMobile: false,
      };
    }

    // If Origin is present, verify against allowed origins
    if (origin) {
      if (!isAllowedOrigin(origin)) {
        return {
          valid: false,
          status: 403,
          error: `Untrusted Origin: ${origin}. Cross-origin mutation requests are not allowed.`,
          isMobile: false,
        };
      }
    } else {
      // Fallback: If no Origin header, check Referer
      const referer = request.headers.get('referer');
      if (referer) {
        try {
          const refOrigin = new URL(referer).origin;
          if (!isAllowedOrigin(refOrigin)) {
            return {
              valid: false,
              status: 403,
              error: `Untrusted Referer: ${refOrigin}. Cross-origin requests are forbidden.`,
              isMobile: false,
            };
          }
        } catch (_) {
          return {
            valid: false,
            status: 403,
            error: 'Malformed Referer header.',
            isMobile: false,
          };
        }
      }
    }

    // 3. Strict Content-Type Validation
    const contentTypeRes = validateContentType(request);
    if (!contentTypeRes.valid) {
      return {
        valid: false,
        status: 415,
        error: contentTypeRes.reason || 'Invalid Content-Type.',
        isMobile: false,
      };
    }

    // 4. Cryptographic CSRF Validation
    // Authenticated browser requests MUST supply a valid CSRF token.
    const token = request.cookies.get('pertap_jwt')?.value;
    const csrfHeader = request.headers.get(CSRF_HEADER_NAME);

    // If session cookie exists, CSRF is strictly required for all mutations
    if (token) {
      if (!csrfHeader) {
        return {
          valid: false,
          status: 403,
          error: 'Missing required CSRF token (X-CSRF-Token) for authenticated state-changing operation.',
          isMobile: false,
        };
      }
      const csrfCheck = await verifyCsrfToken(csrfHeader);
      if (!csrfCheck.valid) {
        return {
          valid: false,
          status: 403,
          error: csrfCheck.reason || 'Invalid or expired CSRF token.',
          isMobile: false,
        };
      }
    } else if (csrfHeader) {
      // For unauthenticated mutations (if a CSRF token was sent), verify it
      const csrfCheck = await verifyCsrfToken(csrfHeader);
      if (!csrfCheck.valid) {
        return {
          valid: false,
          status: 403,
          error: csrfCheck.reason || 'Invalid CSRF token.',
          isMobile: false,
        };
      }
    }
  }

  return { valid: true, isMobile: false };
}
