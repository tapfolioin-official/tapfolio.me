import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';
import { setActiveCardAtomic } from '@/lib/cards';

export const dynamic = 'force-dynamic';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // Atomically activate target card and deactivate all others
    const activatedCard = await setActiveCardAtomic(payload.userId, id);

    return NextResponse.json({
      success: true,
      activeCard: activatedCard,
      activeCardId: activatedCard.id,
    });
  } catch (error: any) {
    console.error('[API/CARDS/ACTIVATE] error:', error);
    if (error?.message === 'CARD_NOT_FOUND_OR_FORBIDDEN') {
      return NextResponse.json({ error: 'Card not found or access denied.' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Failed to activate card.' }, { status: 500 });
  }
}
