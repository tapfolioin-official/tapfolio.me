import { BlogPostStatus } from '@prisma/client';
import prisma from '../src/lib/db';
import {
  saveArticle,
  getPostBySlug,
  getPublicBlogPosts,
  syncScheduledPosts,
  incrementArticleViews,
  getBlogDashboardMetrics,
  generateArticleJsonLd,
  slugify,
} from '../src/lib/blog-service';

let passed = 0;
let failed = 0;

function assert(cond: boolean, name: string, extra?: string) {
  if (cond) {
    console.log(`  ✔ PASS: ${name}`);
    passed++;
  } else {
    console.error(`  ✘ FAIL: ${name}${extra ? ` -> ${extra}` : ''}`);
    failed++;
  }
}

async function run() {
  console.log('\n======================================================');
  console.log('TAPFOLIO DYNAMIC BLOG CMS AUTOMATED TEST SUITE');
  console.log('======================================================\n');

  // Test 1: Metrics & Migrated Articles
  console.log('[Test 1] Migrated Database Articles & Dashboard Metrics:');
  const metrics = await getBlogDashboardMetrics();
  assert(metrics.totalArticles >= 202, `Database contains migrated articles (Found: ${metrics.totalArticles})`);
  assert(metrics.publishedCount >= 202, `All initial articles are published (Found: ${metrics.publishedCount})`);
  assert(metrics.categories.length >= 7, `Categories seeded (Found: ${metrics.categories.length})`);

  // Test 2: Create a Draft Article
  console.log('\n[Test 2] Article Creation & Draft Workflow:');
  const testTitle = `Test Automated Blog Article ${Date.now()}`;
  const draftPost = await saveArticle({
    title: testTitle,
    summary: 'A comprehensive guide on dynamic NFC profile setups and CRM integration.',
    content: 'Full article body with detailed steps on using Tapfolio smart business cards.',
    status: BlogPostStatus.DRAFT,
    categoryName: 'RFID & Tech',
    authorName: 'Abhinand K.S.',
    focusKeyword: 'nfc setups',
  });
  assert(draftPost.id > 0, `Draft post created with ID ${draftPost.id}`);
  assert(draftPost.status === BlogPostStatus.DRAFT, 'Post status is DRAFT');
  assert(draftPost.readingTime === '1 min read', 'Reading time computed');

  // Test 3: Public Website Visibility Isolation
  console.log('\n[Test 3] Public Website Isolation (Drafts must NOT be visible publicly):');
  const publicListBefore = await getPublicBlogPosts({ search: testTitle });
  assert(publicListBefore.posts.length === 0, 'Draft article is NOT returned in public blog listing');
  const directFetch = await getPostBySlug(draftPost.slug);
  assert(directFetch.post === null, 'Unpublished draft is NOT accessible via public slug route');

  // Test 4: Publishing Workflow
  console.log('\n[Test 4] Publishing Workflow:');
  const publishedPost = await saveArticle({
    id: draftPost.id,
    title: testTitle,
    summary: 'Updated summary.',
    content: 'Updated content.',
    status: BlogPostStatus.PUBLISHED,
  });
  assert(publishedPost.status === BlogPostStatus.PUBLISHED, 'Article status changed to PUBLISHED');
  assert(publishedPost.publishedAt !== null, 'Published timestamp recorded');

  const publicListAfter = await getPublicBlogPosts({ search: testTitle });
  assert(publicListAfter.posts.length === 1, 'Published article is now visible in public blog listing');

  // Test 5: Dynamic Detail Route & Telemetry
  console.log('\n[Test 5] Detail Route Resolution & View Counter:');
  const publicDetail = await getPostBySlug(draftPost.slug);
  assert(publicDetail.post !== null && publicDetail.post.id === draftPost.id, 'Article successfully fetched by slug');

  await incrementArticleViews(draftPost.slug);
  const updatedViewPost = await prisma.blogPost.findUnique({ where: { id: draftPost.id } });
  assert(updatedViewPost?.views === 1, `View count incremented to ${updatedViewPost?.views}`);

  // Test 6: Slug Change & 301 Redirect Guard
  console.log('\n[Test 6] Slug Renaming & Automatic 301 Redirect Generation:');
  const oldSlug = draftPost.slug;
  const newSlug = `${oldSlug}-v2`;
  await saveArticle({
    id: draftPost.id,
    title: testTitle,
    slug: newSlug,
    summary: 'Slug renamed test.',
    content: 'Content test.',
    status: BlogPostStatus.PUBLISHED,
  });

  const redirectLookup = await getPostBySlug(oldSlug);
  assert(redirectLookup.post === null, 'Old slug no longer returns raw post');
  assert(redirectLookup.redirectTarget === newSlug, `Old slug returns 301 redirect target: ${redirectLookup.redirectTarget}`);

  // Test 7: Scheduled Publication Automation
  console.log('\n[Test 7] Scheduled Publication Engine:');
  const scheduledPost = await saveArticle({
    title: `Scheduled Post ${Date.now()}`,
    summary: 'Future post summary.',
    content: 'Future post content.',
    status: BlogPostStatus.SCHEDULED,
    scheduledAt: new Date(Date.now() - 5000), // Scheduled 5 seconds ago (time arrived)
  });
  assert(scheduledPost.status === BlogPostStatus.SCHEDULED, 'Article created as SCHEDULED');

  const syncedCount = await syncScheduledPosts();
  assert(syncedCount >= 1, `syncScheduledPosts automatically transitioned ${syncedCount} post(s) to PUBLISHED`);

  const verifiedPost = await prisma.blogPost.findUnique({ where: { id: scheduledPost.id } });
  assert(verifiedPost?.status === BlogPostStatus.PUBLISHED, 'Scheduled post successfully promoted to PUBLISHED in DB');

  // Test 8: Schema.org JSON-LD Generation
  console.log('\n[Test 8] Schema.org Structured Data Generation:');
  const schemas = generateArticleJsonLd(publishedPost);
  assert(schemas.blogPostingSchema['@type'] === 'BlogPosting', 'BlogPosting schema generated');
  assert(schemas.blogPostingSchema.headline === testTitle, 'BlogPosting headline matches');
  assert(schemas.breadcrumbSchema['@type'] === 'BreadcrumbList', 'BreadcrumbList schema generated');

  // Cleanup test posts
  console.log('\n[Cleaning up test posts]');
  await prisma.blogPost.deleteMany({
    where: {
      id: { in: [draftPost.id, scheduledPost.id] },
    },
  });
  await prisma.blogRedirect.deleteMany({
    where: { sourceSlug: oldSlug },
  });
  console.log('  ✔ Test posts cleanly removed from production DB.');

  console.log('\n======================================================');
  console.log(`TOTAL CMS TESTS: ${passed + failed} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('======================================================\n');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
