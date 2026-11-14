import prisma from '../src/lib/db';
import { saveArticle, deleteArticle, getPublicBlogPosts, getPostBySlug } from '../src/lib/blog-service';
import { resolveBlogImageUrl } from '../src/lib/blog-utils';
import { BlogPostStatus } from '@prisma/client';

async function runTests() {
  console.log('🧪 Starting Tapfolio Database-Driven Blog Architecture Verification...\n');

  // Test 1: Verify PostgreSQL BlogImage count & sample binary retrieval
  console.log('1️⃣ Verifying Neon PostgreSQL BlogImage binary storage...');
  const totalImages = await prisma.blogImage.count();
  console.log(`   - Total images in Neon DB: ${totalImages}`);
  if (totalImages === 0) {
    throw new Error('No images found in blog_images table!');
  }

  const sampleImage = await prisma.blogImage.findFirst({
    select: { id: true, filename: true, mimeType: true, fileSize: true, data: true, createdAt: true },
  });
  if (!sampleImage || !sampleImage.data) {
    throw new Error('Sample image data could not be retrieved from PostgreSQL BYTEA!');
  }
  const bufferLen = Buffer.from(sampleImage.data).length;
  console.log(`   - Sample image retrieved: "${sampleImage.filename}" (${sampleImage.mimeType}, ${bufferLen} bytes in BYTEA)`);
  console.log(`   - Resolved public image URL: ${resolveBlogImageUrl(sampleImage.id)}`);
  console.log('   ✅ Test 1 PASSED: PostgreSQL binary image storage verified.\n');

  // Test 2: Upload new test image into Neon PostgreSQL BYTEA
  console.log('2️⃣ Testing Direct Image Upload to Neon PostgreSQL (no filesystem dependency)...');
  const testBuffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
  const testImage = await prisma.blogImage.create({
    data: {
      filename: `test-pixel-${Date.now()}.png`,
      mimeType: 'image/png',
      fileSize: testBuffer.length,
      data: testBuffer,
      title: 'Automated Architecture Verification Pixel',
      altText: 'Verification Pixel Alt',
      uploadedBy: 'Automated Test Suite',
    },
  });
  console.log(`   - Created BlogImage ID: ${testImage.id}`);
  console.log(`   - Resolved endpoint: ${resolveBlogImageUrl(testImage.id)}`);
  console.log('   ✅ Test 2 PASSED: Direct database binary upload verified.\n');

  // Test 3: Create new article in Neon PostgreSQL with database image reference
  console.log('3️⃣ Testing Article Creation & Persistence in Neon PostgreSQL...');
  const testSlug = `automated-arch-test-${Date.now()}`;
  const createdPost = await saveArticle({
    title: 'Automated Database-Driven Architecture Verification',
    slug: testSlug,
    summary: 'Verifying end-to-end database-first storage architecture in Neon PostgreSQL.',
    content: 'This article was generated and persisted directly in Neon PostgreSQL without filesystem dependencies.',
    featuredImage: `/api/blog/images/${testImage.id}`,
    featuredImageId: testImage.id,
    imageAlt: 'Verification Cover Graphic',
    status: BlogPostStatus.PUBLISHED,
    categoryName: 'Technology',
    authorName: 'Mohammed Nibrasul Haqq',
    tags: ['nfc', 'database', 'neon', 'architecture'],
    seoTitle: 'Database-First Architecture Verification | Tapfolio',
    metaDescription: 'Complete end-to-end audit and test of the database-driven CMS architecture.',
    focusKeyword: 'database architecture',
  }, 'Verification Test Runner');

  console.log(`   - Created article ID: ${createdPost.id}, Slug: ${createdPost.slug}`);
  console.log(`   - Featured image ID foreign key: ${createdPost.featuredImageId}`);
  console.log(`   - Featured image URL: ${createdPost.featuredImage}`);

  // Verify tags in blog_post_tags
  const tagsCount = await prisma.blogPostTag.count({ where: { postId: createdPost.id } });
  console.log(`   - Associated tags in blog_post_tags: ${tagsCount}`);
  if (tagsCount !== 4) {
    throw new Error(`Expected 4 tags, found ${tagsCount}`);
  }

  // Verify revision created
  const revisionsCount = await prisma.blogRevision.count({ where: { postId: createdPost.id } });
  console.log(`   - Logged revisions in blog_revisions: ${revisionsCount}`);
  if (revisionsCount < 1) {
    throw new Error('No revision record found for created post');
  }
  console.log('   ✅ Test 3 PASSED: Article creation & relational integrity verified.\n');

  // Test 4: Dynamic Public Article Retrieval & Scheduled Isolation
  console.log('4️⃣ Testing Public Blog Retrieval & Scheduled Post Isolation...');
  const publicListing = await getPublicBlogPosts({ limit: 10 });
  console.log(`   - Public posts retrieved: ${publicListing.posts.length} (Total published: ${publicListing.total})`);
  const foundInFeed = publicListing.posts.some((p) => p.slug === testSlug);
  if (!foundInFeed) {
    throw new Error('Published article not found in public blog feed!');
  }

  // Verify scheduled future post is isolated from public
  const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const futurePost = await saveArticle({
    title: 'Future Scheduled Test Article',
    slug: `future-test-${Date.now()}`,
    summary: 'This future scheduled post must NEVER appear to public visitors before publication time.',
    content: 'Hidden content until scheduled release.',
    status: BlogPostStatus.SCHEDULED,
    scheduledAt: futureDate,
  });

  const publicFutureCheck = await getPostBySlug(futurePost.slug, { allowDraft: false });
  if (publicFutureCheck.post !== null) {
    throw new Error('SECURITY LEAK: Future scheduled post was accessible to public visitors!');
  }
  console.log('   - Scheduled future post verified: NOT accessible publicly (status: hidden/draft)');

  // Clean up future test post
  await deleteArticle(futurePost.id);
  console.log('   ✅ Test 4 PASSED: Public feed retrieval & scheduling isolation verified.\n');

  // Test 5: Article Update & Cover Image Replacement
  console.log('5️⃣ Testing Article Update & Image Replacement in Neon DB...');
  const updatedPost = await saveArticle({
    id: createdPost.id,
    title: 'Automated Database-Driven Architecture Verification (Updated)',
    summary: 'Updated summary after content revision.',
    content: 'Updated content body persisted into Neon PostgreSQL.',
    status: BlogPostStatus.PUBLISHED,
    featuredImageId: sampleImage.id,
    featuredImage: `/api/blog/images/${sampleImage.id}`,
    categoryName: 'RFID & Tech',
    authorName: 'Abhinand K.S.',
    tags: ['nfc', 'rfid', 'updated'],
  });

  if (updatedPost.title !== 'Automated Database-Driven Architecture Verification (Updated)' || updatedPost.featuredImageId !== sampleImage.id) {
    throw new Error('Article update failed to persist changed values!');
  }
  console.log('   - Article updated successfully with new cover image ID and tags.');
  console.log('   ✅ Test 5 PASSED: Article update verified.\n');

  // Test 6: Transactional Safe Deletion
  console.log('6️⃣ Testing Safe Transactional Article Deletion...');
  const deleted = await deleteArticle(createdPost.id);
  if (!deleted) {
    throw new Error('Failed to delete test article');
  }

  const postCheck = await prisma.blogPost.findUnique({ where: { id: createdPost.id } });
  const tagCheck = await prisma.blogPostTag.count({ where: { postId: createdPost.id } });
  const revCheck = await prisma.blogRevision.count({ where: { postId: createdPost.id } });

  if (postCheck !== null || tagCheck !== 0 || revCheck !== 0) {
    throw new Error('Deletion failed to cascade cleanly across related tables!');
  }

  // Delete test image
  await prisma.blogImage.delete({ where: { id: testImage.id } });
  console.log('   - Cleaned up test article, cascaded tags, revisions, and test media record.');
  console.log('   ✅ Test 6 PASSED: Transactional article deletion verified.\n');

  console.log('🎉 ALL 6 ARCHITECTURAL VERIFICATION TESTS PASSED SUCCESSFULLY!');
}

runTests()
  .catch((e) => {
    console.error('❌ Verification test failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
