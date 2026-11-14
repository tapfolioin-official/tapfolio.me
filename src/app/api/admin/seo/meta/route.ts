import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';
import { getSeoMeta, updateSeoMeta } from '@/lib/seo-service';

async function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get('pertap_jwt')?.value;
  if (!token) return null;
  const payload = await verifyJWT(token);
  if (!payload) return null;
  const isAdminEmail =
    payload.email === 'nibrasulhaqqamini@gmail.com' ||
    payload.email === 'tapfolio.in@gmail.com' ||
    (process.env.ADMIN_EMAIL && payload.email === process.env.ADMIN_EMAIL);
  if (!isAdminEmail) return null;
  return payload;
}

export async function GET(request: NextRequest) {
  const admin = await verifyAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  try {
    const url = new URL(request.url);
    const path = url.searchParams.get('path') || '/';

    const meta = await getSeoMeta(path);
    return NextResponse.json({ success: true, meta });
  } catch (error) {
    console.error('Failed to get SEO meta:', error);
    return NextResponse.json({ error: 'Failed to fetch meta' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const admin = await verifyAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  try {
    const body = await request.json();
    if (!body.path || !body.title) {
      return NextResponse.json({ error: 'Path and title are required' }, { status: 400 });
    }

    const updated = await updateSeoMeta({
      path: body.path,
      title: body.title,
      description: body.description || '',
      canonicalUrl: body.canonicalUrl || `https://tapfolio.me${body.path}`,
      ogTitle: body.ogTitle || body.title,
      ogDescription: body.ogDescription || body.description || '',
      ogImage: body.ogImage || 'https://tapfolio.me/og-image.png',
      robots: body.robots || 'index, follow',
      isIndexed: body.isIndexed ?? true,
      keywords: body.keywords || [],
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, meta: updated });
  } catch (error) {
    console.error('Failed to update SEO meta:', error);
    return NextResponse.json({ error: 'Failed to update meta' }, { status: 500 });
  }
}
