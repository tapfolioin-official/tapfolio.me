import React from "react";
import type { Metadata } from "next";
import BlogPostTemplate from "@/components/templates/BlogPostTemplate";
import post from "@/lib/content/blog/smart-business-cards-vs-paper-cards-which-one-wins-in-2025";

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

export default function Page() {
  return <BlogPostTemplate slug="smart-business-cards-vs-paper-cards-which-one-wins-in-2025" />;
}
