import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { slugify } from '@/lib/blog-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = await prisma.blogCategory.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      categories: categories.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description,
        postCount: c._count.posts,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { id, name, slug, description } = await request.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Category name is required' }, { status: 400 });
    }

    const targetSlug = slug?.trim() ? slugify(slug) : slugify(name);

    if (id) {
      const category = await prisma.blogCategory.update({
        where: { id: parseInt(id) },
        data: {
          name: name.trim(),
          slug: targetSlug,
          description: description?.trim() || null,
        },
      });
      return NextResponse.json({ success: true, category });
    } else {
      const category = await prisma.blogCategory.create({
        data: {
          name: name.trim(),
          slug: targetSlug,
          description: description?.trim() || null,
        },
      });
      return NextResponse.json({ success: true, category });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '');

    if (!id || isNaN(id)) {
      return NextResponse.json({ success: false, error: 'Valid category ID required' }, { status: 400 });
    }

    await prisma.blogCategory.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Category deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
