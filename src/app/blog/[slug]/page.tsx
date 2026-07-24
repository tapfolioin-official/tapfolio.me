import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/app/team/_components/Navbar";
import Footer from "@/app/team/_components/Footer";
import { BLOG_POSTS } from "../page";
import { getWebPageSchema, getBreadcrumbSchema } from "@/lib/geo-schemas";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: "Article Not Found | Tapfolio",
    };
  }

  const canonicalUrl = `https://tapfolio.me/blog/${post.slug}`;

  return {
    title: `${post.title} | Tapfolio Blog`,
    description: post.summary,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${post.title} | Tapfolio Blog`,
      description: post.summary,
      url: canonicalUrl,
      type: "article",
      siteName: "Tapfolio",
      images: [
        {
          url: "https://tapfolio.me/assets/og-image.png",
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | Tapfolio Blog`,
      description: post.summary,
      images: ["https://tapfolio.me/assets/og-image.png"],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  const pageUrl = `https://tapfolio.me/blog/${post.slug}`;
  const webPageSchema = getWebPageSchema(pageUrl, post.title, post.summary);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "https://tapfolio.me" },
    { name: "Blog", url: "https://tapfolio.me/blog" },
    { name: post.title, url: pageUrl }
  ]);

  // Generate structured Article JSON-LD
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": pageUrl,
    "headline": post.title,
    "description": post.summary,
    "datePublished": "2026-07-24T12:00:00Z",
    "dateModified": "2026-07-24T12:00:00Z",
    "author": {
      "@type": "Person",
      "name": post.author,
      "url": post.author.includes("Abhinand") ? "https://tapfolio.me/founders/abhinand" : "https://tapfolio.me/founders/mohammed-nibrasul-haqq"
    },
    "publisher": {
      "@type": "Organization",
      "@id": "https://tapfolio.me/#organization",
      "name": "Tapfolio",
      "logo": {
        "@type": "ImageObject",
        "url": "https://tapfolio.me/assets/logo.png"
      }
    }
  };

  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [webPageSchema, articleSchema, breadcrumbSchema]
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 font-sans selection:bg-blue-600/30 selection:text-blue-300 flex flex-col pt-20">
      {/* Inject JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(combinedSchema).replace(/</g, "\\u003c"),
        }}
      />
      
      <Navbar />

      <main className="flex-1 w-full max-w-[850px] mx-auto px-6 py-16 flex flex-col gap-10">
        
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="text-xs text-slate-500 font-medium flex items-center gap-2">
          <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-blue-400 transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-slate-300 font-semibold">{post.title}</span>
        </nav>

        {/* Article content wrapper */}
        <article className="border border-slate-800/80 bg-slate-900/40 backdrop-blur-md rounded-3xl p-8 md:p-12 flex flex-col gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4 text-xs text-slate-500 font-bold uppercase tracking-wider">
            <span>By {post.author}</span>
            <div className="flex items-center gap-2">
              <span>{post.date}</span>
              <span>•</span>
              <span>{post.readTime}</span>
            </div>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight mt-2">
            {post.title}
          </h1>

          <p className="text-base text-slate-300 leading-relaxed font-semibold italic border-l-4 border-blue-500 pl-4 py-1">
            {post.summary}
          </p>

          <hr className="border-slate-800" />

          {/* Render paragraph texts dynamically */}
          <div className="text-slate-300 leading-relaxed text-sm space-y-6 max-w-3xl whitespace-pre-line">
            {post.content}
          </div>

        </article>

        {/* Post footer links */}
        <div className="flex justify-between items-center border-t border-slate-850 pt-8 mt-4">
          <Link
            href="/blog"
            className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 transition-all"
          >
            ← Back to Blog
          </Link>
          <Link
            href="/#order"
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-500/10"
          >
            Get Your Tapfolio Card
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}
