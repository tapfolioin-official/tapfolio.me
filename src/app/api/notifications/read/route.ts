import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { verifyJWT } from '@/lib/auth';

// POST /api/notifications/read  { id: number }
// POST /api/notifications/read  { all: true }
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('pertap_jwt')?.value;
    if (!token) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

    const payload = await verifyJWT(token);
    if (!payload) return NextResponse.json({ error: 'Invalid token.' }, { status: 401 });

    let body: any = {};
    try { body = await request.json(); } catch {}

    if (body.all === true) {
      // Mark all notifications as read
      await prisma.notification.updateMany({
        where: { receiverId: payload.userId, isRead: false },
        data: { isRead: true },
      });
      return NextResponse.json({ success: true, message: 'All notifications marked as read.' });
    }

    if (!body.id) {
      return NextResponse.json({ error: 'id or all:true required.' }, { status: 400 });
    }

    // Mark single notification as read — only if it belongs to this user
    const updated = await prisma.notification.updateMany({
      where: { id: body.id, receiverId: payload.userId },
      data: { isRead: true },
    });

    if (updated.count === 0) {
      return NextResponse.json({ error: 'Notification not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[NOTIFICATIONS] read error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
