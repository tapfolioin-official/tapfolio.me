import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/app/team/_components/Navbar";
import Footer from "@/app/team/_components/Footer";
import { GEO_DOCS } from "@/lib/geo-data";
import { getWebPageSchema, getBreadcrumbSchema } from "@/lib/geo-schemas";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(GEO_DOCS).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const doc = GEO_DOCS[slug];

  if (!doc) {
    return {
      title: "Doc Not Found | Tapfolio",
    };
  }

  const canonicalUrl = `https://tapfolio.me/docs/${doc.slug}`;

  return {
    title: `${doc.title} | Tapfolio Developer Center`,
    description: doc.summary,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${doc.title} | Tapfolio Developer Center`,
      description: doc.summary,
      url: canonicalUrl,
      type: "article",
      siteName: "Tapfolio",
      images: [
        {
          url: "https://tapfolio.me/assets/og-image.png",
          width: 1200,
          height: 630,
          alt: doc.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${doc.title} | Tapfolio Developer Center`,
      description: doc.summary,
      images: ["https://tapfolio.me/assets/og-image.png"],
    },
  };
}

export default async function DocumentationSubPage({ params }: Props) {
  const { slug } = await params;
  const doc = GEO_DOCS[slug];

  if (!doc) {
    notFound();
  }

  const pageUrl = `https://tapfolio.me/docs/${doc.slug}`;
  const webPageSchema = getWebPageSchema(pageUrl, doc.title, doc.summary);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "https://tapfolio.me" },
    { name: "Docs", url: "https://tapfolio.me/docs" },
    { name: doc.title, url: pageUrl }
  ]);

  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [webPageSchema, breadcrumbSchema]
  };

  return (
    <div className="bg-[#0b0f19] min-h-screen text-slate-100 font-sans selection:bg-blue-600/30 selection:text-blue-300 flex flex-col pt-20">
      {/* Inject JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(combinedSchema).replace(/</g, "\\u003c"),
        }}
      />
      
      <Navbar />

      <main className="flex-1 w-full max-w-[900px] mx-auto px-6 py-16 flex flex-col gap-10">
        
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="text-xs text-slate-500 font-medium flex items-center gap-2">
          <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/docs" className="hover:text-blue-400 transition-colors">Docs</Link>
          <span>/</span>
          <span className="text-slate-300 font-semibold">{doc.title}</span>
        </nav>

        {/* Content Section */}
        <article className="border border-slate-800/80 bg-slate-900/40 backdrop-blur-md rounded-3xl p-8 md:p-12 flex flex-col gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <span className="bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider px-3 py-1 border border-blue-500/20 rounded-full">
              {doc.category}
            </span>
            <span className="text-xs text-slate-500 font-medium">Tapfolio Docs v1.0</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mt-2">
            {doc.title}
          </h1>

          <p className="text-base text-slate-400 leading-relaxed font-semibold italic">
            {doc.summary}
          </p>

          <hr className="border-slate-800" />

          <p className="text-sm text-slate-300 leading-relaxed max-w-3xl whitespace-pre-line">
            {doc.content}
          </p>

          {/* Steps List */}
          {doc.steps && doc.steps.length > 0 && (
            <div className="flex flex-col gap-4 mt-4">
              <h3 className="text-sm uppercase tracking-widest font-black text-slate-400">Implementation Steps</h3>
              <ol className="flex flex-col gap-3">
                {doc.steps.map((step, idx) => (
                  <li key={idx} className="flex gap-4 items-start text-sm text-slate-300 leading-relaxed">
                    <span className="w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="pt-0.5">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Code Snippet */}
          {doc.codeSnippet && (
            <div className="flex flex-col gap-3 mt-4">
              <h3 className="text-sm uppercase tracking-widest font-black text-slate-400">Code Example</h3>
              <pre className="bg-slate-950 border border-slate-800 rounded-xl p-5 overflow-x-auto text-xs font-mono text-emerald-400 leading-relaxed">
                {doc.codeSnippet}
              </pre>
            </div>
          )}
        </article>

        {/* Navigation Actions */}
        <div className="flex justify-between items-center border-t border-slate-850 pt-8 mt-4">
          <Link
            href="/docs"
            className="text-xs font-bold text-slate-400 hover:text-white flex items-center gap-1.5 transition-all"
          >
            ← Back to Docs Home
          </Link>
          <Link
            href="/#order"
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all shadow-lg shadow-blue-500/10"
          >
            Configure Card Now
          </Link>
        </div>

      </main>

      <Footer />
    </div>
  );
}
