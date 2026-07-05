import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { verifyJWT } from '@/lib/auth';
import { DEFAULT_THEME_SETTINGS, sanitizeCustomCss } from '@/lib/theme';

// Helper to authenticate the user and get their ID
async function getAuthenticatedUserId() {
  const cookieStore = await cookies();
  const token = cookieStore.get('pertap_jwt')?.value;
  if (!token) return null;

  const payload = await verifyJWT(token);
  return payload ? payload.userId : null;
}

// GET /api/profile/theme
// Fetches the user's active theme or initializes one if none exists.
export async function GET() {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
    }

    let activeTheme = await prisma.profileTheme.findFirst({
      where: { userId, isDefault: true }
    });

    if (!activeTheme) {
      // Lazy initialize with default theme
      activeTheme = await prisma.profileTheme.create({
        data: {
          userId,
          themeName: 'Default Theme',
          isDefault: true,
          settings: DEFAULT_THEME_SETTINGS
        }
      });
    }

    return NextResponse.json({ success: true, theme: activeTheme });
  } catch (error: any) {
    console.error('GET /api/profile/theme error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

// POST /api/profile/theme
// Creates a new theme.
export async function POST(request: Request) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
    }

    const { themeName, settings, isDefault } = await request.json();

    if (!themeName) {
      return NextResponse.json({ error: 'Theme name is required.' }, { status: 400 });
    }

    const finalSettings = settings || DEFAULT_THEME_SETTINGS;
    if (finalSettings.customCss) {
      finalSettings.customCss = sanitizeCustomCss(finalSettings.customCss);
    }

    // If this theme is set as default, mark other user themes as non-default
    if (isDefault) {
      await prisma.profileTheme.updateMany({
        where: { userId },
        data: { isDefault: false }
      });
    }

    const newTheme = await prisma.profileTheme.create({
      data: {
        userId,
        themeName,
        isDefault: isDefault ?? false,
        settings: finalSettings
      }
    });

    return NextResponse.json({ success: true, theme: newTheme });
  } catch (error: any) {
    console.error('POST /api/profile/theme error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

// PUT /api/profile/theme
// Updates the user's active/specified theme settings.
export async function PUT(request: Request) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
    }

    const { themeId, themeName, settings, isDefault } = await request.json();

    let query: any = { userId };
    if (themeId) {
      query.id = themeId;
    } else {
      query.isDefault = true;
    }

    const existingTheme = await prisma.profileTheme.findFirst({
      where: query
    });

    if (!existingTheme) {
      return NextResponse.json({ error: 'Theme not found.' }, { status: 404 });
    }

    const updatedData: any = {};
    if (themeName) updatedData.themeName = themeName;
    
    if (settings) {
      const mergedSettings = {
        ...(existingTheme.settings as any),
        ...settings
      };
      if (mergedSettings.customCss) {
        mergedSettings.customCss = sanitizeCustomCss(mergedSettings.customCss);
      }
      updatedData.settings = mergedSettings;
    }

    if (isDefault !== undefined) {
      updatedData.isDefault = isDefault;
      if (isDefault) {
        // Set other user themes to not default
        await prisma.profileTheme.updateMany({
          where: { userId, id: { not: existingTheme.id } },
          data: { isDefault: false }
        });
      }
    }

    const updatedTheme = await prisma.profileTheme.update({
      where: { id: existingTheme.id },
      data: updatedData
    });

    return NextResponse.json({ success: true, theme: updatedTheme });
  } catch (error: any) {
    console.error('PUT /api/profile/theme error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

// DELETE /api/profile/theme
// Resets / deletes the specified theme.
export async function DELETE(request: Request) {
  try {
    const userId = await getAuthenticatedUserId();
    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const themeIdParam = searchParams.get('themeId');

    if (!themeIdParam) {
      return NextResponse.json({ error: 'Theme ID is required.' }, { status: 400 });
    }

    const themeId = parseInt(themeIdParam);
    const targetTheme = await prisma.profileTheme.findFirst({
      where: { id: themeId, userId }
    });

    if (!targetTheme) {
      return NextResponse.json({ error: 'Theme not found or access denied.' }, { status: 404 });
    }

    await prisma.profileTheme.delete({
      where: { id: themeId }
    });

    // If we deleted the default theme, set another theme as default
    if (targetTheme.isDefault) {
      const nextTheme = await prisma.profileTheme.findFirst({
        where: { userId }
      });
      if (nextTheme) {
        await prisma.profileTheme.update({
          where: { id: nextTheme.id },
          data: { isDefault: true }
        });
      } else {
        // Re-create standard default theme
        await prisma.profileTheme.create({
          data: {
            userId,
            themeName: 'Default Theme',
            isDefault: true,
            settings: DEFAULT_THEME_SETTINGS
          }
        });
      }
    }

    return NextResponse.json({ success: true, message: 'Theme deleted successfully.' });
  } catch (error: any) {
    console.error('DELETE /api/profile/theme error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
