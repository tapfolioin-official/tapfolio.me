import prisma from '@/lib/db';
import { BlogPostStatus } from '@prisma/client';

export interface PostInput {
  id?: number;
  title: string;
  slug?: string;
  summary: string;
  content: string;
  featuredImage?: string | null;
  imageAlt?: string | null;
  status: BlogPostStatus;
  publishedAt?: Date | string | null;
  scheduledAt?: Date | string | null;
  categoryName?: string | null;
  authorName?: string | null;
  authorEmail?: string | null;
  tags?: string[];
  // SEO
  seoTitle?: string | null;
  metaDescription?: string | null;
  focusKeyword?: string | null;
  secondaryKeywords?: string[];
  canonicalUrl?: string | null;
  ogTitle?: string | null;
  ogDescription?: string | null;
  ogImage?: string | null;
  metaRobots?: string | null;
}

/**
 * Normalizes title into an SEO-friendly URL slug.
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Calculates estimated reading time in minutes based on 200 words per minute.
 */
export function calculateReadingTime(content: string): string {
  if (!content) return '1 min read';
  const clean = content.replace(/<[^>]*>/g, ' ');
  const words = clean.trim().split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

/**
 * Counts words in a string.
 */
export function countWords(content: string): number {
  if (!content) return 0;
  const clean = content.replace(/<[^>]*>/g, ' ');
  return clean.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Automatically publishes scheduled posts whose publication time has arrived.
 */
export async function syncScheduledPosts(): Promise<number> {
  try {
    const now = new Date();
    const result = await prisma.blogPost.updateMany({
      where: {
        status: BlogPostStatus.SCHEDULED,
        scheduledAt: { lte: now },
      },
      data: {
        status: BlogPostStatus.PUBLISHED,
        publishedAt: now,
      },
    });
    return result.count;
  } catch (err) {
    console.error('Error syncing scheduled blog posts:', err);
    return 0;
  }
}

/**
 * Fetches published blog posts for the public website.
 */
export async function getPublicBlogPosts(options?: {
  search?: string;
  category?: string;
  tag?: string;
  page?: number;
  limit?: number;
  featuredOnly?: boolean;
}) {
  await syncScheduledPosts();

  const page = Math.max(1, options?.page || 1);
  const limit = Math.max(1, Math.min(100, options?.limit || 12));
  const skip = (page - 1) * limit;

  const where: any = {
    status: BlogPostStatus.PUBLISHED,
  };

  if (options?.category && options.category !== 'All') {
    where.OR = [
      { categoryName: { equals: options.category, mode: 'insensitive' } },
      { category: { slug: { equals: slugify(options.category), mode: 'insensitive' } } },
    ];
  }

  if (options?.search && options.search.trim()) {
    const q = options.search.trim();
    where.AND = [
      {
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { summary: { contains: q, mode: 'insensitive' } },
          { content: { contains: q, mode: 'insensitive' } },
        ],
      },
    ];
  }

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      skip,
      take: limit,
      include: {
        author: true,
        category: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    }),
    prisma.blogPost.count({ where }),
  ]);

  return {
    posts,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    hasMore: skip + posts.length < total,
  };
}

/**
 * Fetches a single published or preview article by slug.
 */
export async function getPostBySlug(slug: string, options?: { allowDraft?: boolean }) {
  await syncScheduledPosts();

  const cleanSlug = slug.trim();

  // Check direct post match
  const post = await prisma.blogPost.findUnique({
    where: { slug: cleanSlug },
    include: {
      author: true,
      category: true,
      tags: {
        include: {
          tag: true,
        },
      },
    },
  });

  if (post) {
    if (!options?.allowDraft && post.status !== BlogPostStatus.PUBLISHED) {
      return { post: null, redirectTarget: null, isDraft: true };
    }
    return { post, redirectTarget: null, isDraft: false };
  }

  // Check 301 redirects if slug was previously renamed
  const redirect = await prisma.blogRedirect.findUnique({
    where: { sourceSlug: cleanSlug },
  });

  if (redirect) {
    return { post: null, redirectTarget: redirect.targetSlug, isDraft: false };
  }

  return { post: null, redirectTarget: null, isDraft: false };
}

/**
 * Increments view count safely.
 */
export async function incrementArticleViews(slug: string): Promise<void> {
  try {
    await prisma.blogPost.update({
      where: { slug },
      data: { views: { increment: 1 } },
    });
  } catch (err) {
    // Non-blocking telemetry
    console.error(`Failed to increment views for ${slug}:`, err);
  }
}

/**
 * Fetches all blog categories with article counts.
 */
export async function getBlogCategories() {
  const categories = await prisma.blogCategory.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: {
          posts: {
            where: { status: BlogPostStatus.PUBLISHED },
          },
        },
      },
    },
  });

  return categories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    description: cat.description,
    postCount: cat._count.posts,
  }));
}

/**
 * Fetches analytics and overview metrics for the Admin Blog Dashboard.
 */
export async function getBlogDashboardMetrics() {
  await syncScheduledPosts();

  const [
    totalArticles,
    publishedCount,
    draftCount,
    scheduledCount,
    pendingReviewCount,
    viewsAggregation,
    recentlyPublished,
    mostViewed,
    categories,
  ] = await Promise.all([
    prisma.blogPost.count(),
    prisma.blogPost.count({ where: { status: BlogPostStatus.PUBLISHED } }),
    prisma.blogPost.count({ where: { status: BlogPostStatus.DRAFT } }),
    prisma.blogPost.count({ where: { status: BlogPostStatus.SCHEDULED } }),
    prisma.blogPost.count({ where: { status: BlogPostStatus.PENDING_REVIEW } }),
    prisma.blogPost.aggregate({
      _sum: { views: true },
    }),
    prisma.blogPost.findMany({
      where: { status: BlogPostStatus.PUBLISHED },
      orderBy: { publishedAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        categoryName: true,
        authorName: true,
        publishedAt: true,
        views: true,
      },
    }),
    prisma.blogPost.findMany({
      where: { status: BlogPostStatus.PUBLISHED },
      orderBy: { views: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        slug: true,
        categoryName: true,
        authorName: true,
        publishedAt: true,
        views: true,
      },
    }),
    getBlogCategories(),
  ]);

  return {
    totalArticles,
    publishedCount,
    draftCount,
    scheduledCount,
    pendingReviewCount,
    totalViews: viewsAggregation._sum.views || 0,
    recentlyPublished,
    mostViewed,
    categories,
  };
}

/**
 * Creates or updates an article with SEO, slug resolution, and revision logging.
 */
export async function saveArticle(input: PostInput, editorName: string = 'Admin') {
  let targetSlug = input.slug?.trim() ? slugify(input.slug) : slugify(input.title);
  if (!targetSlug) {
    targetSlug = `article-${Date.now()}`;
  }

  // Calculate reading time
  const readingTime = calculateReadingTime(input.content);

  // Author association
  let authorId = undefined;
  if (input.authorName?.trim()) {
    const authorSlug = slugify(input.authorName);
    const author = await prisma.blogAuthor.upsert({
      where: { slug: authorSlug },
      update: { name: input.authorName },
      create: {
        name: input.authorName,
        slug: authorSlug,
        email: input.authorEmail || null,
        designation: 'Tapfolio Editorial Team',
      },
    });
    authorId = author.id;
  }

  // Category association
  let categoryId = undefined;
  if (input.categoryName?.trim()) {
    const catSlug = slugify(input.categoryName);
    const category = await prisma.blogCategory.upsert({
      where: { slug: catSlug },
      update: { name: input.categoryName },
      create: {
        name: input.categoryName,
        slug: catSlug,
      },
    });
    categoryId = category.id;
  }

  // Handle publishing timestamps
  let publishedAt: Date | null = null;
  let scheduledAt: Date | null = null;

  if (input.status === BlogPostStatus.PUBLISHED) {
    publishedAt = input.publishedAt ? new Date(input.publishedAt) : new Date();
  } else if (input.status === BlogPostStatus.SCHEDULED) {
    scheduledAt = input.scheduledAt ? new Date(input.scheduledAt) : new Date();
  }

  if (input.id) {
    // Check if slug changed -> setup 301 redirect
    const existing = await prisma.blogPost.findUnique({
      where: { id: input.id },
    });

    if (existing && existing.slug !== targetSlug) {
      await prisma.blogRedirect.upsert({
        where: { sourceSlug: existing.slug },
        update: { targetSlug, statusCode: 301 },
        create: {
          sourceSlug: existing.slug,
          targetSlug,
          statusCode: 301,
        },
      });
    }

    // Update article
    const post = await prisma.blogPost.update({
      where: { id: input.id },
      data: {
        title: input.title,
        slug: targetSlug,
        summary: input.summary,
        content: input.content,
        featuredImage: input.featuredImage || null,
        imageAlt: input.imageAlt || null,
        status: input.status,
        publishedAt: publishedAt || (input.status === BlogPostStatus.PUBLISHED ? existing?.publishedAt || new Date() : null),
        scheduledAt,
        readingTime,
        authorId,
        authorName: input.authorName || 'Tapfolio Team',
        categoryId,
        categoryName: input.categoryName || 'General',
        // SEO
        seoTitle: input.seoTitle || input.title,
        metaDescription: input.metaDescription || input.summary,
        focusKeyword: input.focusKeyword || null,
        secondaryKeywords: input.secondaryKeywords || [],
        canonicalUrl: input.canonicalUrl || `https://tapfolio.me/blog/${targetSlug}`,
        ogTitle: input.ogTitle || input.title,
        ogDescription: input.ogDescription || input.summary,
        ogImage: input.ogImage || input.featuredImage || null,
        metaRobots: input.metaRobots || 'index, follow',
      },
    });

    // Save revision snapshot
    await prisma.blogRevision.create({
      data: {
        postId: post.id,
        title: post.title,
        content: post.content,
        summary: post.summary,
        savedBy: editorName,
      },
    });

    return post;
  } else {
    // Create new article
    // Check slug collision
    let finalSlug = targetSlug;
    let counter = 1;
    while (await prisma.blogPost.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${targetSlug}-${counter}`;
      counter++;
    }

    const post = await prisma.blogPost.create({
      data: {
        title: input.title,
        slug: finalSlug,
        summary: input.summary,
        content: input.content,
        featuredImage: input.featuredImage || null,
        imageAlt: input.imageAlt || null,
        status: input.status,
        publishedAt,
        scheduledAt,
        readingTime,
        authorId,
        authorName: input.authorName || 'Tapfolio Team',
        categoryId,
        categoryName: input.categoryName || 'General',
        // SEO
        seoTitle: input.seoTitle || input.title,
        metaDescription: input.metaDescription || input.summary,
        focusKeyword: input.focusKeyword || null,
        secondaryKeywords: input.secondaryKeywords || [],
        canonicalUrl: input.canonicalUrl || `https://tapfolio.me/blog/${finalSlug}`,
        ogTitle: input.ogTitle || input.title,
        ogDescription: input.ogDescription || input.summary,
        ogImage: input.ogImage || input.featuredImage || null,
        metaRobots: input.metaRobots || 'index, follow',
      },
    });

    await prisma.blogRevision.create({
      data: {
        postId: post.id,
        title: post.title,
        content: post.content,
        summary: post.summary,
        savedBy: editorName,
      },
    });

    return post;
  }
}

/**
 * Generates Schema.org JSON-LD for BlogPosting and BreadcrumbList.
 */
export function generateArticleJsonLd(post: any) {
  const pageUrl = `https://tapfolio.me/blog/${post.slug}`;
  const publishIso = post.publishedAt ? new Date(post.publishedAt).toISOString() : new Date().toISOString();
  const updateIso = post.updatedAt ? new Date(post.updatedAt).toISOString() : publishIso;

  const blogPostingSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl,
    },
    headline: post.title,
    description: post.summary || post.metaDescription,
    image: post.featuredImage ? [post.featuredImage.startsWith('http') ? post.featuredImage : `https://tapfolio.me${post.featuredImage}`] : undefined,
    datePublished: publishIso,
    dateModified: updateIso,
    author: {
      '@type': 'Person',
      name: post.authorName || post.author?.name || 'Tapfolio Editorial Team',
      jobTitle: post.author?.designation || 'Content Specialist',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Tapfolio',
      url: 'https://tapfolio.me',
      logo: {
        '@type': 'ImageObject',
        url: 'https://tapfolio.me/tapfolio_logo.png',
      },
    },
    articleSection: post.categoryName || 'Networking',
    keywords: post.focusKeyword ? [post.focusKeyword, ...(post.secondaryKeywords || [])].join(', ') : undefined,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://tapfolio.me',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://tapfolio.me/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: pageUrl,
      },
    ],
  };

  return {
    blogPostingSchema,
    breadcrumbSchema,
  };
}
