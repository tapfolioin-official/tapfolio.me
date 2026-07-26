import React from "react";
import Link from "next/link";
import Navbar from "@/app/team/_components/Navbar";
import Footer from "@/app/team/_components/Footer";
import { getWebPageSchema, getBreadcrumbSchema } from "@/lib/geo-schemas";
import { BLOG_POSTS } from "@/lib/content/blog-posts";

interface Props {
  slug: string;
}

export default function BlogPostTemplate({ slug }: Props) {
  const post = BLOG_POSTS.find((p) => p.slug === slug);
  if (!post) return <div className="text-center py-20">Article Not Found</div>;

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
    <div className="bg-[#f8fafc] min-h-screen text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 flex flex-col pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(combinedSchema).replace(/</g, "\\u003c"),
        }}
      />
      <Navbar />

      <main className="flex-1 w-full max-w-[900px] mx-auto px-6 py-12 flex flex-col gap-8">
        
        {/* Navigation & Category */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link 
            href="/blog" 
            className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 transition-colors"
          >
            ← Back to Blog
          </Link>
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
            {post.category}
          </span>
        </div>

        {/* Article Header Card */}
        <header className="flex flex-col gap-6 bg-white border border-slate-200/65 rounded-3xl p-6 md:p-10 shadow-sm">
          <div className="flex items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-wide">
            <span>{post.date}</span>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-display font-extrabold text-slate-950 leading-tight">
            {post.title}
          </h1>

          <p className="text-lg text-slate-600 leading-relaxed font-normal">
            {post.summary}
          </p>

          <div className="h-px bg-slate-100 my-2" />

          {/* Author Block */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-extrabold shadow-sm">
              {post.author.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-slate-950">Written by {post.author}</span>
              <span className="text-xs text-slate-500">Tapfolio Networking Team</span>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {post.image && (
          <div className="w-full relative overflow-hidden rounded-3xl border border-slate-200/80 shadow-md animate-fade-in">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-auto object-cover max-h-[480px] hover:scale-[1.01] transition-transform duration-700" 
            />
          </div>
        )}

        {/* Article Content Layout */}
        <article className="bg-white border border-slate-200/65 rounded-3xl p-6 md:p-12 shadow-sm flex flex-col gap-6">
          <p className="text-slate-700 leading-relaxed text-lg whitespace-pre-line font-normal">
            {post.content}
          </p>

          <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex flex-col gap-1.5">
              <h4 className="text-base font-bold text-slate-950">Start your smart networking journey</h4>
              <p className="text-sm text-slate-500">Ditch paper business cards and connect instantly with NFC.</p>
            </div>
            <Link 
              href="/" 
              className="inline-flex items-center justify-center bg-blue-600 text-white font-bold text-sm px-6 py-3 rounded-full hover:bg-blue-700 shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 active:scale-95 transition-all duration-200"
            >
              Configure Your Card Now
            </Link>
          </div>
        </article>

      </main>
      <Footer />
    </div>
  );
}
