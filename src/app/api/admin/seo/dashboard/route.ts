import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';
import { getSeoDashboardData, getGoogleIntegrationsStatus } from '@/lib/seo-service';

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
    const [seoData, integrations] = await Promise.all([
      getSeoDashboardData(),
      getGoogleIntegrationsStatus(),
    ]);

    return NextResponse.json({ success: true, seoData, integrations });
  } catch (error) {
    console.error('Failed to get SEO data:', error);
    return NextResponse.json({ error: 'Failed to fetch SEO data' }, { status: 500 });
  }
}
