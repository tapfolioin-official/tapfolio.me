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

    let jsonBody: any;
    try {
      jsonBody = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
    }

    const { fcmToken, deviceType } = jsonBody;
    if (!fcmToken) {
      return NextResponse.json({ error: 'fcmToken is required.' }, { status: 400 });
    }

    // Upsert the token for the authenticated user
    await prisma.fcmToken.upsert({
      where: { token: fcmToken },
      update: {
        userId: payload.userId,
        deviceType: deviceType || 'android',
      },
      create: {
        userId: payload.userId,
        token: fcmToken,
        deviceType: deviceType || 'android',
      },
    });

    console.log(`[FCM-TOKEN] Registered token for userId=${payload.userId}`);
    return NextResponse.json({ success: true, message: 'FCM token registered.' });
  } catch (error: any) {
    console.error('[FCM-TOKEN] Error registering token:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
