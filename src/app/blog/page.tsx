import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/app/team/_components/Navbar";
import Footer from "@/app/team/_components/Footer";
import { getWebPageSchema, getBreadcrumbSchema } from "@/lib/geo-schemas";

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

import { BLOG_POSTS } from "@/lib/content/blog-posts";
export { BLOG_POSTS };

export default function BlogHubPage() {
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

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 font-sans selection:bg-blue-600/30 selection:text-blue-300 flex flex-col pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(combinedSchema).replace(/</g, "\\u003c"),
        }}
      />
      <Navbar />

      <main className="flex-1 w-full max-w-[1100px] mx-auto px-6 py-16 flex flex-col gap-16">
        
        {/* Header */}
        <section className="text-center max-w-2xl mx-auto flex flex-col gap-4 mt-8">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Content Hub</span>
          <h1 className="text-5xl font-bold tracking-tight text-white">
            Tapfolio <span className="text-blue-500">Insights</span>
          </h1>
          <p className="text-slate-400 leading-relaxed">
            Read our guidelines on NFC card configurations, lead-capture integrations, digital identity structures, and CRM syncing.
          </p>
        </section>

        {/* Blog Posts Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {BLOG_POSTS.map((post) => (
            <article
              key={post.slug}
              className="border border-slate-800 bg-slate-900/20 rounded-3xl p-6 flex flex-col justify-between hover:border-blue-500/50 transition-all duration-300"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                  <span>{post.date}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                </div>
                <h3 className="font-bold text-white text-xl leading-snug hover:text-blue-400 transition-colors">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">{post.summary}</p>
              </div>
              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-850">
                <span className="text-xs text-slate-400 font-medium">By {post.author}</span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 hover:underline"
                >
                  Read Article →
                </Link>
              </div>
            </article>
          ))}
        </section>

      </main>
      <Footer />
    </div>
  );
}
