import fs from 'fs';
import path from 'path';
import prisma from '../src/lib/db';

function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    case '.webp':
      return 'image/webp';
    case '.svg':
      return 'image/svg+xml';
    case '.gif':
      return 'image/gif';
    default:
      return 'application/octet-stream';
  }
}

async function main() {
  console.log('🚀 Starting Blog Images to Neon PostgreSQL Migration...');

  const blogAssetsDir = path.join(process.cwd(), 'public', 'assets', 'blog');
  if (!fs.existsSync(blogAssetsDir)) {
    throw new Error(`Directory ${blogAssetsDir} does not exist!`);
  }

  // 1. Scan public/assets/blog and public/assets/blog/uploads
  const filesToProcess: { filePath: string; filename: string }[] = [];

  function scanDir(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        scanDir(fullPath);
      } else {
        const ext = path.extname(entry.name).toLowerCase();
        if (['.png', '.jpg', '.jpeg', '.webp', '.svg', '.gif'].includes(ext)) {
          filesToProcess.push({ filePath: fullPath, filename: entry.name });
        }
      }
    }
  }

  scanDir(blogAssetsDir);
  console.log(`📸 Discovered ${filesToProcess.length} images on disk.`);

  // Map filename -> BlogImage ID
  const fileToImageId = new Map<string, string>();
  let uploadedCount = 0;
  let skippedCount = 0;

  for (const item of filesToProcess) {
    try {
      const existing = await prisma.blogImage.findFirst({
        where: { filename: item.filename },
        select: { id: true, filename: true },
      });

      if (existing) {
        fileToImageId.set(item.filename, existing.id);
        fileToImageId.set(item.filename.toLowerCase(), existing.id);
        skippedCount++;
        continue;
      }

      const buffer = fs.readFileSync(item.filePath);
      const mimeType = getMimeType(item.filePath);
      const title = path.basename(item.filename, path.extname(item.filename)).replace(/[_-]+/g, ' ');

      const image = await prisma.blogImage.create({
        data: {
          filename: item.filename,
          mimeType,
          fileSize: buffer.length,
          data: buffer,
          title,
          altText: title,
          uploadedBy: 'Migration Architecture Sync',
        },
      });

      fileToImageId.set(item.filename, image.id);
      fileToImageId.set(item.filename.toLowerCase(), image.id);
      uploadedCount++;
      if (uploadedCount % 10 === 0) {
        console.log(`✅ Uploaded ${uploadedCount} images into PostgreSQL binary storage...`);
      }
    } catch (err) {
      console.error(`Failed to migrate image ${item.filename}:`, err);
    }
  }

  console.log(`🎉 Image binary migration complete: ${uploadedCount} newly stored, ${skippedCount} existing.`);
  console.log(`Total mapped images in DB: ${fileToImageId.size / 2}`);

  // Find a default fallback image ID (e.g. tapfolio nfc card)
  let defaultImageId = fileToImageId.get('tapfolio-nfc-business-card-experience-1794696141526.png');
  if (!defaultImageId) {
    const firstImg = await prisma.blogImage.findFirst();
    defaultImageId = firstImg?.id;
  }

  // 2. Update BlogPost records with database Image IDs
  const posts = await prisma.blogPost.findMany({
    select: { id: true, slug: true, title: true, featuredImage: true, featuredImageId: true },
  });

  console.log(`📝 Processing ${posts.length} blog posts in Neon PostgreSQL...`);
  let updatedPosts = 0;
  let matchedDirect = 0;
  let matchedFallback = 0;

  for (const post of posts) {
    let targetImageId: string | undefined = undefined;

    if (post.featuredImage) {
      // Check if it's already an API route with uuid
      const uuidMatch = post.featuredImage.match(/\/api\/blog\/images\/([0-9a-fA-F-]+)/);
      if (uuidMatch && uuidMatch[1]) {
        targetImageId = uuidMatch[1];
      } else {
        const baseName = path.basename(post.featuredImage);
        targetImageId = fileToImageId.get(baseName) || fileToImageId.get(baseName.toLowerCase());
      }
    }

    if (targetImageId) {
      matchedDirect++;
    } else {
      matchedFallback++;
      targetImageId = defaultImageId;
    }

    if (targetImageId) {
      await prisma.blogPost.update({
        where: { id: post.id },
        data: {
          featuredImageId: targetImageId,
          featuredImage: `/api/blog/images/${targetImageId}`,
        },
      });
      updatedPosts++;
    }
  }

  console.log(`✨ Successfully updated ${updatedPosts} blog posts!`);
  console.log(`   - Direct filename matches: ${matchedDirect}`);
  console.log(`   - Fallback assigned to valid DB image: ${matchedFallback}`);

  const totalInDb = await prisma.blogImage.count();
  console.log(`📊 Neon PostgreSQL Blog Images verification: ${totalInDb} total records in blog_images table.`);
}

main()
  .catch((e) => {
    console.error('Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
