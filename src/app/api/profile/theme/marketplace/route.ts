import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { verifyJWT } from '@/lib/auth';

async function getAuthenticatedUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get('pertap_jwt')?.value;
  if (!token) return null;

  const payload = await verifyJWT(token);
  return payload ? payload.userId : null;
}

// GET /api/profile/theme/marketplace
// Lists all themes in the marketplace (trending and newest).
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get('filter') || 'trending'; // trending | newest

    const themes = await prisma.profileTheme.findMany({
      where: { isMarketplace: true },
      orderBy: filter === 'newest' ? { createdAt: 'desc' } : { likesCount: 'desc' },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json({ success: true, themes });
  } catch (error: any) {
    console.error('Marketplace GET error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

// POST /api/profile/theme/marketplace
// Handles publish, like, and install operations.
export async function POST(request: Request) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
    }

    const { action, themeId, themeName, settings } = await request.json();

    if (action === 'publish') {
      if (!themeName || !settings) {
        return NextResponse.json({ error: 'Theme name and settings are required to publish.' }, { status: 400 });
      }

      const publishedTheme = await prisma.profileTheme.create({
        data: {
          userId,
          themeName,
          isDefault: false,
          isMarketplace: true,
          settings
        }
      });

      return NextResponse.json({ success: true, theme: publishedTheme });
    }

    if (action === 'like') {
      if (!themeId) {
        return NextResponse.json({ error: 'Theme ID is required.' }, { status: 400 });
      }

      const updated = await prisma.profileTheme.update({
        where: { id: themeId, isMarketplace: true },
        data: {
          likesCount: { increment: 1 }
        }
      });

      return NextResponse.json({ success: true, likesCount: updated.likesCount });
    }

    if (action === 'install') {
      if (!themeId) {
        return NextResponse.json({ error: 'Theme ID is required.' }, { status: 400 });
      }

      const templateTheme = await prisma.profileTheme.findUnique({
        where: { id: themeId }
      });

      if (!templateTheme) {
        return NextResponse.json({ error: 'Source theme not found.' }, { status: 404 });
      }

      // Copy settings to user's active theme
      let activeTheme = await prisma.profileTheme.findFirst({
        where: { userId, isDefault: true }
      });

      if (activeTheme) {
        activeTheme = await prisma.profileTheme.update({
          where: { id: activeTheme.id },
          data: {
            settings: templateTheme.settings as any
          }
        });
      } else {
        activeTheme = await prisma.profileTheme.create({
          data: {
            userId,
            themeName: templateTheme.themeName,
            isDefault: true,
            settings: templateTheme.settings as any
          }
        });
      }

      return NextResponse.json({ success: true, theme: activeTheme });
    }

    return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
  } catch (error: any) {
    console.error('Marketplace POST error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

// DELETE /api/profile/theme/marketplace?themeId=xxx
// Removes a marketplace theme — only the owner can delete.
export async function DELETE(request: Request) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const themeIdRaw = searchParams.get('themeId');
    const themeId = themeIdRaw ? parseInt(themeIdRaw, 10) : null;

    if (!themeId || isNaN(themeId)) {
      return NextResponse.json({ error: 'Valid themeId is required.' }, { status: 400 });
    }

    // Verify the theme belongs to the requesting user
    const theme = await prisma.profileTheme.findUnique({
      where: { id: themeId }
    });

    if (!theme) {
      return NextResponse.json({ error: 'Theme not found.' }, { status: 404 });
    }

    if (theme.userId !== userId) {
      return NextResponse.json({ error: 'You can only delete your own published themes.' }, { status: 403 });
    }

    await prisma.profileTheme.delete({ where: { id: themeId } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Marketplace DELETE error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
