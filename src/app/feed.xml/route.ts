import { NextResponse } from 'next/server';
import { BLOG_POSTS } from '../blog/page';

export async function GET() {
  const host = 'https://www.tapfolio.me';
  
  const rssItems = BLOG_POSTS.map(post => {
    const parsedDate = new Date(post.date).toUTCString();
    
    return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${host}/blog/${post.slug}</link>
      <guid>${host}/blog/${post.slug}</guid>
      <pubDate>${parsedDate}</pubDate>
      <description>${escapeXml(post.summary)}</description>
      <author>${escapeXml(post.author)}</author>
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
