import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifyJWT } from '@/lib/auth';

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

// GET /api/admin/broadcast — List broadcast messages
export async function GET(request: NextRequest) {
  const admin = await verifyAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const messages = await prisma.broadcastMessage.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return NextResponse.json({ messages });
}

// POST /api/admin/broadcast — Create broadcast
export async function POST(request: NextRequest) {
  const admin = await verifyAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const { title, body, target, channel } = await request.json();
  if (!title || !body) {
    return NextResponse.json({ error: 'Missing title or body' }, { status: 400 });
  }

  const message = await prisma.broadcastMessage.create({
    data: {
      title,
      body,
      target: target || 'EVERYONE',
      channel: channel || 'IN_APP',
    },
  });

  await prisma.auditLog.create({
    data: {
      action: 'CREATE_BROADCAST',
      module: 'BROADCAST',
      targetId: String(message.id),
      targetType: 'BROADCAST',
      after: JSON.parse(JSON.stringify({ title, target, channel })),
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    },
  });

  return NextResponse.json({ message });
}
