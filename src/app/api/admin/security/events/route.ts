import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';
import { getSecurityEvents, recordSecurityEvent, SecurityEventType, SecuritySeverity } from '@/lib/security-monitor';

async function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get('pertap_jwt')?.value;
  if (!token) return null;
  const payload = await verifyJWT(token);
  if (!payload) return null;
  const isAdminEmail =
    payload.email === 'nibrasulhaqqamini@gmail.com' ||
    payload.email === 'tapfolio.in@gmail.com' ||
    (process.env.ADMIN_EMAIL && payload.email === process.env.ADMIN_EMAIL);
  if (!isAdminEmail) return null;
  return payload;
}

export async function GET(request: NextRequest) {
  const admin = await verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
  }

  const url = new URL(request.url);
  const severity = url.searchParams.get('severity') || undefined;
  const eventType = url.searchParams.get('eventType') || undefined;
  const search = url.searchParams.get('search') || undefined;
  const limit = parseInt(url.searchParams.get('limit') || '50', 10);
  const offset = parseInt(url.searchParams.get('offset') || '0', 10);

  const { events, total } = getSecurityEvents({
    severity,
    eventType,
    search,
    limit,
    offset,
  });

  return NextResponse.json({
    success: true,
    events,
    total,
    limit,
    offset,
  });
}

// POST /api/admin/security/events - Trigger a test security event to test alerts/monitor
export async function POST(request: NextRequest) {
  const admin = await verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const eventType = (body.eventType || 'HMAC_MISMATCH') as SecurityEventType;
    const severity = (body.severity || 'HIGH') as SecuritySeverity;
    const detail = body.detail || 'Manual security test verification event initiated by admin.';
    const ipAddress = body.ipAddress || '127.0.0.1';
    const clientType = body.clientType || 'system';
    const path = body.path || '/admin/security';
    const method = body.method || 'POST';

    const recorded = recordSecurityEvent({
      eventType,
      severity,
      clientType,
      ipAddress,
      path,
      method,
      detail,
      metadata: { triggeredBy: admin.email, ...body.metadata },
    });

    return NextResponse.json({
      success: true,
      event: recorded,
      message: 'Test security incident recorded successfully.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Invalid payload.' }, { status: 400 });
  }
}
