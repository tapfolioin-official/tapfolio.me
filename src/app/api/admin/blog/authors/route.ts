import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { slugify } from '@/lib/blog-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const authors = await prisma.blogAuthor.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { posts: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      authors: authors.map((a) => ({
        id: a.id,
        name: a.name,
        slug: a.slug,
        email: a.email,
        avatar: a.avatar,
        designation: a.designation,
        bio: a.bio,
        twitter: a.twitter,
        linkedin: a.linkedin,
        website: a.website,
        postCount: a._count.posts,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { id, name, slug, email, avatar, designation, bio, twitter, linkedin, website } =
      await request.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: 'Author name is required' }, { status: 400 });
    }

    const targetSlug = slug?.trim() ? slugify(slug) : slugify(name);

    if (id) {
      const author = await prisma.blogAuthor.update({
        where: { id: parseInt(id) },
        data: {
          name: name.trim(),
          slug: targetSlug,
          email: email?.trim() || null,
          avatar: avatar?.trim() || null,
          designation: designation?.trim() || null,
          bio: bio?.trim() || null,
          twitter: twitter?.trim() || null,
          linkedin: linkedin?.trim() || null,
          website: website?.trim() || null,
        },
      });
      return NextResponse.json({ success: true, author });
    } else {
      const author = await prisma.blogAuthor.create({
        data: {
          name: name.trim(),
          slug: targetSlug,
          email: email?.trim() || null,
          avatar: avatar?.trim() || null,
          designation: designation?.trim() || null,
          bio: bio?.trim() || null,
          twitter: twitter?.trim() || null,
          linkedin: linkedin?.trim() || null,
          website: website?.trim() || null,
        },
      });
      return NextResponse.json({ success: true, author });
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
      return NextResponse.json({ success: false, error: 'Valid author ID required' }, { status: 400 });
    }

    await prisma.blogAuthor.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Author deleted' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
