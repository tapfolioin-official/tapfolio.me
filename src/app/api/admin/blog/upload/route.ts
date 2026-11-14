import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import crypto from 'crypto';
import prisma from '@/lib/db';
import { slugify } from '@/lib/blog-utils';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const altText = (formData.get('altText') as string) || '';

    if (!file) {
      return NextResponse.json({ success: false, error: 'No image file provided' }, { status: 400 });
    }

    // 1. Validate MIME type
    const mimeType = file.type || 'image/jpeg';
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    if (!allowedMimes.includes(mimeType) && !mimeType.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'Uploaded file must be a valid image (PNG, JPG, WebP, GIF, SVG)' },
        { status: 400 }
      );
    }

    // 2. Validate File Size (10MB limit)
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileSize = buffer.length;

    if (fileSize > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'Image size exceeds maximum limit of 10MB' },
        { status: 400 }
      );
    }

    // 3. Generate clean, collision-resistant filename
    const originalName = file.name || 'cover-image.jpg';
    const ext = path.extname(originalName) || '.jpg';
    const baseName = path.basename(originalName, ext);
    const safeFilename = `${slugify(baseName) || 'image'}-${Date.now()}${ext.toLowerCase()}`;

    // 4. Save directly into Neon PostgreSQL BYTEA binary storage
    let imageId: string = '';

    if ((prisma as any).blogImage?.create) {
      try {
        const image = await (prisma as any).blogImage.create({
          data: {
            filename: safeFilename,
            mimeType,
            fileSize,
            altText: altText || baseName,
            title: baseName,
            data: buffer,
            uploadedBy: 'Tapfolio Admin',
          },
          select: {
            id: true,
          },
        });
        imageId = image.id;
      } catch (prismaErr) {
        console.warn('[BLOG UPLOAD] Prisma create failed, falling back to raw SQL:', prismaErr);
      }
    }

    // Fallback if dev server cached stale Prisma Client prototype
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

    const publicUrl = `/api/blog/images/${imageId}`;

    return NextResponse.json({
      success: true,
      id: imageId,
      url: publicUrl,
      filename: safeFilename,
      size: fileSize,
      mimeType,
      altText: altText || baseName,
    });
  } catch (error: any) {
    console.error('[BLOG UPLOAD TO POSTGRESQL ERROR]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to upload photo into database' },
      { status: 500 }
    );
  }
}
