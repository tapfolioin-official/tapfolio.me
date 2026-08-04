import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { verifyJWT } from '@/lib/auth';

// GET /api/notifications — fetch all notifications for the current user
export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('pertap_jwt')?.value;
    if (!token) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

    const payload = await verifyJWT(token);
    if (!payload) return NextResponse.json({ error: 'Invalid token.' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const onlyUnread = searchParams.get('unread') === 'true';

    const notifications = await prisma.notification.findMany({
      where: {
        receiverId: payload.userId,
        ...(onlyUnread ? { isRead: false } : {}),
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            profile: {
              select: {
                avatar: true,
                username: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    // Extract connectionIds from connection_request notifications to verify current status
    const connIds = notifications
      .filter((n) => n.type === 'connection_request' && n.data && typeof (n.data as any).connectionId === 'number')
      .map((n) => (n.data as any).connectionId as number);

    const connections = connIds.length > 0
      ? await prisma.connection.findMany({
          where: { id: { in: connIds } },
          select: { id: true, status: true },
        })
      : [];

    const connStatusMap = new Map(connections.map((c) => [c.id, c.status]));

    const formatted = notifications.map((n) => {
      let dataObj = (n.data as Record<string, any>) || {};
      if (n.type === 'connection_request' && dataObj.connectionId) {
        const liveStatus = connStatusMap.get(dataObj.connectionId);
        if (liveStatus) {
          dataObj = { ...dataObj, status: liveStatus };
        }
      }

      return {
        id: n.id,
        type: n.type,
        title: n.title,
        message: n.message,
        data: dataObj,
        isRead: n.isRead,
        createdAt: n.createdAt,
        sender: n.sender
          ? {
              id: n.sender.id,
              name: n.sender.name,
              avatar: n.sender.profile?.avatar ?? '/profile_avatar.png',
              username: n.sender.profile?.username ?? '',
            }
          : null,
      };
    });

    return NextResponse.json({ success: true, notifications: formatted });
  } catch (error) {
    console.error('[NOTIFICATIONS] GET error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
