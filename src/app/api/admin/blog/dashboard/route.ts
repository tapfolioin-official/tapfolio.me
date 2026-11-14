import { NextResponse } from 'next/server';
import { getBlogDashboardMetrics } from '@/lib/blog-service';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const metrics = await getBlogDashboardMetrics();
    return NextResponse.json({
      success: true,
      metrics,
    });
  } catch (error: any) {
    console.error('Failed to fetch blog dashboard metrics:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to load metrics' },
      { status: 500 }
    );
  }
}
