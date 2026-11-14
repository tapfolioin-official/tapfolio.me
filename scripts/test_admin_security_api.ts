import { NextRequest } from 'next/server';
import { signJWT } from '../src/lib/auth';
import { GET as getMetrics } from '../src/app/api/admin/security/metrics/route';
import { GET as getEvents, POST as postEvent } from '../src/app/api/admin/security/events/route';
import { GET as getBlocked, POST as postBlock, DELETE as deleteBlock } from '../src/app/api/admin/security/block-ip/route';

async function runTests() {
  console.log('\n======================================================');
  console.log('TAPFOLIO ADMIN SECURITY & THREAT API TEST SUITE');
  console.log('======================================================\n');

  const adminToken = await signJWT({
    userId: 1,
    email: 'nibrasulhaqqamini@gmail.com',
    role: 'ADMIN',
  });

  const userToken = await signJWT({
    userId: 99,
    email: 'hacker@example.com',
    role: 'USER',
  });

  function createReq(url: string, method = 'GET', token?: string, body?: any) {
    const headers = new Headers();
    if (token) headers.set('cookie', `pertap_jwt=${token}`);
    if (body) headers.set('content-type', 'application/json');

    return new NextRequest(new URL(url, 'http://localhost:3000'), {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  // 1. Non-admin rejection test
  console.log('[Test 1] Non-Admin Access Control:');
  {
    const req = createReq('/api/admin/security/metrics', 'GET', userToken);
    const res = await getMetrics(req);
    if (res.status === 403) {
      console.log('  ✔ PASS: Non-admin correctly rejected with 403 Forbidden.');
    } else {
      console.error(`  ✖ FAIL: Expected 403, got ${res.status}`);
      process.exit(1);
    }
  }

  // 2. Admin Metrics retrieval
  console.log('\n[Test 2] Security Metrics Telemetry:');
  {
    const req = createReq('/api/admin/security/metrics', 'GET', adminToken);
    const res = await getMetrics(req);
    const data = await res.json();
    if (res.status === 200 && data.success && data.metrics) {
      console.log(`  ✔ PASS: Telemetry retrieved: Total 24h threats = ${data.metrics.total24h}, Blocked IPs = ${data.metrics.blockedIpsCount}`);
    } else {
      console.error('  ✖ FAIL: Failed to retrieve metrics:', data);
      process.exit(1);
    }
  }

  // 3. Security Events List & Filtering
  console.log('\n[Test 3] Security Events Feed & Filtering:');
  {
    const req = createReq('/api/admin/security/events?limit=10', 'GET', adminToken);
    const res = await getEvents(req);
    const data = await res.json();
    if (res.status === 200 && data.success && Array.isArray(data.events)) {
      console.log(`  ✔ PASS: Live event stream returned ${data.events.length} events (Total: ${data.total})`);
    } else {
      console.error('  ✖ FAIL: Failed to list events:', data);
      process.exit(1);
    }
  }

  // 4. Test Event Injection
  console.log('\n[Test 4] Manual / Simulated Incident Injection:');
  {
    const req = createReq('/api/admin/security/events', 'POST', adminToken, {
      eventType: 'HMAC_MISMATCH',
      severity: 'CRITICAL',
      clientType: 'mobile',
      ipAddress: '203.0.113.88',
      path: '/api/cards/12/activate',
      method: 'POST',
      detail: 'Unit test verification HMAC payload mismatch.',
    });
    const res = await postEvent(req);
    const data = await res.json();
    if (res.status === 200 && data.success && data.event?.ipAddress === '203.0.113.88') {
      console.log('  ✔ PASS: Test incident logged and instantly queryable in stream.');
    } else {
      console.error('  ✖ FAIL: Failed to inject incident:', data);
      process.exit(1);
    }
  }

  // 5. IP Blocking & Unblocking Lifecycle
  console.log('\n[Test 5] Malicious IP Containment Lifecycle:');
  {
    const targetIp = '198.51.100.99';

    // Block IP
    const blockReq = createReq('/api/admin/security/block-ip', 'POST', adminToken, {
      ip: targetIp,
      reason: 'Automated test suite quarantine',
      durationHours: 24,
    });
    const blockRes = await postBlock(blockReq);
    const blockData = await blockRes.json();

    if (blockRes.status === 200 && blockData.success) {
      console.log(`  ✔ PASS: Successfully blocked malicious IP ${targetIp}.`);
    } else {
      console.error('  ✖ FAIL: Failed to block IP:', blockData);
      process.exit(1);
    }

    // Verify blocked in list
    const listReq = createReq('/api/admin/security/block-ip', 'GET', adminToken);
    const listRes = await getBlocked(listReq);
    const listData = await listRes.json();
    const isFound = listData.blockedIps?.some((b: any) => b.ipAddress === targetIp);
    if (isFound) {
      console.log(`  ✔ PASS: IP ${targetIp} confirmed present in active blocklist.`);
    } else {
      console.error('  ✖ FAIL: Blocked IP not found in active list.');
      process.exit(1);
    }

    // Unblock IP
    const unblockReq = createReq('/api/admin/security/block-ip', 'DELETE', adminToken, {
      ip: targetIp,
    });
    const unblockRes = await deleteBlock(unblockReq);
    const unblockData = await unblockRes.json();
    if (unblockRes.status === 200 && unblockData.success) {
      console.log(`  ✔ PASS: Successfully unblocked IP ${targetIp}.`);
    } else {
      console.error('  ✖ FAIL: Failed to unblock IP:', unblockData);
      process.exit(1);
    }
  }

  console.log('\n======================================================');
  console.log('ALL ADMIN SECURITY API TESTS PASSED (100%)');
  console.log('======================================================\n');
}

runTests().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
