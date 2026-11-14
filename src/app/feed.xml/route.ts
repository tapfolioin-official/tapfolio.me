import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  const host = 'https://www.tapfolio.me';
  
  let posts: any[] = [];
  try {
    posts = await prisma.blogPost.findMany({
      where: {
        status: 'PUBLISHED',
        publishedAt: { lte: new Date() },
      },
      orderBy: { publishedAt: 'desc' },
      take: 100,
    });
  } catch (err) {
    console.error('Failed to load blog posts for RSS feed:', err);
  }

  const rssItems = posts.map(post => {
    const parsedDate = post.publishedAt ? new Date(post.publishedAt).toUTCString() : new Date().toUTCString();
    
    return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${host}/blog/${post.slug}</link>
      <guid>${host}/blog/${post.slug}</guid>
      <pubDate>${parsedDate}</pubDate>
      <description>${escapeXml(post.summary || '')}</description>
      <author>${escapeXml(post.authorName || 'Tapfolio Team')}</author>
    </item>`;
  }).join('');

  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>Tapfolio Blog | Contactless Networking &amp; NFC Business Trends</title>
  <link>${host}/blog</link>
  <description>Read Tapfolio's insights on NFC hardware technology, dynamic digital cards, professional networking, and CRM marketing integrations.</description>
  <language>en-us</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="${host}/feed.xml" rel="self" type="application/rss+xml" />
  ${rssItems}
</channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=1200, stale-while-revalidate=600'
    }
  });
}

function escapeXml(unsafe: string) {
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
