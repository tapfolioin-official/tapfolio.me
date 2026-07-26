import React from "react";
import type { Metadata } from "next";
import BlogPostTemplate from "@/components/templates/BlogPostTemplate";
import post from "@/lib/content/blog/how-to-locate-the-nfc-reader-on-different-smartphones-for-seamless-smart-business-card-experience";

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
  return <BlogPostTemplate slug="how-to-locate-the-nfc-reader-on-different-smartphones-for-seamless-smart-business-card-experience" />;
}
