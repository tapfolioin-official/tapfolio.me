import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { verifyJWT } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('pertap_jwt')?.value;
    if (!token) return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });

    const payload = await verifyJWT(token);
    if (!payload) return NextResponse.json({ error: 'Invalid token.' }, { status: 401 });

    const { connectionId, targetUserId, targetUsername } = await request.json();
    if (!connectionId && !targetUserId && !targetUsername) {
      return NextResponse.json({ error: 'connectionId, targetUserId, or targetUsername is required.' }, { status: 400 });
    }

    let connection;
    if (connectionId) {
      connection = await prisma.connection.findUnique({ where: { id: connectionId } });
    } else {
      let otherUserId = targetUserId;
      if (!otherUserId && targetUsername) {
        const targetUser = await prisma.user.findFirst({
          where: {
            profile: { username: targetUsername },
          },
          select: { id: true },
        });
        otherUserId = targetUser?.id;
      }

      if (otherUserId) {
        connection = await prisma.connection.findFirst({
          where: {
            OR: [
              { requesterId: payload.userId, receiverId: otherUserId },
              { requesterId: otherUserId, receiverId: payload.userId },
            ],
          },
        });
      }
    }

    if (!connection) {
      return NextResponse.json({ error: 'Connection not found.' }, { status: 404 });
    }

    // Either party (requester or receiver) can remove an accepted connection
    if (connection.requesterId !== payload.userId && connection.receiverId !== payload.userId) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    // Delete the connection record entirely
    await prisma.connection.delete({
      where: { id: connection.id },
    });

    // Clean up related notifications
    try {
      await prisma.notification.deleteMany({
        where: {
          OR: [
            { receiverId: connection.requesterId, data: { path: ['connectionId'], equals: connection.id } },
            { receiverId: connection.receiverId, data: { path: ['connectionId'], equals: connection.id } },
          ],
        },
      });
    } catch (e) {
      console.error('[CONNECTIONS] Error cleaning up notifications on remove:', e);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Connection remove error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
