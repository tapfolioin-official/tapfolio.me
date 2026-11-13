import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    if (!username) {
      return NextResponse.json({ error: 'Username is required.' }, { status: 400 });
    }

    const urlObj = new URL(request.url);
    const cardParam = urlObj.searchParams.get('card')?.trim();

    const slug = username.toLowerCase().trim();
    const profile = await prisma.profile.findUnique({
      where: { username: slug },
      include: {
        tags: true,
        socials: true,
        projects: {
          orderBy: { displayOrder: 'asc' }
        },
        user: {
          select: {
            id: true,
            connectionCount: true,
            email: true,
            cards: {
              orderBy: [{ isActive: 'desc' }, { isDefault: 'desc' }, { updatedAt: 'desc' }],
            },
            profileThemes: {
              orderBy: [{ isDefault: 'desc' }, { updatedAt: 'desc' }],
              take: 1
            }
          },
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found.' }, { status: 404 });
    }

    // Resolve specific card if requested by ?card=TOKEN
    let requestedCard = null;
    if (cardParam && profile.user?.cards) {
      requestedCard = profile.user.cards.find(
        (c) => c.publicToken === cardParam || c.id === cardParam
      );
      if (requestedCard) {
        try {
          await prisma.card.update({
            where: { id: requestedCard.id },
            data: { scans: { increment: 1 }, views: { increment: 1 } },
          });
        } catch (_) {}
      }
    }

    const activeCard = requestedCard || profile.user?.cards?.find((c) => c.isActive) || profile.user?.cards?.[0] || null;

    // Check connection status if caller is authenticated
    let connectionStatus: string | null = null;
    let connectionId: number | null = null;

    try {
      const { cookies } = await import('next/headers');
      const { verifyJWT } = await import('@/lib/auth');
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

      if (token) {
        const payload = await verifyJWT(token);
        if (payload && payload.userId !== profile.userId) {
          const conn = await prisma.connection.findFirst({
            where: {
              OR: [
                { requesterId: payload.userId, receiverId: profile.userId },
                { requesterId: profile.userId, receiverId: payload.userId },
              ],
            },
          });
          if (conn) {
            connectionStatus = conn.status;
            connectionId = conn.id;
          }
        }
      }
    } catch (_) {}

    const displayName = requestedCard?.name || profile.name;
    const displayTagline = requestedCard?.designation || profile.tagline;
    const displayBio = requestedCard?.bio || profile.bio;
    const displayAvatar = requestedCard?.avatar || profile.avatar;
    const displayTags = (requestedCard && requestedCard.skills && requestedCard.skills.length > 0)
      ? requestedCard.skills.map((s: string, i: number) => ({ id: i + 1, text: s, type: 'role' }))
      : profile.tags;

    return NextResponse.json(
      {
        success: true,
        connectionStatus,
        connectionId,
        card: activeCard ? {
          id: activeCard.id,
          publicToken: activeCard.publicToken,
          name: activeCard.name,
          title: activeCard.title,
          designation: activeCard.designation,
          tagline: activeCard.tagline,
          bio: activeCard.bio,
          avatar: activeCard.avatar,
          skills: activeCard.skills,
          themeColor: activeCard.themeColor,
          collectLeads: activeCard.collectLeads,
          isDefault: activeCard.isDefault,
          isActive: activeCard.isActive,
          views: activeCard.views,
          scans: activeCard.scans,
        } : null,
        profile: {
          id: profile.id,
          userId: profile.userId,
          name: displayName,
          username: profile.username,
          tagline: displayTagline,
          avatar: displayAvatar,
          bio: displayBio,
          phone: profile.phone,
          whatsapp: profile.whatsapp,
          location: profile.location,
          isOnline: profile.isOnline,
          diamonds: profile.diamonds,
          isPremium: profile.isPremium,
          tapCount: profile.tapCount,
          email: profile.user?.email,
          connectionCount: profile.user?.connectionCount ?? 0,
          tags: displayTags,
          socials: profile.socials,
          portfolioUrl: profile.portfolioUrl,
          resumeUrl: profile.resumeUrl,
          projects: profile.projects,
          theme: profile.user?.profileThemes?.[0]?.settings || null,
        },
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
      }
    );
  } catch (error: any) {
    console.error('API Profile Lookup Error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
