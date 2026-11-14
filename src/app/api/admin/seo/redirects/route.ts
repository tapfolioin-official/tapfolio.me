import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';
import { getAllRedirects, createRedirect, deleteRedirect } from '@/lib/seo-service';

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
    const redirects = await getAllRedirects();
    return NextResponse.json({ success: true, redirects });
  } catch (error) {
    console.error('Failed to get redirects:', error);
    return NextResponse.json({ error: 'Failed to fetch redirects' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const admin = await verifyAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  try {
    const body = await request.json();
    if (!body.sourcePath || !body.targetPath) {
      return NextResponse.json({ error: 'sourcePath and targetPath are required' }, { status: 400 });
    }

    const redirect = await createRedirect({
      sourcePath: body.sourcePath,
      targetPath: body.targetPath,
      statusCode: Number(body.statusCode) === 302 ? 302 : 301,
      isActive: body.isActive ?? true,
    });

    return NextResponse.json({ success: true, redirect });
  } catch (error) {
    console.error('Failed to create redirect:', error);
    return NextResponse.json({ error: 'Failed to create redirect' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const admin = await verifyAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });

    await deleteRedirect(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete redirect:', error);
    return NextResponse.json({ error: 'Failed to delete redirect' }, { status: 500 });
  }
}
