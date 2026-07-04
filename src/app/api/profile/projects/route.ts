import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { verifyJWT } from '@/lib/auth';

async function getProfileFromSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('pertap_jwt')?.value;
  if (!token) return null;

  const payload = await verifyJWT(token);
  if (!payload) return null;

  return prisma.profile.findUnique({
    where: { userId: payload.userId }
  });
}

export async function GET() {
  try {
    const profile = await getProfileFromSession();
    if (!profile) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const projects = await prisma.project.findMany({
      where: { profileId: profile.id },
      orderBy: { displayOrder: 'asc' }
    });

    return NextResponse.json({ success: true, projects });
  } catch (error: any) {
    console.error('List projects error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const profile = await getProfileFromSession();
    if (!profile) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await request.json();
    const {
      id,
      name,
      slug,
      shortDesc,
      fullDesc,
      category,
      status,
      coverImage,
      logo,
      liveDemo,
      github,
      appStore,
      playStore,
      documentation,
      caseStudy,
      isFeatured,
      isPublic,
      displayOrder,
      pinned,
      showTechnologies,
      showCover,
      showDates,
      startDate,
      endDate,
      techStack,
      gallery
    } = body;

    if (!name || !slug || !shortDesc || !category) {
      return NextResponse.json({ error: 'Name, Slug, Short Description, and Category are required.' }, { status: 400 });
    }

    const cleanedSlug = slug.toLowerCase().trim().replace(/[^a-z0-9_-]/g, '-');

    if (id) {
      const existing = await prisma.project.findFirst({
        where: {
          profileId: profile.id,
          slug: cleanedSlug,
          NOT: { id: parseInt(id) }
        }
      });
      if (existing) {
        return NextResponse.json({ error: 'A project with this slug already exists.' }, { status: 400 });
      }

      const project = await prisma.project.update({
        where: { id: parseInt(id) },
        data: {
          name,
          slug: cleanedSlug,
          shortDesc,
          fullDesc: fullDesc || null,
          category,
          status: status || 'COMPLETED',
          coverImage: coverImage || null,
          logo: logo || null,
          liveDemo: liveDemo || null,
          github: github || null,
          appStore: appStore || null,
          playStore: playStore || null,
          documentation: documentation || null,
          caseStudy: caseStudy || null,
          isFeatured: isFeatured !== undefined ? !!isFeatured : undefined,
          isPublic: isPublic !== undefined ? !!isPublic : undefined,
          displayOrder: displayOrder !== undefined ? parseInt(displayOrder) : undefined,
          pinned: pinned !== undefined ? !!pinned : undefined,
          showTechnologies: showTechnologies !== undefined ? !!showTechnologies : undefined,
          showCover: showCover !== undefined ? !!showCover : undefined,
          showDates: showDates !== undefined ? !!showDates : undefined,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null,
          techStack: techStack || [],
          gallery: gallery || [],
        }
      });
      return NextResponse.json({ success: true, project });
    } else {
      const existing = await prisma.project.findFirst({
        where: { profileId: profile.id, slug: cleanedSlug }
      });
      if (existing) {
        return NextResponse.json({ error: 'A project with this slug already exists.' }, { status: 400 });
      }

      const project = await prisma.project.create({
        data: {
          profileId: profile.id,
          name,
          slug: cleanedSlug,
          shortDesc,
          fullDesc: fullDesc || null,
          category,
          status: status || 'COMPLETED',
          coverImage: coverImage || null,
          logo: logo || null,
          liveDemo: liveDemo || null,
          github: github || null,
          appStore: appStore || null,
          playStore: playStore || null,
          documentation: documentation || null,
          caseStudy: caseStudy || null,
          isFeatured: !!isFeatured,
          isPublic: isPublic !== undefined ? !!isPublic : true,
          displayOrder: displayOrder ? parseInt(displayOrder) : 0,
          pinned: !!pinned,
          showTechnologies: showTechnologies !== undefined ? !!showTechnologies : true,
          showCover: showCover !== undefined ? !!showCover : true,
          showDates: showDates !== undefined ? !!showDates : true,
          startDate: startDate ? new Date(startDate) : null,
          endDate: endDate ? new Date(endDate) : null,
          techStack: techStack || [],
          gallery: gallery || [],
        }
      });
      return NextResponse.json({ success: true, project });
    }
  } catch (error: any) {
    console.error('Save project error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const profile = await getProfileFromSession();
    if (!profile) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required.' }, { status: 400 });
    }

    await prisma.project.delete({
      where: {
        id: parseInt(id),
        profileId: profile.id
      }
    });

    return NextResponse.json({ success: true, message: 'Project deleted successfully.' });
  } catch (error: any) {
    console.error('Delete project error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
