import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { saveArticle, syncScheduledPosts, PostInput } from '@/lib/blog-service';
import { BlogPostStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await syncScheduledPosts();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.trim() || '';
    const status = searchParams.get('status')?.trim().toUpperCase() || 'ALL';
    const category = searchParams.get('category')?.trim() || 'ALL';
    const author = searchParams.get('author')?.trim() || 'ALL';
    const sortBy = searchParams.get('sortBy') || 'dateDesc';
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '15')));
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status !== 'ALL' && Object.values(BlogPostStatus).includes(status as BlogPostStatus)) {
      where.status = status as BlogPostStatus;
    }

    if (category !== 'ALL') {
      where.OR = [
        { categoryName: { equals: category, mode: 'insensitive' } },
        { category: { slug: { equals: category, mode: 'insensitive' } } },
      ];
    }

    if (author !== 'ALL') {
      where.authorName = { contains: author, mode: 'insensitive' };
    }

    if (search) {
      where.AND = [
        {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { slug: { contains: search, mode: 'insensitive' } },
            { summary: { contains: search, mode: 'insensitive' } },
          ],
        },
      ];
    }

    // Sort order
    let orderBy: any = { publishedAt: 'desc' };
    if (sortBy === 'dateAsc') {
      orderBy = { publishedAt: 'asc' };
    } else if (sortBy === 'viewsDesc') {
      orderBy = { views: 'desc' };
    } else if (sortBy === 'titleAsc') {
      orderBy = { title: 'asc' };
    } else if (sortBy === 'updatedDesc') {
      orderBy = { updatedAt: 'desc' };
    }

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          author: true,
          category: true,
          tags: {
            include: { tag: true },
          },
        },
      }),
      prisma.blogPost.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      posts,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error('Failed to list blog posts:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: PostInput = await request.json();

    if (!body.title || !body.title.trim()) {
      return NextResponse.json({ success: false, error: 'Article title is required' }, { status: 400 });
    }

    const post = await saveArticle(body, 'Tapfolio Admin');

    // On-demand revalidation of public blog routes
    try {
      revalidatePath('/blog');
      revalidatePath(`/blog/${post.slug}`);
      revalidatePath('/sitemap.xml');
    } catch (e) {
      // Ignore in dev
    }

    return NextResponse.json({
      success: true,
      post,
      message:
        post.status === BlogPostStatus.PUBLISHED
          ? 'Article published successfully and live on website!'
          : 'Article saved successfully!',
    });
  } catch (error: any) {
    console.error('Failed to save article:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to save article' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '');

    if (!id || isNaN(id)) {
      return NextResponse.json({ success: false, error: 'Valid post ID is required' }, { status: 400 });
    }

    const post = await prisma.blogPost.delete({
      where: { id },
    });

    try {
      revalidatePath('/blog');
      revalidatePath(`/blog/${post.slug}`);
    } catch (e) {
      // Ignore
    }

    return NextResponse.json({
      success: true,
      message: 'Article deleted successfully',
    });
  } catch (error: any) {
    console.error('Failed to delete post:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete post' },
      { status: 500 }
    );
  }
}
