import React from "react";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Navbar from "@/app/team/_components/Navbar";
import Footer from "@/app/team/_components/Footer";
import { getPostBySlug, incrementArticleViews, generateArticleJsonLd } from "@/lib/blog-service";
import { BLOG_POSTS } from "@/lib/content/blog-posts";
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  Share2,
  ChevronRight,
  BookOpen,
} from "lucide-react";

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPostBySlug(slug, { allowDraft: true });

  const post =
    result.post ||
    BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) {
    return {
      title: "Article Not Found | Tapfolio",
    };
  }

  const pageUrl = `https://tapfolio.me/blog/${post.slug}`;
  const title = (post as any).seoTitle || post.title;
  const description = (post as any).metaDescription || post.summary;
  const image = (post as any).featuredImage || (post as any).image || "/assets/blog/tapfolio_nfc_business_cards_price_details.png";

  return {
    title: `${title} | Tapfolio Blog`,
    description,
    alternates: {
      canonical: (post as any).canonicalUrl || pageUrl,
    },
    robots: (post as any).metaRobots || "index, follow",
    openGraph: {
      title: (post as any).ogTitle || title,
      description: (post as any).ogDescription || description,
      url: pageUrl,
      type: "article",
      siteName: "Tapfolio",
      images: [
        {
          url: image.startsWith("http") ? image : `https://tapfolio.me${image}`,
          alt: post.title,
        },
      ],
      publishedTime: (post as any).publishedAt ? new Date((post as any).publishedAt).toISOString() : undefined,
      authors: [(post as any).authorName || (post as any).author || "Tapfolio Team"],
    },
    twitter: {
      card: "summary_large_image",
      title: (post as any).ogTitle || title,
      description: (post as any).ogDescription || description,
      images: [image.startsWith("http") ? image : `https://tapfolio.me${image}`],
    },
  };
}

export default async function DynamicBlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const result = await getPostBySlug(slug, { allowDraft: true });

  // Handle 301 redirects if slug changed
  if (result.redirectTarget) {
    redirect(`/blog/${result.redirectTarget}`);
  }

  // Get article from database or static fallback
  let post: any = result.post;
  if (!post) {
    const staticPost = BLOG_POSTS.find((p) => p.slug === slug);
    if (staticPost) {
      post = {
        title: staticPost.title,
        slug: staticPost.slug,
        summary: staticPost.summary,
        content: staticPost.content,
        featuredImage: staticPost.image,
        publishedAt: staticPost.date ? new Date(staticPost.date) : new Date(),
        readingTime: staticPost.readTime || "5 min read",
        authorName: staticPost.author,
        categoryName: staticPost.category,
      };
    }
  }

  if (!post) {
    notFound();
  }

  // Trigger telemetry view count in background
  incrementArticleViews(slug);

  const schemas = generateArticleJsonLd(post);
  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [schemas.blogPostingSchema, schemas.breadcrumbSchema],
  };

  const publishDateFormatted = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recently Published";

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
        {/* Navigation Breadcrumb Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/blog"
            className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to All Articles
          </Link>
          <span className="text-xs font-extrabold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
            {post.categoryName || post.category?.name || "General"}
          </span>
        </div>

        {/* Article Header Card */}
        <header className="flex flex-col gap-6 bg-white border border-slate-200/65 rounded-3xl p-6 md:p-10 shadow-sm">
          <div className="flex items-center gap-4 text-xs font-bold text-slate-500 uppercase tracking-wide">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {publishDateFormatted}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {post.readingTime || "5 min read"}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-display font-extrabold text-slate-950 leading-tight">
            {post.title}
          </h1>

          {post.summary && (
            <p className="text-lg text-slate-600 leading-relaxed font-normal">
              {post.summary}
            </p>
          )}

          <div className="h-px bg-slate-100 my-2" />

          {/* Author Block */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-extrabold shadow-sm">
                {(post.authorName || "Tapfolio Team")
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-950">
                  Written by {post.authorName || "Tapfolio Editorial Team"}
                </span>
                <span className="text-xs text-slate-500">
                  {post.author?.designation || "Tapfolio Networking Specialist"}
                </span>
              </div>
            </div>

            {/* Social Share Buttons */}
            <div className="flex items-center gap-2">
              <a
                href={`https://twitter.com/intent/tweet?url=https://tapfolio.me/blog/${post.slug}&text=${encodeURIComponent(
                  post.title
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors"
              >
                Share on X
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=https://tapfolio.me/blog/${post.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold px-3 py-1.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 transition-colors"
              >
                Share on LinkedIn
              </a>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {post.featuredImage && (
          <div className="w-full relative overflow-hidden rounded-3xl border border-slate-200/80 shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.featuredImage}
              alt={post.imageAlt || post.title}
              className="w-full h-auto object-cover max-h-[500px]"
            />
          </div>
        )}

        {/* Main Article Content */}
        <article className="bg-white border border-slate-200/65 rounded-3xl p-6 md:p-12 shadow-sm flex flex-col gap-6">
          <div className="text-slate-800 leading-relaxed text-lg whitespace-pre-line font-normal space-y-4">
            {post.content}
          </div>
        </article>

        {/* Author Bio Footer Box */}
        {post.author?.bio && (
          <div className="bg-white border border-slate-200/65 rounded-3xl p-6 md:p-8 flex items-center gap-6 shadow-sm">
            <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg font-extrabold flex-shrink-0">
              {(post.authorName || "Tapfolio Team").slice(0, 2).toUpperCase()}
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-base font-extrabold text-slate-950">
                About {post.authorName}
              </span>
              <p className="text-sm text-slate-600 leading-relaxed">
                {post.author.bio}
              </p>
            </div>
          </div>
        )}

        {/* Bottom Back Button */}
        <div className="flex justify-center pt-6">
          <Link
            href="/blog"
            className="px-6 py-3 rounded-2xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/15"
          >
            ← Explore More Tapfolio Articles
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
