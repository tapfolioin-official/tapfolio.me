import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
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

    // Ensure user has at least 1 card (auto-backfill if needed)
    const { cards, activeCard } = await ensureUserHasActiveCard(payload.userId);
    const defaultCard = cards.find((c) => c.isDefault) || activeCard;

    return NextResponse.json({
      success: true,
      cards,
      activeCard,
      activeCardId: activeCard?.id || null,
      defaultCard,
    });
  } catch (error: any) {
    console.error('[API/CARDS] GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch cards.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
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

    const body = await request.json();
    const title = (body.title || 'New Card').trim();
    const designation = (body.designation || 'Professional').trim();
    const tagline = (body.tagline || designation).trim();
    const bio = (body.bio || '').trim();
    const skills = Array.isArray(body.skills) ? body.skills : [];
    const themeColor = body.themeColor || '0xFF0052FF';
    const collectLeads = Boolean(body.collectLeads);
    const avatar = body.avatar || null;

    // Check user card count
    const existingCount = await prisma.card.count({
      where: { userId: payload.userId },
    });

    const isFirstCard = existingCount === 0;

    // Get user profile name for card name
    const profile = await prisma.profile.findUnique({
      where: { userId: payload.userId },
      select: { name: true, avatar: true },
    });

    const cardName = (body.name || profile?.name || 'My Card').trim();
    const cardAvatar = avatar || profile?.avatar || '/profile_avatar.png';

    const card = await prisma.card.create({
      data: {
        userId: payload.userId,
        name: cardName,
        title,
        designation,
        tagline,
        bio,
        avatar: cardAvatar,
        skills,
        themeColor,
        collectLeads,
        isDefault: isFirstCard,
        isActive: isFirstCard, // First card becomes active, subsequent cards remain inactive
      },
    });

    return NextResponse.json({
      success: true,
      card,
    });
  } catch (error: any) {
    console.error('[API/CARDS] POST error:', error);
    return NextResponse.json({ error: 'Failed to create card.' }, { status: 500 });
  }
}
