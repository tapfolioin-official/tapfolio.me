import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';
import { submitSitemapToIndexNow } from '@/lib/indexnow';

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

export async function POST(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    console.log(`[Admin IndexNow] Triggering full sitemap IndexNow submission by admin: ${admin.email}`);
    const result = await submitSitemapToIndexNow();

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message || 'Sitemap submitted successfully to IndexNow',
        status: result.status,
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.message || result.error || 'Failed to submit sitemap to IndexNow',
        status: result.status,
      }, { status: result.status || 500 });
    }
  } catch (error: any) {
    console.error('[Admin IndexNow] API error:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
