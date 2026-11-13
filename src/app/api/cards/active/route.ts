import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';
import { ensureUserHasActiveCard } from '@/lib/cards';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    let token = cookieStore.get('pertap_jwt')?.value;
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
    if (!token) {
      token = request.headers.get('x-pertap-token') || undefined;
    }

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token.' }, { status: 401 });
    }

    const { activeCard } = await ensureUserHasActiveCard(payload.userId);

    return NextResponse.json({
      success: true,
      activeCard,
      activeCardId: activeCard?.id || null,
    });
  } catch (error: any) {
    console.error('[API/CARDS/ACTIVE] GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch active card.' }, { status: 500 });
  }
}
