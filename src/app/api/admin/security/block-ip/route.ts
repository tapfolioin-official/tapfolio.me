import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';
import { getBlockedIps, blockIp, unblockIp } from '@/lib/security-monitor';

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

// GET /api/admin/security/block-ip - List all blocked IPs
export async function GET(request: NextRequest) {
  const admin = await verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
  }

  const blocked = getBlockedIps();
  return NextResponse.json({
    success: true,
    blockedIps: blocked,
    count: blocked.length,
  });
}

// POST /api/admin/security/block-ip - Block an IP address
export async function POST(request: NextRequest) {
  const admin = await verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { ip, reason, durationHours } = body;

    if (!ip || typeof ip !== 'string') {
      return NextResponse.json({ error: 'IP address is required.' }, { status: 400 });
    }

    const cleanIp = ip.split(',')[0].trim();
    if (cleanIp === '127.0.0.1' || cleanIp === '::1' || cleanIp === 'localhost') {
      return NextResponse.json({ error: 'Cannot block localhost / loopback address.' }, { status: 400 });
    }

    const entry = blockIp(
      cleanIp,
      reason || 'Blocked by administrator via Security Console.',
      admin.email,
      durationHours ? parseInt(durationHours, 10) : undefined
    );

    return NextResponse.json({
      success: true,
      message: `IP ${cleanIp} has been blocked successfully.`,
      entry,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to block IP.' }, { status: 500 });
  }
}

// DELETE /api/admin/security/block-ip - Unblock an IP address
export async function DELETE(request: NextRequest) {
  const admin = await verifyAdmin(request);
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized: Admin access required.' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { ip } = body;

    if (!ip || typeof ip !== 'string') {
      return NextResponse.json({ error: 'IP address is required.' }, { status: 400 });
    }

    const removed = unblockIp(ip);
    if (!removed) {
      return NextResponse.json({ error: `IP ${ip} was not found in active block list.` }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `IP ${ip} unblocked successfully.`,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to unblock IP.' }, { status: 500 });
  }
}
