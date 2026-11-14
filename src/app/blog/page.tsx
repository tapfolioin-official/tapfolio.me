import React from "react";
import type { Metadata } from "next";
import Navbar from "@/app/team/_components/Navbar";
import Footer from "@/app/team/_components/Footer";
import { getWebPageSchema, getBreadcrumbSchema } from "@/lib/geo-schemas";
import { BLOG_POSTS } from "@/lib/content/blog-posts";
import { getPublicBlogPosts } from "@/lib/blog-service";
import BlogHubClient from "./BlogHubClient";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Tapfolio Blog | Contactless Networking & NFC Business Trends",
  description: "Read Tapfolio's insights on NFC hardware technology, dynamic digital cards, professional networking, and CRM marketing integrations.",
  alternates: {
    canonical: "https://tapfolio.me/blog",
  },
  openGraph: {
    title: "Tapfolio Blog | Contactless Networking & NFC Business Trends",
    description: "Read Tapfolio's insights on NFC hardware technology, dynamic digital cards, professional networking, and CRM marketing integrations.",
    url: "https://tapfolio.me/blog",
    type: "website",
    siteName: "Tapfolio",
  }
};

export default async function BlogHubPage() {
  const pageUrl = "https://tapfolio.me/blog";
  const webPageSchema = getWebPageSchema(pageUrl, "Tapfolio Blog", "Insights on NFC business cards, digital portfolios, and modern sales networking.");
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "https://tapfolio.me" },
    { name: "Blog", url: pageUrl }
  ]);

  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [webPageSchema, breadcrumbSchema]
  };

  let posts: any[] = [];
  try {
    const res = await getPublicBlogPosts({ limit: 100 });
    if (res.posts && res.posts.length > 0) {
      posts = res.posts.map((p) => ({
        slug: p.slug,
        title: p.title,
        summary: p.summary,
        content: p.content,
        image: p.featuredImage || "/assets/blog/tapfolio_nfc_business_cards_price_details.png",
        date: p.publishedAt ? new Date(p.publishedAt).toISOString().split('T')[0] : '2024-01-01',
        readTime: p.readingTime || '5 min read',
        author: p.authorName || 'Tapfolio Team',
        category: p.categoryName || 'General',
      }));
    }
  } catch (err) {
    console.error('Failed to query database blog posts, falling back to static archive:', err);
  }

  // Fallback to static archive if database has not populated
  if (!posts || posts.length === 0) {
    posts = BLOG_POSTS;
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 flex flex-col pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(combinedSchema).replace(/</g, "\\u003c"),
        }}
      />
      <Navbar />

      <BlogHubClient posts={posts} />

      <Footer />
    </div>
  );
}
