import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return new NextResponse('Image ID required', { status: 400 });
    }

    // Clean id (in case filename or extension was appended)
    const cleanId = id.split('/')[0].split('.')[0].trim();

    // Query image from Neon PostgreSQL
    // Accept either direct UUID or filename lookup
    const image = await prisma.blogImage.findFirst({
      where: {
        OR: [
          { id: cleanId },
          { id },
          { filename: id },
        ],
      },
      select: {
        id: true,
        data: true,
        mimeType: true,
        fileSize: true,
        filename: true,
        updatedAt: true,
      },
    });

    if (!image || !image.data) {
      return new NextResponse('Image not found', { status: 404 });
    }

    // Generate ETag based on ID and updatedAt timestamp
    const etag = `W/"${image.id}-${image.updatedAt.getTime()}"`;
    const clientEtag = request.headers.get('if-none-match');

    if (clientEtag === etag) {
      return new NextResponse(null, {
        status: 304,
        headers: {
          'ETag': etag,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    // Binary image buffer from PostgreSQL BYTEA
    const buffer = Buffer.isBuffer(image.data) ? image.data : Buffer.from(image.data);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': image.mimeType || 'image/jpeg',
        'Content-Length': String(image.fileSize || buffer.length),
        'ETag': etag,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Disposition': `inline; filename="${encodeURIComponent(image.filename)}"`,
      },
    });
  } catch (error: any) {
    console.error('[API BLOG IMAGE ERROR]:', error);
    return new NextResponse('Error retrieving image', { status: 500 });
  }
}
