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

  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status');

    const where = status ? { status: status as any } : {};

    const [tickets, openCount, pendingCount, resolvedCount, closedCount] = await Promise.all([
      prisma.supportTicket.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),
      prisma.supportTicket.count({ where: { status: 'OPEN' } }),
      prisma.supportTicket.count({ where: { status: 'PENDING' } }),
      prisma.supportTicket.count({ where: { status: 'RESOLVED' } }),
      prisma.supportTicket.count({ where: { status: 'CLOSED' } }),
    ]);

    const counts = {
      open: openCount,
      pending: pendingCount,
      resolved: resolvedCount,
      closed: closedCount,
    };

    return NextResponse.json({ tickets, counts });
  } catch (error) {
    console.error('Failed to fetch support tickets:', error);
    return NextResponse.json(
      { tickets: [], counts: { open: 0, pending: 0, resolved: 0, closed: 0 }, error: 'Database temporarily unavailable' },
      { status: 500 }
    );
  }
}

// POST /api/admin/support — Update ticket status
export async function POST(request: NextRequest) {
  const admin = await verifyAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  try {
    const { ticketId, status } = await request.json();
    if (!ticketId || !status) {
      return NextResponse.json({ error: 'ticketId and status are required' }, { status: 400 });
    }

    const ticket = await prisma.supportTicket.update({
      where: { id: parseInt(ticketId) },
      data: { status },
    });

    return NextResponse.json({ success: true, ticket });
  } catch (error) {
    console.error('Failed to update ticket:', error);
    return NextResponse.json({ error: 'Failed to update ticket' }, { status: 500 });
  }
}
