import { NextRequest, NextResponse } from 'next/server';
import { getAppStoreSeo, updateAppStoreSeo } from '@/lib/seo-service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const platform = (searchParams.get('platform') as 'ios' | 'android') || 'ios';
    const data = await getAppStoreSeo(platform);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error fetching App Store SEO:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch App Store SEO' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.platform || !body.appName) {
      return NextResponse.json(
        { success: false, error: 'Platform and appName are required' },
        { status: 400 }
      );
    }
    const updated = await updateAppStoreSeo(body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error saving App Store SEO:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update App Store SEO' },
      { status: 500 }
    );
  }
}
