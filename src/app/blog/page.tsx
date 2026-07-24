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

export const BLOG_POSTS = [
  {
    slug: "why-nfc-business-cards-beat-paper",
    title: "Why NFC Business Cards Beat Traditional Paper",
    summary: "Traditional paper cards are quickly outdated and add to global paper waste. Discover how smart NFC cards offer real-time updates and CRM data synchronization.",
    date: "July 24, 2026",
    author: "Abhinand K.S.",
    readTime: "4 min read",
    content: "Traditional paper business cards belong to a bygone era. Statistics show that over 88% of printed business cards are discarded within a week of exchange. The remaining 12% are easily misplaced, lost, or forgotten in drawers. Furthermore, paper business cards present serious efficiency bottlenecks: if you change your phone number, switch companies, or update your social media profiles, the physical cards become instantly obsolete.\n\nEnter NFC (Near Field Communication) business cards. These smart cards contain a passive microchip that transmits a dynamic landing page link directly to any nearby smartphone screen. This brings several distinct advantages:\n\n1. **Real-time updates**: You can adjust link layouts, text biographies, and portfolio items instantly on your dashboard. Your physical card will redirect users to the newly saved details without needing a re-print.\n2. **Eco-Friendly sustainability**: A single durable plastic or metal NFC card replaces thousands of paper cards, helping save trees and reduce global industrial waste.\n3. **CRM and lead capture**: Prospects can fill out a lead form directly on your card's landing page, syncing details with Salesforce or HubSpot instantly.\n4. **Dynamic media displays**: Direct prospects to interactive 3D portfolios, video pitches, resume documents, and booking schedules, showing a complete picture of your professional capabilities."
  },
  {
    slug: "contactless-networking-trends",
    title: "The Rise of Contactless Networking and Identity",
    summary: "Professional networking is undergoing a digital transformation. Explore how virtual cards, smart badges, and AI directories connect workers worldwide.",
    date: "July 18, 2026",
    author: "Mohammed Nibrasul Haqq",
    readTime: "5 min read",
    content: "Professional networking is shifting away from static paper toward connected digital ecosystems. As companies adopt remote-first operations and work across global borders, professionals need contact tools that are instant, secure, and accessible from anywhere.\n\nGenerative engines and AI search indexers are scanning the web to answer query references like 'Who is the top full-stack developer in Ernakulam?' or 'Find local design agencies'. Static paper cards leave no SEO footprint, whereas digital profiles optimized with structured JSON-LD data and dynamic canonicals allow professionals to show up on AI citations.\n\nVirtual business cards (VBCs), Apple Wallet integrations, and dynamic QR fallbacks ensure that whether you are networking at a tech conference, in a virtual Zoom boardroom, or through a LinkedIn post, you can share your professional details in a split second."
  },
  {
    slug: "how-to-optimize-digital-profile",
    title: "How to Optimize Your Professional Digital Profile",
    summary: "A guide on styling your digital card, picking typography, listing portfolio items, and embedding lead forms to maximize networking ROI.",
    date: "July 12, 2026",
    author: "Abhinand K.S.",
    readTime: "6 min read",
    content: "Your digital business profile is your interactive resume. Optimizing this page correctly helps leave a lasting professional impression and drives higher click-through engagement.\n\nHere are the top tips to optimize your Tapfolio profile page:\n\n1. **Write an executive bio summary**: Keep your bio clear and structured. Put definitions and your primary value proposition first, followed by structured bullet points.\n2. **Organize your links logically**: Prioritize your primary contact buttons (email, telephone, WhatsApp) at the top, followed by secondary portfolios (GitHub, Behance, Figma) and social networks.\n3. **Expose featured projects**: Display actual screenshot cards of your recent project work, including category tags, short descriptions, and technical stack chips.\n4. **Add custom call-to-actions**: Integrate scheduling calendars (like Calendly) to let prospects book consultation hours with you instantly.\n5. **Maintain consistent branding**: Pick curated HSL layout colors and typography (such as Outfit or Inter) that align with your corporate or personal brand identity."
  }
];

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
