import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { slugify } from '@/lib/blog-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const redirects = await prisma.blogRedirect.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
    return NextResponse.json({ success: true, redirects });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { sourceSlug, targetSlug, statusCode } = await request.json();

    if (!sourceSlug || !targetSlug) {
      return NextResponse.json({ success: false, error: 'Source and target slugs are required' }, { status: 400 });
    }

    const redirect = await prisma.blogRedirect.upsert({
      where: { sourceSlug: slugify(sourceSlug) },
      update: {
        targetSlug: slugify(targetSlug),
        statusCode: statusCode || 301,
      },
      create: {
        sourceSlug: slugify(sourceSlug),
        targetSlug: slugify(targetSlug),
        statusCode: statusCode || 301,
      },
    });

    return NextResponse.json({ success: true, redirect });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = parseInt(searchParams.get('id') || '');

    if (!id || isNaN(id)) {
      return NextResponse.json({ success: false, error: 'Valid redirect ID required' }, { status: 400 });
    }

    await prisma.blogRedirect.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Redirect rule removed' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
