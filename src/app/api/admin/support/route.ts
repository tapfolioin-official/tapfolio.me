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

// GET /api/admin/support — List support tickets
export async function GET(request: NextRequest) {
  const admin = await verifyAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const url = new URL(request.url);
  const status = url.searchParams.get('status');

  const where = status ? { status: status as any } : {};

  const tickets = await prisma.supportTicket.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  const counts = {
    open: await prisma.supportTicket.count({ where: { status: 'OPEN' } }),
    pending: await prisma.supportTicket.count({ where: { status: 'PENDING' } }),
    resolved: await prisma.supportTicket.count({ where: { status: 'RESOLVED' } }),
    closed: await prisma.supportTicket.count({ where: { status: 'CLOSED' } }),
  };

  return NextResponse.json({ tickets, counts });
}

// POST /api/admin/support — Update ticket status
export async function POST(request: NextRequest) {
  const admin = await verifyAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const { ticketId, status } = await request.json();
  if (!ticketId || !status) {
    return NextResponse.json({ error: 'Missing ticketId or status' }, { status: 400 });
  }

  const ticket = await prisma.supportTicket.update({
    where: { id: ticketId },
    data: { status },
  });

  await prisma.auditLog.create({
    data: {
      action: `TICKET_${status}`,
      module: 'SUPPORT',
      targetId: String(ticketId),
      targetType: 'TICKET',
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    },
  });

  return NextResponse.json({ ticket });
}
