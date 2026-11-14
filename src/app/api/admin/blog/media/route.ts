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

    const media = await prisma.blogMedia.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 60,
    });

    return NextResponse.json({
      success: true,
      media,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { filename, url, mimeType, fileSize, width, height, altText, title } = await request.json();

    if (!url || !filename) {
      return NextResponse.json({ success: false, error: 'URL and filename are required' }, { status: 400 });
    }

    const item = await prisma.blogMedia.create({
      data: {
        filename,
        url,
        mimeType: mimeType || 'image/jpeg',
        fileSize: fileSize || 0,
        width: width || null,
        height: height || null,
        altText: altText || null,
        title: title || filename,
        uploadedBy: 'Admin',
      },
    });

    return NextResponse.json({ success: true, item });
  } catch (error: any) {
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

    await prisma.blogMedia.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Media item removed' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
