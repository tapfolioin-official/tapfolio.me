import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/app/team/_components/Navbar";
import Footer from "@/app/team/_components/Footer";
import { GEO_INDUSTRIES } from "@/lib/geo-data";
import { getWebPageSchema, getFAQPageSchema, getLocalBusinessSchema, getBreadcrumbSchema } from "@/lib/geo-schemas";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(GEO_INDUSTRIES).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const industry = GEO_INDUSTRIES[slug];

  if (!industry) {
    return {
      title: "Industry Not Found | Tapfolio",
    };
  }

  const canonicalUrl = `https://tapfolio.me/${industry.slug}`;

  return {
    title: `${industry.title} | Tapfolio Dynamic Business Cards`,
    description: industry.intro,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: `${industry.title} | Tapfolio NFC Cards`,
      description: industry.intro,
      url: canonicalUrl,
      type: "website",
      siteName: "Tapfolio",
      images: [
        {
          url: "https://tapfolio.me/assets/og-image.png",
          width: 1200,
          height: 630,
          alt: industry.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${industry.title} | Tapfolio NFC Cards`,
      description: industry.intro,
      images: ["https://tapfolio.me/assets/og-image.png"],
    },
  };
}

export default async function IndustryLandingPage({ params }: Props) {
  const { slug } = await params;
  const industry = GEO_INDUSTRIES[slug];

  if (!industry) {
    notFound();
  }

  const pageUrl = `https://tapfolio.me/${industry.slug}`;
  const webPageSchema = getWebPageSchema(pageUrl, industry.title, industry.intro);
  const faqSchema = getFAQPageSchema(industry.faqs);
  const businessSchema = getLocalBusinessSchema(`Tapfolio for ${industry.title.split("for ").pop() || "Professionals"}`, industry.intro, pageUrl);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "https://tapfolio.me" },
    { name: "Industries", url: "https://tapfolio.me/#industries" },
    { name: industry.title, url: pageUrl }
  ]);

  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [webPageSchema, faqSchema, businessSchema, breadcrumbSchema]
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
          <span className="text-slate-500">Industries</span>
          <span>/</span>
          <span className="text-slate-300 font-semibold">{industry.title}</span>
        </nav>

        {/* Hero Section */}
        <section className="relative rounded-3xl p-8 md:p-12 overflow-hidden border border-slate-800/80 bg-slate-900/40 backdrop-blur-md flex flex-col gap-6">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="inline-flex items-center gap-2 bg-purple-500/10 text-purple-400 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-purple-500/20 w-fit">
            Industry Solution
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
            {industry.title}
          </h1>
          <p className="text-purple-300 font-semibold text-lg">
            {industry.subtitle}
          </p>
          <p className="text-slate-300 leading-relaxed text-base max-w-3xl">
            {industry.intro}
          </p>
        </section>

        {/* Use Cases Section */}
        <section className="flex flex-col gap-8">
          <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
            Target Use Cases
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {industry.useCases.map((useCase, idx) => (
              <div key={idx} className="border border-slate-800/60 bg-slate-900/20 rounded-2xl p-6 flex flex-col gap-2">
                <h3 className="font-bold text-white text-lg">🚀 {useCase.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{useCase.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="flex flex-col gap-8">
          <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
            Industry Benefits
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {industry.benefits.map((benefit, idx) => (
              <div key={idx} className="border border-slate-800/40 bg-slate-900/10 rounded-xl p-5 flex gap-3.5">
                <span className="text-emerald-500 text-lg">✓</span>
                <p className="text-xs text-slate-300 leading-relaxed">{benefit}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs Accordion */}
        <section className="flex flex-col gap-8">
          <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
            Frequently Asked Questions
          </h2>
          <div className="flex flex-col gap-4 max-w-3xl">
            {industry.faqs.map((faq, idx) => (
              <div key={idx} className="border border-slate-800/60 bg-slate-900/10 rounded-2xl p-6 flex flex-col gap-2">
                <h3 className="font-bold text-white text-base">{faq.question}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-3xl p-8 md:p-12 text-center flex flex-col items-center gap-6 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10 flex flex-col gap-2 max-w-xl">
            <h2 className="text-3xl font-bold">Empower Your Network</h2>
            <p className="text-purple-100 text-sm leading-relaxed mt-2">
              Join thousands of professionals in your industry who use Tapfolio to streamline their contactless digital connections.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <Link
                href="/#order"
                className="bg-white text-purple-700 font-bold px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Get Started Now
              </Link>
              <Link
                href="/contact"
                className="bg-purple-800/40 text-white border border-purple-400/30 hover:bg-purple-800/60 font-bold px-8 py-3.5 rounded-full transition-all"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
