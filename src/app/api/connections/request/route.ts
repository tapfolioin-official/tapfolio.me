import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { verifyJWT } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';
import { createNotification } from '@/lib/notifications';

export async function POST(request: Request) {
  const requestId = Math.random().toString(36).substring(7);
  console.log(`[CONN-REQ][${requestId}] Connection request received.`);
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('pertap_jwt')?.value;
    if (!token) {
      console.warn(`[CONN-REQ][${requestId}] Request failed: Not authenticated (missing token).`);
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      console.warn(`[CONN-REQ][${requestId}] Request failed: Invalid or expired token.`);
      return NextResponse.json({ error: 'Invalid token.' }, { status: 401 });
    }

    console.log(`[CONN-REQ][${requestId}] Authenticated requester: userId=${payload.userId}, email=${payload.email}`);

    // Rate limit per requester: Max 10 requests per minute
    if (!rateLimit(`req:${payload.userId}`, 10)) {
      console.warn(`[CONN-REQ][${requestId}] Requester rate limit exceeded for userId=${payload.userId}`);
      return NextResponse.json({ error: 'Rate limit exceeded. Please wait a minute before trying again.' }, { status: 429 });
    }

    const { receiverUsername, via = 'nfc' } = await request.json();
    if (!receiverUsername) {
      console.warn(`[CONN-REQ][${requestId}] Missing receiverUsername.`);
      return NextResponse.json({ error: 'receiverUsername is required.' }, { status: 400 });
    }

    // Resolve receiver username → User
    const slug = receiverUsername.toLowerCase().trim();
    console.log(`[CONN-REQ][${requestId}] Resolving target username: ${slug}`);

    const receiverProfile = await prisma.profile.findUnique({
      where: { username: slug },
      include: { user: true },
    });

    if (!receiverProfile || !receiverProfile.user) {
      console.warn(`[CONN-REQ][${requestId}] Target user profile not found or deleted: ${slug}`);
      return NextResponse.json({ error: 'User not found or profile deleted.' }, { status: 404 });
    }

    console.log(`[CONN-REQ][${requestId}] Target resolved: profileId=${receiverProfile.id}, userId=${receiverProfile.userId}`);

    // Rate limit per target user: Max 20 connection requests from any source per minute (anti-spam)
    if (!rateLimit(`target:${receiverProfile.userId}`, 20)) {
      console.warn(`[CONN-REQ][${requestId}] Target user rate limit exceeded for userId=${receiverProfile.userId}`);
      return NextResponse.json({ error: 'This user is receiving too many requests. Please try again later.' }, { status: 429 });
    }

    if (receiverProfile.userId === payload.userId) {
      console.warn(`[CONN-REQ][${requestId}] Prevented self-connection for userId=${payload.userId}`);
      return NextResponse.json({ error: 'You cannot connect with yourself.' }, { status: 400 });
    }

    // Check for existing connection
    const existing = await prisma.connection.findFirst({
      where: {
        OR: [
          { requesterId: payload.userId, receiverId: receiverProfile.userId },
          { requesterId: receiverProfile.userId, receiverId: payload.userId },
        ],
      },
    });

    if (existing) {
      console.log(`[CONN-REQ][${requestId}] Existing connection found: id=${existing.id}, status=${existing.status}`);
      if (existing.status === 'blocked') {
        console.warn(`[CONN-REQ][${requestId}] Request blocked. Connection is in blocked state.`);
        return NextResponse.json({ error: 'This user is unavailable.', status: 'blocked' }, { status: 403 });
      }

      if (existing.status === 'rejected') {
        // Allow re-sending if previously rejected
        console.log(`[CONN-REQ][${requestId}] Connection was previously rejected. Updating status to pending...`);
        const updated = await prisma.connection.update({
          where: { id: existing.id },
          data: { status: 'pending', requesterId: payload.userId, receiverId: receiverProfile.userId, via },
        });
        // Notify receiver of re-sent request
        const requesterProfileForNotif = await prisma.profile.findUnique({ where: { userId: payload.userId } });
        const senderName = requesterProfileForNotif?.name ?? payload.email;
        await createNotification({
          receiverId: receiverProfile.userId,
          senderId: payload.userId,
          type: 'connection_request',
          title: 'New Connection Request',
          message: `${senderName} wants to connect with you.`,
          data: { connectionId: updated.id, username: receiverProfile.username },
        });
        return NextResponse.json({ success: true, connection: updated });
      }

      return NextResponse.json({
        error: `A connection request is already ${existing.status}.`,
        status: existing.status,
      }, { status: 409 });
    }

    console.log(`[CONN-REQ][${requestId}] Creating connection record: requester=${payload.userId} -> receiver=${receiverProfile.userId}`);
    const connection = await prisma.connection.create({
      data: {
        requesterId: payload.userId,
        receiverId: receiverProfile.userId,
        via,
      },
    });

    // Log history event for the requester
    const requesterProfile = await prisma.profile.findUnique({ where: { userId: payload.userId } });
    if (requesterProfile) {
      await prisma.historyEvent.create({
        data: {
          profileId: requesterProfile.id,
          action: 'Connection Request Sent',
          details: `You sent a connection request to ${receiverProfile.name}`,
          icon: '🤝',
          color: '#6366f1',
        },
      });
    }

    console.log(`[CONN-REQ][${requestId}] Connection request successfully created. id=${connection.id}`);

    // Notify the receiver
    const requesterProfile2 = await prisma.profile.findUnique({ where: { userId: payload.userId } });
    const senderDisplayName = requesterProfile2?.name ?? requesterProfile?.name ?? payload.email;
    await createNotification({
      receiverId: receiverProfile.userId,
      senderId: payload.userId,
      type: 'connection_request',
      title: 'New Connection Request',
      message: `${senderDisplayName} wants to connect with you.`,
      data: { connectionId: connection.id, username: receiverProfile.username },
    });

    return NextResponse.json({ success: true, connection });
  } catch (error: any) {
    console.error(`[CONN-REQ][${requestId}] Unexpected error:`, error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
