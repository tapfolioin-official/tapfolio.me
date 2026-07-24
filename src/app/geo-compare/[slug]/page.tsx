import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/app/team/_components/Navbar";
import Footer from "@/app/team/_components/Footer";
import { COMPETITOR_COMPARISONS } from "@/lib/geo-data";
import { getWebPageSchema, getFAQPageSchema, getBreadcrumbSchema } from "@/lib/geo-schemas";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(COMPETITOR_COMPARISONS).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const comparison = COMPETITOR_COMPARISONS[slug];

  if (!comparison) {
    return {
      title: "Comparison Not Found | Tapfolio",
    };
  }

  const canonicalUrl = `https://tapfolio.me/tapfolio-vs-${comparison.slug}`;

  return {
    title: `Tapfolio vs ${comparison.competitorName} | Contactless NFC Card Comparison`,
    description: comparison.intro,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `Tapfolio vs ${comparison.competitorName} | Contactless NFC Card Comparison`,
      description: comparison.intro,
      url: canonicalUrl,
      type: "website",
      siteName: "Tapfolio",
      images: [
        {
          url: "https://tapfolio.me/assets/og-image.png",
          width: 1200,
          height: 630,
          alt: `Tapfolio vs ${comparison.competitorName}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Tapfolio vs ${comparison.competitorName} | Contactless NFC Card Comparison`,
      description: comparison.intro,
      images: ["https://tapfolio.me/assets/og-image.png"],
    },
  };
}

export default async function ComparisonLandingPage({ params }: Props) {
  const { slug } = await params;
  const comparison = COMPETITOR_COMPARISONS[slug];

  if (!comparison) {
    notFound();
  }

  const pageUrl = `https://tapfolio.me/tapfolio-vs-${comparison.slug}`;
  const webPageSchema = getWebPageSchema(pageUrl, `Tapfolio vs ${comparison.competitorName}`, comparison.intro);
  const faqSchema = getFAQPageSchema(comparison.faqs);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "https://tapfolio.me" },
    { name: `Tapfolio vs ${comparison.competitorName}`, url: pageUrl }
  ]);

  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [webPageSchema, faqSchema, breadcrumbSchema]
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

      <main className="flex-1 w-full max-w-[1100px] mx-auto px-6 py-16 flex flex-col gap-20">
        
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="text-xs text-slate-500 font-medium flex items-center gap-2">
          <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-300 font-semibold">Tapfolio vs {comparison.competitorName}</span>
        </nav>

        {/* Hero Section */}
        <section className="relative rounded-3xl p-8 md:p-12 overflow-hidden border border-slate-800/80 bg-slate-900/40 backdrop-blur-md flex flex-col gap-6">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-blue-500/20 w-fit">
            Product Comparison
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Tapfolio vs {comparison.competitorName}
          </h1>
          <p className="text-base md:text-lg text-slate-300 leading-relaxed max-w-3xl">
            {comparison.intro}
          </p>
        </section>

        {/* Comparison Table */}
        <section className="flex flex-col gap-8">
          <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
            Comparison Matrix
          </h2>
          <div className="overflow-x-auto border border-slate-800 rounded-2xl bg-slate-900/10">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/50">
                  <th className="p-4 md:p-6 text-sm font-bold text-slate-400">Feature / Metric</th>
                  <th className="p-4 md:p-6 text-sm font-black text-blue-400 bg-blue-500/5">Tapfolio</th>
                  <th className="p-4 md:p-6 text-sm font-bold text-slate-400">{comparison.competitorName}</th>
                </tr>
              </thead>
              <tbody>
                {comparison.matrix.map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-850 hover:bg-slate-900/20 transition-all">
                    <td className="p-4 md:p-6 text-sm text-slate-300 font-semibold">{row.criteria}</td>
                    <td className="p-4 md:p-6 text-sm text-white font-bold bg-blue-500/5">{row.tapfolio}</td>
                    <td className="p-4 md:p-6 text-sm text-slate-400">{row.competitor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Differentiators */}
        <section className="flex flex-col gap-8">
          <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
            Why Choose Tapfolio?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {comparison.keyDifferentiators.map((diff, idx) => (
              <div key={idx} className="border border-slate-800/60 bg-slate-900/20 rounded-2xl p-6 flex gap-4">
                <span className="text-blue-500 text-lg">💡</span>
                <p className="text-sm text-slate-300 leading-relaxed">{diff}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="flex flex-col gap-8">
          <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
            Frequently Asked Questions
          </h2>
          <div className="flex flex-col gap-4 max-w-3xl">
            {comparison.faqs.map((faq, idx) => (
              <div key={idx} className="border border-slate-800/60 bg-slate-900/10 rounded-2xl p-6 flex flex-col gap-2">
                <h3 className="font-bold text-white text-base">{faq.question}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl p-8 md:p-12 text-center flex flex-col items-center gap-6 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10 flex flex-col gap-2 max-w-xl">
            <h2 className="text-3xl font-bold">Experience the Tapfolio Difference</h2>
            <p className="text-blue-100 text-sm leading-relaxed mt-2">
              Upgrade to premium hardware and dynamic pages today. Order custom PVC or metal card.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <Link
                href="/#order"
                className="bg-white text-blue-600 font-bold px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Configure Your Card
              </Link>
              <Link
                href="/#pricing"
                className="bg-blue-700/40 text-white border border-blue-400/30 hover:bg-blue-700/60 font-bold px-8 py-3.5 rounded-full transition-all"
              >
                View Plans
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
