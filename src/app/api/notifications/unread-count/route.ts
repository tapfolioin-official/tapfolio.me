import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { verifyJWT } from '@/lib/auth';

// GET /api/notifications/unread-count
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('pertap_jwt')?.value;
    if (!token) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

    const payload = await verifyJWT(token);
    if (!payload) return NextResponse.json({ error: 'Invalid token.' }, { status: 401 });

    const count = await prisma.notification.count({
      where: { receiverId: payload.userId, isRead: false },
    });

    return NextResponse.json({ success: true, count });
  } catch (error) {
    console.error('[NOTIFICATIONS] unread-count error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
