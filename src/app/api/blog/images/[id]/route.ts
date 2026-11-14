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

    let image: any = null;

    // 1. Try Prisma Client ORM query if blogImage model is present
    if ((prisma as any).blogImage?.findFirst) {
      try {
        image = await (prisma as any).blogImage.findFirst({
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
      } catch (prismaErr) {
        console.warn('[API BLOG IMAGE] Prisma findFirst skipped, falling back to raw query:', prismaErr);
      }
    }

    // 2. Resilient raw SQL fallback (protects against stale PrismaClient instances in active dev processes)
    if (!image) {
      try {
        const rows = await prisma.$queryRawUnsafe<any[]>(
          `SELECT id, data, mime_type AS "mimeType", file_size AS "fileSize", filename, updated_at AS "updatedAt"
           FROM blog_images
           WHERE id::text = $1 OR id::text = $2 OR filename = $1
           LIMIT 1`,
          id,
          cleanId
        );
        if (rows && rows.length > 0) {
          image = rows[0];
        }
      } catch (rawErr) {
        console.error('[API BLOG IMAGE RAW SQL ERROR]:', rawErr);
      }
    }

    if (!image || !image.data) {
      return new NextResponse('Image not found', { status: 404 });
    }

    // Generate ETag based on ID and updatedAt timestamp
    const updatedAtTime =
      image.updatedAt instanceof Date
        ? image.updatedAt.getTime()
        : new Date(image.updatedAt || Date.now()).getTime();

    const etag = `W/"${image.id}-${updatedAtTime}"`;
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
