import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { BlogPostStatus } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { action, ids }: { action: string; ids: number[] } = await request.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ success: false, error: 'No article IDs provided' }, { status: 400 });
    }

    if (action === 'PUBLISH') {
      await prisma.blogPost.updateMany({
        where: { id: { in: ids } },
        data: {
          status: BlogPostStatus.PUBLISHED,
          publishedAt: new Date(),
        },
      });
    } else if (action === 'UNPUBLISH') {
      await prisma.blogPost.updateMany({
        where: { id: { in: ids } },
        data: {
          status: BlogPostStatus.DRAFT,
        },
      });
    } else if (action === 'ARCHIVE') {
      await prisma.blogPost.updateMany({
        where: { id: { in: ids } },
        data: {
          status: BlogPostStatus.ARCHIVED,
        },
      });
    } else if (action === 'DELETE') {
      await prisma.blogPost.deleteMany({
        where: { id: { in: ids } },
      });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
    }

    try {
      revalidatePath('/blog');
    } catch (e) {
      // Ignore
    }

    return NextResponse.json({
      success: true,
      message: `Bulk ${action.toLowerCase()} applied to ${ids.length} articles.`,
    });
  } catch (error: any) {
    console.error('Bulk action failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Bulk operation failed' },
      { status: 500 }
    );
  }
}
