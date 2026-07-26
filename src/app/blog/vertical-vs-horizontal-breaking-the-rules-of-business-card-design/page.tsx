import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/app/team/_components/Navbar";
import Footer from "@/app/team/_components/Footer";
import { getWebPageSchema, getBreadcrumbSchema } from "@/lib/geo-schemas";
import post from "@/lib/content/blog/vertical-vs-horizontal-breaking-the-rules-of-business-card-design";

export const dynamic = "force-static";
export const revalidate = 86400;

export const metadata: Metadata = {
  title: `${post.title} | Tapfolio Blog`,
  description: post.summary,
  alternates: {
    canonical: `https://tapfolio.me/blog/${post.slug}`,
  },
  openGraph: {
    title: `${post.title} | Tapfolio Blog`,
    description: post.summary,
    url: `https://tapfolio.me/blog/${post.slug}`,
    type: "article",
    siteName: "Tapfolio",
  }
};

export default function BlogPostPage() {
  const pageUrl = `https://tapfolio.me/blog/${post.slug}`;
  const webPageSchema = getWebPageSchema(pageUrl, post.title, post.summary);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "https://tapfolio.me" },
    { name: "Blog", url: "https://tapfolio.me/blog" },
    { name: post.title, url: pageUrl }
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

      <main className="flex-1 w-full max-w-[800px] mx-auto px-6 py-16 flex flex-col gap-8">
        <Link href="/blog" className="text-sm font-bold text-blue-400 hover:text-blue-300 flex items-center gap-2">
          ← Back to Blog
        </Link>

        <article className="flex flex-col gap-6">
          <div className="flex items-center gap-4 text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>{post.date}</span>
            <span>•</span>
            <span>{post.readTime}</span>
            <span>•</span>
            <span>By {post.author}</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            {post.title}
          </h1>

          <div className="h-px bg-slate-800 my-4" />

          <p className="text-slate-300 leading-relaxed text-lg whitespace-pre-line">
            {post.content}
          </p>
        </article>
      </main>

      <Footer />
    </div>
  );
}
