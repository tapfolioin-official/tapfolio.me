import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.webp':
      return 'image/webp';
    case '.gif':
      return 'image/gif';
    case '.svg':
      return 'image/svg+xml';
    default:
      return 'image/jpeg';
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string[] }> }
) {
  try {
    const { slug } = await context.params;
    const filename = Array.isArray(slug) ? slug.join('/') : String(slug);

    if (!filename) {
      return new NextResponse('Filename missing', { status: 400 });
    }

    const mime = getMimeType(filename);

    // 1. Try reading from local public disk
    try {
      const diskPath = path.join(process.cwd(), 'public', 'assets', 'blog', 'uploads', filename);
      const buffer = await fs.readFile(diskPath);
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': mime,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    } catch {
      // Not on disk, fall through to database lookup
    }

    // 2. Query Neon PostgreSQL database for stored image binary
    const media = await prisma.blogMedia.findFirst({
      where: {
        OR: [
          { filename: filename },
          { url: { contains: filename } },
        ],
      },
    });

    if (media && media.fileData) {
      const imgBuffer = Buffer.from(media.fileData, 'base64');
      return new NextResponse(imgBuffer, {
        headers: {
          'Content-Type': media.mimeType || mime,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    }

    // 3. Fallback: check if any BlogPost has this image as data URL
    const post = await prisma.blogPost.findFirst({
      where: {
        featuredImage: { contains: filename },
      },
      select: { featuredImage: true },
    });

    if (post && post.featuredImage && post.featuredImage.startsWith('data:')) {
      const matches = post.featuredImage.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      if (matches && matches[2]) {
        const imgBuffer = Buffer.from(matches[2], 'base64');
        return new NextResponse(imgBuffer, {
          headers: {
            'Content-Type': matches[1] || mime,
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
      }
    }

    return new NextResponse('Image not found', { status: 404 });
  } catch (error: any) {
    console.error('Error serving uploaded blog image:', error);
    return new NextResponse('Internal server error', { status: 500 });
  }
}
