import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { verifyJWT } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(
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

    const card = await prisma.card.findFirst({
      where: { id, userId: payload.userId },
    });

    if (!card) {
      return NextResponse.json({ error: 'Card not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, card });
  } catch (error: any) {
    console.error('[API/CARDS/[id]] GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch card.' }, { status: 500 });
  }
}

export async function PATCH(
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

    // Verify ownership
    const existingCard = await prisma.card.findFirst({
      where: { id, userId: payload.userId },
    });

    if (!existingCard) {
      return NextResponse.json({ error: 'Card not found or forbidden.' }, { status: 404 });
    }

    const body = await request.json();
    const dataToUpdate: any = {};

    if (body.title !== undefined) dataToUpdate.title = body.title.trim();
    if (body.name !== undefined) dataToUpdate.name = body.name.trim();
    if (body.designation !== undefined) dataToUpdate.designation = body.designation.trim();
    if (body.tagline !== undefined) dataToUpdate.tagline = body.tagline.trim();
    if (body.bio !== undefined) dataToUpdate.bio = body.bio.trim();
    if (body.skills !== undefined && Array.isArray(body.skills)) dataToUpdate.skills = body.skills;
    if (body.themeColor !== undefined) dataToUpdate.themeColor = body.themeColor;
    if (body.collectLeads !== undefined) dataToUpdate.collectLeads = Boolean(body.collectLeads);
    if (body.avatar !== undefined) dataToUpdate.avatar = body.avatar;

    // Handle isDefault update
    if (body.isDefault === true) {
      await prisma.card.updateMany({
        where: { userId: payload.userId, isDefault: true },
        data: { isDefault: false },
      });
      dataToUpdate.isDefault = true;
    }

    // NEVER mutate publicToken on edit!
    const updatedCard = await prisma.card.update({
      where: { id },
      data: dataToUpdate,
    });

    return NextResponse.json({ success: true, card: updatedCard });
  } catch (error: any) {
    console.error('[API/CARDS/[id]] PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update card.' }, { status: 500 });
  }
}

export async function DELETE(
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

    // Verify ownership
    const targetCard = await prisma.card.findFirst({
      where: { id, userId: payload.userId },
    });

    if (!targetCard) {
      return NextResponse.json({ error: 'Card not found or forbidden.' }, { status: 404 });
    }

    // Check how many cards user has
    const userCards = await prisma.card.findMany({
      where: { userId: payload.userId },
      orderBy: [{ isDefault: 'desc' }, { updatedAt: 'desc' }],
    });

    if (userCards.length <= 1) {
      return NextResponse.json(
        { error: 'You must have at least one card. Create another card before deleting this one.' },
        { status: 400 }
      );
    }

    const wasActive = targetCard.isActive;
    const wasDefault = targetCard.isDefault;

    // Delete card
    await prisma.card.delete({
      where: { id },
    });

    const remainingCards = userCards.filter((c) => c.id !== id);
    let newActiveCard = remainingCards.find((c) => c.isActive) || null;

    // If deleted card was active, promote fallback (default card -> most recently updated)
    if (wasActive) {
      const fallbackTarget = remainingCards.find((c) => c.isDefault) || remainingCards[0];
      newActiveCard = await prisma.card.update({
        where: { id: fallbackTarget.id },
        data: { isActive: true },
      });
    }

    // If deleted card was default, make the new active card default
    if (wasDefault && !remainingCards.some((c) => c.isDefault)) {
      const targetDefault = newActiveCard || remainingCards[0];
      await prisma.card.update({
        where: { id: targetDefault.id },
        data: { isDefault: true },
      });
    }

    return NextResponse.json({
      success: true,
      activeCard: newActiveCard,
      activeCardId: newActiveCard?.id || null,
    });
  } catch (error: any) {
    console.error('[API/CARDS/[id]] DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete card.' }, { status: 500 });
  }
}
