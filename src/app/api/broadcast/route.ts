import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const announcements = await prisma.broadcastMessage.findMany({
      where: {
        channel: 'IN_APP',
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    return NextResponse.json({ success: true, announcements });
  } catch (error) {
    console.error('Failed to load announcements:', error);
    return NextResponse.json({ error: 'Failed to load announcements.' }, { status: 500 });
  }
}
