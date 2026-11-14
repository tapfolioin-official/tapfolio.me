import { BlogPostStatus } from '@prisma/client';
import prisma from '../src/lib/db';
import { BLOG_POSTS } from '../src/lib/content/blog-posts';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function main() {
  console.log(`Starting migration of ${BLOG_POSTS.length} blog posts into database...`);

  let createdCount = 0;
  let updatedCount = 0;

  for (const post of BLOG_POSTS) {
    const slug = slugify(post.slug || post.title);
    const categoryName = post.category || 'General';
    const catSlug = slugify(categoryName);
    const authorName = post.author || 'Tapfolio Team';
    const authorSlug = slugify(authorName);

    // Upsert Category
    const category = await prisma.blogCategory.upsert({
      where: { slug: catSlug },
      update: { name: categoryName },
      create: { name: categoryName, slug: catSlug },
    });

    // Upsert Author
    const author = await prisma.blogAuthor.upsert({
      where: { slug: authorSlug },
      update: { name: authorName },
      create: {
        name: authorName,
        slug: authorSlug,
        designation: 'Tapfolio Editorial Lead',
        bio: 'Official contributor to Tapfolio Insights on NFC cards, smart networking, and CRM.',
      },
    });

    // Upsert Post
    const existing = await prisma.blogPost.findUnique({
      where: { slug },
    });

    const publishedDate = post.date ? new Date(post.date) : new Date('2024-01-01');

    if (existing) {
      await prisma.blogPost.update({
        where: { slug },
        data: {
          title: post.title,
          summary: post.summary || '',
          content: post.content || '',
          featuredImage: post.image || null,
          imageAlt: post.title,
          status: BlogPostStatus.PUBLISHED,
          publishedAt: publishedDate,
          readingTime: post.readTime || '5 min read',
          categoryId: category.id,
          categoryName: category.name,
          authorId: author.id,
          authorName: author.name,
          seoTitle: post.title,
          metaDescription: post.summary || '',
          canonicalUrl: `https://tapfolio.me/blog/${slug}`,
          ogTitle: post.title,
          ogDescription: post.summary || '',
          ogImage: post.image || null,
          metaRobots: 'index, follow',
        },
      });
      updatedCount++;
    } else {
      await prisma.blogPost.create({
        data: {
          title: post.title,
          slug,
          summary: post.summary || '',
          content: post.content || '',
          featuredImage: post.image || null,
          imageAlt: post.title,
          status: BlogPostStatus.PUBLISHED,
          publishedAt: publishedDate,
          readingTime: post.readTime || '5 min read',
          categoryId: category.id,
          categoryName: category.name,
          authorId: author.id,
          authorName: author.name,
          seoTitle: post.title,
          metaDescription: post.summary || '',
          canonicalUrl: `https://tapfolio.me/blog/${slug}`,
          ogTitle: post.title,
          ogDescription: post.summary || '',
          ogImage: post.image || null,
          metaRobots: 'index, follow',
        },
      });
      createdCount++;
    }
  }

  console.log(`\nMigration completed:`);
  console.log(`- Created: ${createdCount}`);
  console.log(`- Updated: ${updatedCount}`);
  console.log(`- Total: ${createdCount + updatedCount}`);
}

main()
  .catch((e) => {
    console.error('Migration failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
