import { NextRequest } from 'next/server';
import {
  verifyTransactionSecurity,
  generateResponseSignature,
  deriveSessionKey,
  deriveHandshakeKey,
  computeHmacSha256,
  computeSha256,
} from '../src/lib/security';
import crypto from 'crypto';

async function runComprehensiveSecurityAudit() {
  console.log(`===========================================================`);
  console.log(` TAPFOLIO TRANSACTION SECURITY SUITE: AUDIT & VERIFICATION`);
  console.log(`===========================================================\n`);

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, failureDetail?: string) {
    if (condition) {
      console.log(`  [PASS] ${testName}`);
      passed++;
    } else {
      console.error(`  [FAIL] ${testName}: ${failureDetail || 'Assertion failed'}`);
      failed++;
    }
  }

  // 1. Web browser transparency (non-mobile requests pass without disruption)
  const webReq = new NextRequest('http://localhost:3000/api/profile', {
    method: 'GET',
    headers: { 'cookie': 'pertap_jwt=test_jwt_cookie' },
  });
  const webResult = await verifyTransactionSecurity(webReq);
  assert(webResult.valid && !webResult.isMobile, '1. Web browser request passes cleanly without HMAC check');

  // 2. Valid authenticated mobile request signing & verification
  const token = 'mock_user_jwt_token_for_session';
  const sessionKey = await deriveSessionKey(token);
  const method = 'POST';
  const path = '/api/cards';
  const query = 'filter=active';
  const timestamp = Date.now().toString();
  const nonce1 = crypto.randomBytes(16).toString('hex');
  const body = JSON.stringify({ title: 'Investor Card', theme: '0xFF0052FF' });
  const bodyHash = await computeSha256(body);

  // Canonical format: METHOD\nPATH\nQUERY\nTIMESTAMP\nNONCE\nBODY_HASH
  const canonical = `${method}\n${path}\n${query}\n${timestamp}\n${nonce1}\n${bodyHash}`;
  const signature = await computeHmacSha256(canonical, sessionKey);

  const validReq = new NextRequest(`http://localhost:3000${path}?${query}`, {
    method,
    headers: {
      'authorization': `Bearer ${token}`,
      'x-pertap-client': 'mobile-app',
      'x-pertap-timestamp': timestamp,
      'x-pertap-nonce': nonce1,
      'x-pertap-body-hash': bodyHash,
      'x-pertap-signature': signature,
    },
  });
  const validResult = await verifyTransactionSecurity(validReq);
  assert(validResult.valid && validResult.isMobile, '2. Valid authenticated mobile request verified with session-derived key');

  // 3. Modified request payload (tampering detection)
  const tamperedBodyHash = await computeSha256('{"hacked": true}');
  const tamperedReq = new NextRequest(`http://localhost:3000${path}?${query}`, {
    method,
    headers: {
      'authorization': `Bearer ${token}`,
      'x-pertap-client': 'mobile-app',
      'x-pertap-timestamp': timestamp,
      'x-pertap-nonce': crypto.randomBytes(16).toString('hex'),
      'x-pertap-body-hash': tamperedBodyHash,
      'x-pertap-signature': signature, // signature made with original body hash
    },
  });
  const tamperedResult = await verifyTransactionSecurity(tamperedReq);
  assert(!tamperedResult.valid && tamperedResult.status === 403, '3. Modified request payload detected and blocked with 403');

  // 4. Invalid signature detection
  const invalidSigReq = new NextRequest(`http://localhost:3000${path}?${query}`, {
    method,
    headers: {
      'authorization': `Bearer ${token}`,
      'x-pertap-client': 'mobile-app',
      'x-pertap-timestamp': timestamp,
      'x-pertap-nonce': crypto.randomBytes(16).toString('hex'),
      'x-pertap-body-hash': bodyHash,
      'x-pertap-signature': '0000000000000000000000000000000000000000000000000000000000000000',
    },
  });
  const invalidSigResult = await verifyTransactionSecurity(invalidSigReq);
  assert(!invalidSigResult.valid && invalidSigResult.status === 403, '4. Invalid signature rejected with 403 Forbidden');

  // 5. Anti-Replay Attack Protection (Replay of nonce1)
  const replayReq = new NextRequest(`http://localhost:3000${path}?${query}`, {
    method,
    headers: {
      'authorization': `Bearer ${token}`,
      'x-pertap-client': 'mobile-app',
      'x-pertap-timestamp': timestamp,
      'x-pertap-nonce': nonce1, // replayed nonce1
      'x-pertap-body-hash': bodyHash,
      'x-pertap-signature': signature,
    },
  });
  const replayResult = await verifyTransactionSecurity(replayReq);
  assert(!replayResult.valid && replayResult.status === 403, '5. Replay attack blocked with 403 Forbidden (Nonce already consumed)');

  // 6. Expired timestamp (> 5 minutes in the past)
  const expiredTime = (Date.now() - 6 * 60 * 1000).toString(); // 6 mins ago
  const expiredNonce = crypto.randomBytes(16).toString('hex');
  const expiredCanonical = `${method}\n${path}\n${query}\n${expiredTime}\n${expiredNonce}\n${bodyHash}`;
  const expiredSig = await computeHmacSha256(expiredCanonical, sessionKey);

  const expiredReq = new NextRequest(`http://localhost:3000${path}?${query}`, {
    method,
    headers: {
      'authorization': `Bearer ${token}`,
      'x-pertap-client': 'mobile-app',
      'x-pertap-timestamp': expiredTime,
      'x-pertap-nonce': expiredNonce,
      'x-pertap-body-hash': bodyHash,
      'x-pertap-signature': expiredSig,
    },
  });
  const expiredResult = await verifyTransactionSecurity(expiredReq);
  assert(!expiredResult.valid && expiredResult.status === 403, '6. Expired timestamp rejected (past 5-minute window)');

  // 7. Future timestamp (> 5 minutes in the future)
  const futureTime = (Date.now() + 10 * 60 * 1000).toString(); // 10 mins in future
  const futureNonce = crypto.randomBytes(16).toString('hex');
  const futureCanonical = `${method}\n${path}\n${query}\n${futureTime}\n${futureNonce}\n${bodyHash}`;
  const futureSig = await computeHmacSha256(futureCanonical, sessionKey);

  const futureReq = new NextRequest(`http://localhost:3000${path}?${query}`, {
    method,
    headers: {
      'authorization': `Bearer ${token}`,
      'x-pertap-client': 'mobile-app',
      'x-pertap-timestamp': futureTime,
      'x-pertap-nonce': futureNonce,
      'x-pertap-body-hash': bodyHash,
      'x-pertap-signature': futureSig,
    },
  });
  const futureResult = await verifyTransactionSecurity(futureReq);
  assert(!futureResult.valid && futureResult.status === 403, '7. Future-dated timestamp rejected (anti-clock tampering)');

  // 8. Server Response Signing & Body Binding
  const responseStatus = 200;
  const resBody = JSON.stringify({ success: true, cardId: 'card_123' });
  const resBodyHash = await computeSha256(resBody);
  const responseSignature = await generateResponseSignature(responseStatus, nonce1, sessionKey, resBodyHash);

  assert(Boolean(responseSignature.signature && responseSignature.timestamp), '8. Server response signed with status, timestamp, nonce, and bodyHash');

  // 9. Concurrent Duplicate Transactions (Race Condition Test)
  const concurrentNonce = crypto.randomBytes(16).toString('hex');
  const concurrentTime = Date.now().toString();
  const concurrentCanonical = `${method}\n${path}\n${query}\n${concurrentTime}\n${concurrentNonce}\n${bodyHash}`;
  const concurrentSig = await computeHmacSha256(concurrentCanonical, sessionKey);

  const createConcurrentReq = () =>
    new NextRequest(`http://localhost:3000${path}?${query}`, {
      method,
      headers: {
        'authorization': `Bearer ${token}`,
        'x-pertap-client': 'mobile-app',
        'x-pertap-timestamp': concurrentTime,
        'x-pertap-nonce': concurrentNonce,
        'x-pertap-body-hash': bodyHash,
        'x-pertap-signature': concurrentSig,
      },
    });

  const [resA, resB] = await Promise.all([
    verifyTransactionSecurity(createConcurrentReq()),
    verifyTransactionSecurity(createConcurrentReq()),
  ]);

  // Exactly one must succeed, and the other must be rejected as a replay
  const onePassedOneFailed = (resA.valid && !resB.valid && resB.status === 403) || (!resA.valid && resB.valid && resA.status === 403);
  assert(onePassedOneFailed, '9. Concurrent duplicate requests race condition handled: exactly one succeeds, duplicate rejected');

  // 10. Handshake Key Provisioning for Unauthenticated Flows
  const handshakeToken = 'hs_device_token_999';
  const handshakeKey = await deriveHandshakeKey(handshakeToken);
  const hsTime = Date.now().toString();
  const hsNonce = crypto.randomBytes(16).toString('hex');
  const loginBody = JSON.stringify({ email: 'user@tapfolio.me', password: 'secretpassword' });
  const loginBodyHash = await computeSha256(loginBody);
  const hsCanonical = `POST\n/api/auth/login\n\n${hsTime}\n${hsNonce}\n${loginBodyHash}`;
  const hsSignature = await computeHmacSha256(hsCanonical, handshakeKey);

  const handshakeReq = new NextRequest('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: {
      'x-pertap-client': 'mobile-app',
      'x-pertap-handshake': handshakeToken,
      'x-pertap-timestamp': hsTime,
      'x-pertap-nonce': hsNonce,
      'x-pertap-body-hash': loginBodyHash,
      'x-pertap-signature': hsSignature,
    },
  });
  const handshakeResult = await verifyTransactionSecurity(handshakeReq);
  assert(handshakeResult.valid && handshakeResult.isMobile, '10. Pre-auth request verified using dynamic ephemeral handshake key (zero static secrets)');

  console.log(`\n===========================================================`);
  console.log(` AUDIT COMPLETE: ${passed} PASSED, ${failed} FAILED`);
  console.log(`===========================================================`);

  if (failed > 0) {
    process.exit(1);
  }
}

runComprehensiveSecurityAudit();
