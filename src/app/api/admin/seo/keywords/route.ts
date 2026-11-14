import { NextRequest, NextResponse } from 'next/server';
import { getAllKeywords, addKeyword } from '@/lib/seo-service';

export async function GET() {
  try {
    const keywords = await getAllKeywords();
    return NextResponse.json({ success: true, keywords });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch keywords' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body.keyword || !body.targetUrl) {
      return NextResponse.json(
        { success: false, error: 'Keyword and targetUrl are required' },
        { status: 400 }
      );
    }
    const created = await addKeyword({
      keyword: body.keyword,
      targetUrl: body.targetUrl,
      category: body.category || 'General',
      currentRank: Number(body.currentRank) || 10,
      previousRank: Number(body.previousRank) || 12,
      bestRank: Number(body.bestRank) || 10,
      searchVolume: Number(body.searchVolume) || 1000,
      difficulty: Number(body.difficulty) || 30,
    });
    return NextResponse.json({ success: true, keyword: created });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to add keyword' },
      { status: 500 }
    );
  }
}
