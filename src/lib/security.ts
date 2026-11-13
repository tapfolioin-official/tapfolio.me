import { NextRequest } from 'next/server';

// Server-side master transaction secret (stored in server env, never sent to clients)
const SERVER_MASTER_SECRET =
  process.env.API_TRANSACTION_SECRET ||
  process.env.JWT_SECRET ||
  'tapfolio_master_sec_2026_9f8a3c1e5b7d';

// In-memory nonce cache to prevent replay attacks (nonce -> expiration timestamp)
const nonceCache = new Map<string, number>();

// Allowed clock skew window (5 minutes in milliseconds)
const MAX_CLOCK_SKEW_MS = 5 * 60 * 1000;

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

/**
 * Periodically purge expired nonces to prevent memory leaks.
 */
function purgeExpiredNonces() {
  const now = Date.now();
  for (const [nonce, expiresAt] of nonceCache.entries()) {
    if (now > expiresAt) {
      nonceCache.delete(nonce);
    }
  }
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
 * Derives a dynamic, ephemeral transaction key from a session JWT token.
 * Eliminates the need to embed any permanent static HMAC secret in client apps.
 */
export async function deriveSessionKey(token: string): Promise<string> {
  return computeHmacSha256(`session_key:${token}`, SERVER_MASTER_SECRET);
}

/**
 * Derives an ephemeral device handshake key.
 */
export async function deriveHandshakeKey(handshakeToken: string): Promise<string> {
  return computeHmacSha256(`handshake_key:${handshakeToken}`, SERVER_MASTER_SECRET);
}

/**
 * Resolves the appropriate transaction signing secret for an incoming request.
 */
export async function resolveRequestSecret(request: NextRequest): Promise<string> {
  // 1. Session-based key derivation (authenticated mobile requests)
  let token = request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
  if (!token) {
    token = request.headers.get('x-pertap-token') || request.cookies.get('pertap_jwt')?.value;
  }
  if (token && token.trim().length > 0) {
    return deriveSessionKey(token.trim());
  }

  // 2. Handshake-based key derivation (unauthenticated mobile requests)
  const handshake = request.headers.get('x-pertap-handshake');
  if (handshake && handshake.trim().length > 0) {
    return deriveHandshakeKey(handshake.trim());
  }

  // 3. Fallback to master transaction secret
  return SERVER_MASTER_SECRET;
}

export interface VerificationResult {
  valid: boolean;
  isMobile: boolean;
  error?: string;
  status?: number;
  nonce?: string;
  timestamp?: string;
  resolvedSecret?: string;
}

/**
 * Validates request integrity, timestamp freshness, and nonce uniqueness (anti-replay).
 */
export async function verifyTransactionSecurity(request: NextRequest): Promise<VerificationResult> {
  const clientHeader = request.headers.get('x-pertap-client');
  const signature = request.headers.get('x-pertap-signature');

  // If this is not a mobile client request and has no signature, pass through for web browser
  const isMobile = clientHeader?.toLowerCase().startsWith('mobile-') || Boolean(signature);
  if (!isMobile) {
    return { valid: true, isMobile: false };
  }

  const timestamp = request.headers.get('x-pertap-timestamp');
  const nonce = request.headers.get('x-pertap-nonce');
  const bodyHash = request.headers.get('x-pertap-body-hash');

  // 1. Verify all required security headers are present
  if (!timestamp || !nonce || !bodyHash || !signature) {
    return {
      valid: false,
      isMobile: true,
      error: 'Missing required security transaction headers (Timestamp, Nonce, Body-Hash, or Signature).',
      status: 400,
    };
  }

  // 2. Validate timestamp freshness (Replay attack & expiration prevention)
  const reqTime = parseInt(timestamp, 10);
  if (isNaN(reqTime)) {
    return {
      valid: false,
      isMobile: true,
      error: 'Invalid security timestamp format.',
      status: 400,
    };
  }

  const now = Date.now();
  if (Math.abs(now - reqTime) > MAX_CLOCK_SKEW_MS) {
    return {
      valid: false,
      isMobile: true,
      error: 'Request timestamp expired or device clock skewed (must be within 5 minutes).',
      status: 403,
    };
  }

  // 3. Verify nonce uniqueness (Replay Attack Prevention)
  purgeExpiredNonces();
  if (nonceCache.has(nonce)) {
    return {
      valid: false,
      isMobile: true,
      error: 'Replay attack detected: Transaction nonce has already been consumed.',
      status: 403,
    };
  }

  // Register nonce with expiration time
  nonceCache.set(nonce, reqTime + MAX_CLOCK_SKEW_MS);

  // 4. Resolve the cryptographic secret for this transaction
  const secret = await resolveRequestSecret(request);

  // 5. Build canonical representation: METHOD\nPATH\nQUERY\nTIMESTAMP\nNONCE\nBODY_HASH
  const method = request.method.toUpperCase();
  const pathname = request.nextUrl.pathname;
  const search = request.nextUrl.search ? request.nextUrl.search.replace(/^\?/, '') : '';
  const canonicalString = `${method}\n${pathname}\n${search}\n${timestamp}\n${nonce}\n${bodyHash}`;

  const expectedSignature = await computeHmacSha256(canonicalString, secret);

  try {
    const signatureBuffer = hexToBytes(signature);
    const expectedBuffer = hexToBytes(expectedSignature);

    if (
      signatureBuffer.length !== expectedBuffer.length ||
      !timingSafeEqual(signatureBuffer, expectedBuffer)
    ) {
      return {
        valid: false,
        isMobile: true,
        error: 'Cryptographic signature mismatch. Transaction payload may have been tampered with.',
        status: 403,
      };
    }
  } catch (_) {
    return {
      valid: false,
      isMobile: true,
      error: 'Invalid cryptographic signature format.',
      status: 403,
    };
  }

  return {
    valid: true,
    isMobile: true,
    nonce,
    timestamp,
    resolvedSecret: secret,
  };
}

/**
 * Signs the server response for the mobile client.
 * Binds status code, server timestamp, request nonce, and response body hash.
 */
export async function generateResponseSignature(
  status: number,
  nonce: string,
  secret = SERVER_MASTER_SECRET,
  responseBodyHash = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
) {
  const serverTimestamp = Date.now().toString();
  // Canonical representation: STATUS\nTIMESTAMP\nNONCE\nBODY_HASH
  const canonical = `${status}\n${serverTimestamp}\n${nonce}\n${responseBodyHash}`;
  const signature = await computeHmacSha256(canonical, secret);

  return {
    signature,
    timestamp: serverTimestamp,
    bodyHash: responseBodyHash,
  };
}
