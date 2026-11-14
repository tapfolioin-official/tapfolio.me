import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.trim() || '';

    const where: any = {};
    if (search) {
      where.OR = [
        { filename: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
        { altText: { contains: search, mode: 'insensitive' } },
      ];
    }

    const images = await prisma.blogImage.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 60,
      select: {
        id: true,
        filename: true,
        mimeType: true,
        fileSize: true,
        width: true,
        height: true,
        altText: true,
        title: true,
        uploadedBy: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const media = images.map((img) => ({
      ...img,
      url: `/api/blog/images/${img.id}`,
    }));

    return NextResponse.json({
      success: true,
      media,
    });
  } catch (error: any) {
    console.error('Failed to query blog media library:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Media ID required' }, { status: 400 });
    }

    await prisma.blogImage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Media asset deleted successfully from database' });
  } catch (error: any) {
    console.error('Failed to delete media asset:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
