import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { verifyJWT } from '@/lib/auth';
import { DEFAULT_THEME_SETTINGS } from '@/lib/theme';

export async function POST() {
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

    let activeTheme = await prisma.profileTheme.findFirst({
      where: { userId, isDefault: true }
    });

    if (activeTheme) {
      activeTheme = await prisma.profileTheme.update({
        where: { id: activeTheme.id },
        data: {
          settings: DEFAULT_THEME_SETTINGS
        }
      });
    } else {
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
    console.error('Reset theme error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
