import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    if (!token) {
      return NextResponse.json({ error: 'Card token is required.' }, { status: 400 });
    }

    const cleanToken = token.trim();

    // Look up card by publicToken or by id
    const card = await prisma.card.findFirst({
      where: {
        OR: [{ publicToken: cleanToken }, { id: cleanToken }],
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            connectionCount: true,
            profile: {
              include: {
                tags: true,
                socials: true,
                projects: {
                  where: { isPublic: true },
                  orderBy: { displayOrder: 'asc' },
                },
              },
            },
          },
        },
      },
    });

    if (!card || !card.user || !card.user.profile) {
      return NextResponse.json({ error: 'Card not found.' }, { status: 404 });
    }

    // Atomically increment scan count for this card
    try {
      await prisma.card.update({
        where: { id: card.id },
        data: { scans: { increment: 1 }, views: { increment: 1 } },
      });
    } catch (_) {}

    const profile = card.user.profile;

    return NextResponse.json({
      success: true,
      card: {
        id: card.id,
        publicToken: card.publicToken,
        name: card.name,
        title: card.title,
        designation: card.designation,
        tagline: card.tagline,
        bio: card.bio,
        avatar: card.avatar || profile.avatar,
        themeColor: card.themeColor,
        skills: card.skills,
        collectLeads: card.collectLeads,
        isDefault: card.isDefault,
        isActive: card.isActive,
        views: card.views + 1,
        scans: card.scans + 1,
      },
      profile: {
        id: profile.id,
        userId: profile.userId,
        name: card.name || profile.name,
        username: profile.username,
        tagline: card.designation || profile.tagline,
        avatar: card.avatar || profile.avatar,
        bio: card.bio || profile.bio,
        phone: profile.phone,
        whatsapp: profile.whatsapp,
        location: profile.location,
        isOnline: profile.isOnline,
        diamonds: profile.diamonds,
        isPremium: profile.isPremium,
        tapCount: profile.tapCount,
        email: card.user.email,
        tags: card.skills.length > 0
          ? card.skills.map((s, idx) => ({ id: idx + 1, text: s, type: 'role' }))
          : profile.tags,
        socials: profile.socials,
        projects: profile.projects,
      },
    });
  } catch (error: any) {
    console.error('[API/CARDS/PUBLIC] error:', error);
    return NextResponse.json({ error: 'Failed to resolve public card.' }, { status: 500 });
  }
}
