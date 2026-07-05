import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { verifyJWT } from '@/lib/auth';

export async function GET() {
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

    const activeTheme = await prisma.profileTheme.findFirst({
      where: { userId, isDefault: true }
    });

    if (!activeTheme) {
      return NextResponse.json({ error: 'Theme not found.' }, { status: 404 });
    }

    const exportPayload = {
      themeName: activeTheme.themeName,
      settings: activeTheme.settings
    };

    const fileName = `${activeTheme.themeName.toLowerCase().replace(/[^a-z0-9_-]/g, '_')}_theme.json`;

    return new NextResponse(JSON.stringify(exportPayload, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${fileName}"`
      }
    });
  } catch (error: any) {
    console.error('Export theme error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
