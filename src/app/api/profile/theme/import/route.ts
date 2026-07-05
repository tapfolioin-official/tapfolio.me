import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { verifyJWT } from '@/lib/auth';
import { sanitizeCustomCss } from '@/lib/theme';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('pertap_jwt')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token.' }, { status: 401 });
    }

    const userId = payload.userId;
    const { settings, themeName } = await request.json();

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ error: 'Invalid settings JSON.' }, { status: 400 });
    }

    // Sanitize imported custom CSS
    if (settings.customCss) {
      settings.customCss = sanitizeCustomCss(settings.customCss);
    }

    let activeTheme = await prisma.profileTheme.findFirst({
      where: { userId, isDefault: true }
    });

    if (activeTheme) {
      activeTheme = await prisma.profileTheme.update({
        where: { id: activeTheme.id },
        data: {
          themeName: themeName || activeTheme.themeName,
          settings: settings
        }
      });
    } else {
      activeTheme = await prisma.profileTheme.create({
        data: {
          userId,
          themeName: themeName || 'Imported Theme',
          isDefault: true,
          settings: settings
        }
      });
    }

    return NextResponse.json({ success: true, theme: activeTheme });
  } catch (error: any) {
    console.error('Import theme error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
