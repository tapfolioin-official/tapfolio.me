import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/app/team/_components/Navbar";
import Footer from "@/app/team/_components/Footer";
import { GEO_FEATURES } from "@/lib/geo-data";
import { getWebPageSchema, getSoftwareApplicationSchema, getFAQPageSchema, getBreadcrumbSchema } from "@/lib/geo-schemas";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(GEO_FEATURES).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const feature = GEO_FEATURES[slug];

  if (!feature) {
    return {
      title: "Feature Not Found | Tapfolio",
    };
  }

  const canonicalUrl = `https://tapfolio.me/${feature.slug}`;

  return {
    title: `${feature.title} | Tapfolio Smart NFC Business Profiles`,
    description: feature.definition,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${feature.title} - Smart NFC Feature | Tapfolio`,
      description: feature.definition,
      url: canonicalUrl,
      type: "website",
      siteName: "Tapfolio",
      images: [
        {
          url: "https://tapfolio.me/assets/og-image.png",
          width: 1200,
          height: 630,
          alt: feature.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${feature.title} - Smart NFC Feature | Tapfolio`,
      description: feature.definition,
      images: ["https://tapfolio.me/assets/og-image.png"],
    },
  };
}

export default async function FeatureLandingPage({ params }: Props) {
  const { slug } = await params;
  const feature = GEO_FEATURES[slug];

  if (!feature) {
    notFound();
  }

  const pageUrl = `https://tapfolio.me/${feature.slug}`;
  const webPageSchema = getWebPageSchema(pageUrl, feature.title, feature.definition);
  const appSchema = getSoftwareApplicationSchema(feature.title, feature.definition);
  const faqSchema = getFAQPageSchema(feature.faqs);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "https://tapfolio.me" },
    { name: feature.title, url: pageUrl }
  ]);

  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [webPageSchema, appSchema, faqSchema, breadcrumbSchema]
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
          <span className="text-slate-300 font-semibold">{feature.title}</span>
        </nav>

        {/* Hero Section */}
        <section className="relative rounded-3xl p-8 md:p-12 overflow-hidden border border-slate-800/80 bg-slate-900/40 backdrop-blur-md flex flex-col gap-6">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-blue-500/20 w-fit">
            Feature Highlight
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
            {feature.title}
          </h1>
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl">
            {feature.definition}
          </p>
        </section>

        {/* Benefits Grid */}
        <section className="flex flex-col gap-8">
          <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
            Key Benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {feature.benefits.map((benefit, idx) => (
              <div key={idx} className="border border-slate-800/60 bg-slate-900/20 rounded-2xl p-6 flex items-start gap-4">
                <span className="text-blue-500 text-lg shrink-0 mt-0.5">✓</span>
                <p className="text-sm text-slate-300 leading-relaxed">{benefit}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works List */}
        <section className="flex flex-col gap-8">
          <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
            How It Works
          </h2>
          <div className="flex flex-col gap-6 max-w-2xl">
            {feature.howItWorks.map((step, idx) => (
              <div key={idx} className="flex gap-6 items-start">
                <span className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">
                  {idx + 1}
                </span>
                <p className="text-sm text-slate-300 leading-relaxed pt-1.5">{step}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Who It Is For */}
        <section className="flex flex-col gap-8">
          <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
            Who It Is For
          </h2>
          <div className="flex flex-wrap gap-3">
            {feature.whoItIsFor.map((userType, idx) => (
              <span key={idx} className="bg-slate-900/60 border border-slate-800 text-slate-300 text-xs font-semibold px-4 py-2.5 rounded-xl">
                👥 {userType}
              </span>
            ))}
          </div>
        </section>

        {/* FAQs Accordion */}
        <section className="flex flex-col gap-8">
          <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
            Frequently Asked Questions
          </h2>
          <div className="flex flex-col gap-4 max-w-3xl">
            {feature.faqs.map((faq, idx) => (
              <div key={idx} className="border border-slate-800/60 bg-slate-900/10 rounded-2xl p-6 flex flex-col gap-2">
                <h3 className="font-bold text-white text-base">{faq.question}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Related Interlinks */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-800 pt-10">
          <div>
            <h4 className="text-xs uppercase tracking-widest font-black text-slate-500 mb-3">Related Features</h4>
            <div className="flex flex-wrap gap-2">
              {feature.relatedFeatures.map((fSlug) => {
                const relFeature = GEO_FEATURES[fSlug];
                if (!relFeature) return null;
                return (
                  <Link
                    key={fSlug}
                    href={`/${fSlug}`}
                    className="text-xs font-bold text-blue-400 hover:text-blue-300 hover:underline bg-blue-500/5 border border-blue-500/10 px-3 py-1.5 rounded-lg transition-all"
                  >
                    {relFeature.title}
                  </Link>
                );
              })}
            </div>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest font-black text-slate-500 mb-3">Related Products</h4>
            <div className="flex flex-wrap gap-2">
              {feature.relatedProducts.map((prod) => (
                <span
                  key={prod}
                  className="text-xs font-semibold text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg"
                >
                  💳 {prod}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl p-8 md:p-12 text-center flex flex-col items-center gap-6 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10 flex flex-col gap-2 max-w-xl">
            <h2 className="text-3xl font-bold">Upgrade Your Networking</h2>
            <p className="text-blue-100 text-sm leading-relaxed mt-2">
              Equip yourself with premium NFC cards and start sharing your dynamic business profile with a single tap.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <Link
                href="/#order"
                className="bg-white text-blue-600 font-bold px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Order Your Card
              </Link>
              <Link
                href="/register"
                className="bg-blue-700/40 text-white border border-blue-400/30 hover:bg-blue-700/60 font-bold px-8 py-3.5 rounded-full transition-all"
              >
                Create Free Profile
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
