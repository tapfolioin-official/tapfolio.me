import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import path from 'path';
import prisma from '@/lib/db';
import { slugify } from '@/lib/blog-utils';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.trim() || '';
    const limit = parseInt(searchParams.get('limit') || '500', 10);

    const where: any = {};
    if (search) {
      where.OR = [
        { filename: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
        { altText: { contains: search, mode: 'insensitive' } },
      ];
    }

    let images: any[] = [];

    if ((prisma as any).blogImage?.findMany) {
      try {
        images = await (prisma as any).blogImage.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          take: limit,
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
      } catch (err) {
        console.warn('[MEDIA LIST] Prisma findMany skipped, fallback to raw SQL:', err);
      }
    }

    if (images.length === 0) {
      try {
        if (search) {
          images = await prisma.$queryRawUnsafe<any[]>(
            `SELECT id, filename, mime_type AS "mimeType", file_size AS "fileSize", width, height, alt_text AS "altText", title, uploaded_by AS "uploadedBy", created_at AS "createdAt", updated_at AS "updatedAt"
             FROM blog_images
             WHERE filename ILIKE $1 OR alt_text ILIKE $1 OR title ILIKE $1
             ORDER BY created_at DESC
             LIMIT $2`,
            `%${search}%`,
            limit
          );
        } else {
          images = await prisma.$queryRawUnsafe<any[]>(
            `SELECT id, filename, mime_type AS "mimeType", file_size AS "fileSize", width, height, alt_text AS "altText", title, uploaded_by AS "uploadedBy", created_at AS "createdAt", updated_at AS "updatedAt"
             FROM blog_images
             ORDER BY created_at DESC
             LIMIT $1`,
            limit
          );
        }
      } catch (rawErr) {
        console.error('[MEDIA LIST RAW SQL ERROR]:', rawErr);
      }
    }

    const media = (images || []).map((img) => ({
      ...img,
      url: `/api/blog/images/${img.id}`,
    }));

    return NextResponse.json({
      success: true,
      media,
      total: media.length,
    });
  } catch (error: any) {
    console.error('Failed to query blog media library:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || '';

    // Handle multipart file upload (delegated to upload handler logic)
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file') as File | null;
      const altText = (formData.get('altText') as string) || '';

      if (!file) {
        return NextResponse.json({ success: false, error: 'No image file provided' }, { status: 400 });
      }

      const mimeType = file.type || 'image/jpeg';
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const fileSize = buffer.length;

      if (fileSize > 10 * 1024 * 1024) {
        return NextResponse.json({ success: false, error: 'File size exceeds 10MB limit' }, { status: 400 });
      }

      const originalName = file.name || 'image.jpg';
      const ext = path.extname(originalName) || '.jpg';
      const baseName = path.basename(originalName, ext);
      const safeFilename = `${slugify(baseName) || 'image'}-${Date.now()}${ext.toLowerCase()}`;

      let imageId = '';
      if ((prisma as any).blogImage?.create) {
        try {
          const created = await (prisma as any).blogImage.create({
            data: {
              filename: safeFilename,
              mimeType,
              fileSize,
              altText: altText || baseName,
              title: baseName,
              data: buffer,
              uploadedBy: 'Tapfolio Admin',
            },
            select: { id: true },
          });
          imageId = created.id;
        } catch (e) {
          console.warn('[MEDIA POST] Prisma create error, falling back to raw SQL:', e);
        }
      }

      if (!imageId) {
        const uuid = crypto.randomUUID();
        await prisma.$executeRawUnsafe(
          `INSERT INTO blog_images (id, filename, mime_type, file_size, alt_text, title, data, uploaded_by, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())`,
          uuid,
          safeFilename,
          mimeType,
          fileSize,
          altText || baseName,
          baseName,
          buffer,
          'Tapfolio Admin'
        );
        imageId = uuid;
      }

      return NextResponse.json({
        success: true,
        id: imageId,
        url: `/api/blog/images/${imageId}`,
        filename: safeFilename,
        size: fileSize,
        mimeType,
        altText: altText || baseName,
      });
    }

    // Handle JSON payload (e.g. metadata update or URL registration)
    const body = await request.json();
    const { id, filename, url, altText, title } = body;

    // If ID provided or URL matches /api/blog/images/[id], update existing record
    const targetId = id || (url?.startsWith('/api/blog/images/') ? url.replace('/api/blog/images/', '') : null);

    if (targetId) {
      if ((prisma as any).blogImage?.update) {
        try {
          await (prisma as any).blogImage.update({
            where: { id: targetId },
            data: {
              ...(altText !== undefined && { altText }),
              ...(title !== undefined && { title }),
              ...(filename !== undefined && { filename }),
            },
          });
          return NextResponse.json({ success: true, id: targetId });
        } catch (e) {
          console.warn('[MEDIA POST] Prisma update error, fallback raw SQL:', e);
        }
      }

      await prisma.$executeRawUnsafe(
        `UPDATE blog_images SET alt_text = COALESCE($1, alt_text), title = COALESCE($2, title), filename = COALESCE($3, filename), updated_at = NOW() WHERE id::text = $4`,
        altText ?? null,
        title ?? null,
        filename ?? null,
        targetId
      );

      return NextResponse.json({ success: true, id: targetId });
    }

    return NextResponse.json({
      success: true,
      message: 'Asset recorded',
      asset: { filename, url, altText },
    });
  } catch (error: any) {
    console.error('Failed in POST /api/admin/blog/media:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, altText, title, filename } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Media ID required' }, { status: 400 });
    }

    if ((prisma as any).blogImage?.update) {
      try {
        await (prisma as any).blogImage.update({
          where: { id },
          data: {
            ...(altText !== undefined && { altText }),
            ...(title !== undefined && { title }),
            ...(filename !== undefined && { filename }),
          },
        });
        return NextResponse.json({ success: true });
      } catch (e) {
        console.warn('[MEDIA PATCH] Prisma update error, fallback raw SQL:', e);
      }
    }

    await prisma.$executeRawUnsafe(
      `UPDATE blog_images SET alt_text = COALESCE($1, alt_text), title = COALESCE($2, title), filename = COALESCE($3, filename), updated_at = NOW() WHERE id::text = $4`,
      altText ?? null,
      title ?? null,
      filename ?? null,
      id
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Failed in PATCH /api/admin/blog/media:', error);
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

    if ((prisma as any).blogImage?.delete) {
      try {
        await (prisma as any).blogImage.delete({
          where: { id },
        });
        return NextResponse.json({ success: true, message: 'Media asset deleted successfully from database' });
      } catch (e) {
        console.warn('[MEDIA DELETE] Prisma delete error, fallback raw SQL:', e);
      }
    }

    await prisma.$executeRawUnsafe(`DELETE FROM blog_images WHERE id::text = $1`, id);

    return NextResponse.json({ success: true, message: 'Media asset deleted successfully from database' });
  } catch (error: any) {
    console.error('Failed to delete media asset:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
