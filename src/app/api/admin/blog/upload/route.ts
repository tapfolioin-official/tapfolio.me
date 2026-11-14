import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
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

    // Validate mime type
    const mimeType = file.type || 'image/jpeg';
    if (!mimeType.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'Uploaded file must be an image (PNG, JPG, WebP, GIF, SVG)' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const fileSize = buffer.length;

    // Check size limit: 10MB
    if (fileSize > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'Image size exceeds maximum limit of 10MB' },
        { status: 400 }
      );
    }

    // Generate safe filename
    const originalName = file.name || 'cover-image.jpg';
    const ext = path.extname(originalName) || '.jpg';
    const baseName = path.basename(originalName, ext);
    const safeName = `${slugify(baseName) || 'cover'}-${Date.now()}${ext.toLowerCase()}`;

    // Target upload folder in public
    const uploadsDir = path.join(process.cwd(), 'public', 'assets', 'blog', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });
    const filePath = path.join(uploadsDir, safeName);
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/assets/blog/uploads/${safeName}`;

    // Cloudinary upload if configured
    let finalUrl = publicUrl;
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || 'tapfolio';

    if (cloudName) {
      try {
        const base64Data = buffer.toString('base64');
        const dataUrl = `data:${mimeType};base64,${base64Data}`;
        const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
        const cForm = new FormData();
        cForm.append('file', dataUrl);
        cForm.append('upload_preset', uploadPreset);

        const cRes = await fetch(cloudinaryUrl, { method: 'POST', body: cForm });
        if (cRes.ok) {
          const cData = await cRes.json();
          if (cData.secure_url) {
            finalUrl = cData.secure_url;
          }
        }
      } catch (cErr) {
        console.warn('[BLOG UPLOAD] Cloudinary upload failed, fallback to local:', cErr);
      }
    }

    // Record in database
    try {
      await prisma.blogMedia.create({
        data: {
          filename: safeName,
          url: finalUrl,
          mimeType,
          fileSize,
          altText: altText || baseName,
          title: baseName,
          uploadedBy: 'Tapfolio Admin',
        },
      });
    } catch (dbErr) {
      console.warn('[BLOG UPLOAD] Failed to insert into blogMedia:', dbErr);
    }

    return NextResponse.json({
      success: true,
      url: finalUrl,
      filename: safeName,
      size: fileSize,
      mimeType,
    });
  } catch (error: any) {
    console.error('[BLOG UPLOAD] Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to upload photo' },
      { status: 500 }
    );
  }
}
