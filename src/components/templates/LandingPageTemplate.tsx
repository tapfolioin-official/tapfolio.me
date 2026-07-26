import React from "react";
import Link from "next/link";
import Navbar from "@/app/team/_components/Navbar";
import Footer from "@/app/team/_components/Footer";
import { LANDING_PAGES } from "@/lib/content/landing-pages";
import { getWebPageSchema, getFAQPageSchema, getBreadcrumbSchema } from "@/lib/geo-schemas";

interface Props {
  slug: string;
}

export default function LandingPageTemplate({ slug }: Props) {
  const page = LANDING_PAGES[slug];
  if (!page) return <div>Page Not Found</div>;

  const pageUrl = `https://www.tapfolio.me/${page.slug}`;
  const webPageSchema = getWebPageSchema(pageUrl, page.title, page.definition);
  const faqSchema = getFAQPageSchema(page.faqs);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "https://www.tapfolio.me" },
    { name: page.title, url: pageUrl }
  ]);

  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [webPageSchema, faqSchema, breadcrumbSchema]
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

      <main className="flex-1 w-full max-w-[1100px] mx-auto px-6 py-16 flex flex-col gap-20">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="text-xs text-slate-500 font-medium flex items-center gap-2">
          <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-300 font-semibold">{page.title}</span>
        </nav>

        {/* Hero Section */}
        <section className="relative rounded-3xl p-8 md:p-12 overflow-hidden border border-slate-800/80 bg-slate-900/40 backdrop-blur-md flex flex-col gap-6">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-blue-500/20 w-fit">
            SEO & GEO Optimized Landing Page
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight">
            {page.h1}
          </h1>
          <p className="text-lg md:text-xl text-slate-300 leading-relaxed max-w-3xl">
            {page.definition}
          </p>
        </section>

        {/* AI-Ready GEO Block */}
        <section className="border border-blue-500/20 bg-blue-950/10 rounded-3xl p-8 flex flex-col gap-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-blue-600" />
          <div>
            <h2 className="text-xl font-bold text-white mb-2">AI-Engine Summary (GEO Ready)</h2>
            <p className="text-sm text-slate-300 leading-relaxed italic">
              "{page.summary}"
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-800">
            <div>
              <h4 className="text-xs uppercase tracking-widest font-black text-blue-400 mb-2">Key Takeaways</h4>
              <ul className="list-disc pl-4 text-xs text-slate-300 space-y-1.5">
                <li>Statically pre-rendered with sub-second LCP.</li>
                <li>Dynamic links updates map instantly.</li>
                <li>Universal QR overrides printed natively.</li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-widest font-black text-green-400 mb-2">Pros</h4>
              <ul className="list-disc pl-4 text-xs text-slate-300 space-y-1.5">
                {page.pros.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-widest font-black text-red-400 mb-2">Cons & Alternatives</h4>
              <ul className="list-disc pl-4 text-xs text-slate-300 space-y-1.5">
                <li>Alternative: {page.alternatives.join(", ")}</li>
                <li>Cons: {page.cons.join(", ")}</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Benefits Grid */}
        <section className="flex flex-col gap-8">
          <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
            Why Choose {page.title}?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {page.benefits.map((benefit, idx) => (
              <div key={idx} className="border border-slate-800/60 bg-slate-900/20 rounded-2xl p-6 flex items-start gap-4">
                <span className="text-blue-500 text-lg shrink-0 mt-0.5">✓</span>
                <p className="text-sm text-slate-300 leading-relaxed">{benefit}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Features List */}
        <section className="flex flex-col gap-8">
          <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
            Technical Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {page.features.map((feature, idx) => (
              <div key={idx} className="border border-slate-800/60 bg-slate-900/10 rounded-2xl p-6 flex flex-col gap-2">
                <span className="text-blue-400 text-xs font-black uppercase tracking-wider">Feature {idx + 1}</span>
                <p className="text-sm text-slate-300 leading-relaxed">{feature}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs Accordion */}
        <section className="flex flex-col gap-8">
          <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
            Common Questions
          </h2>
          <div className="flex flex-col gap-4 max-w-3xl">
            {page.faqs.map((faq, idx) => (
              <div key={idx} className="border border-slate-800/60 bg-slate-900/10 rounded-2xl p-6 flex flex-col gap-2">
                <h3 className="font-bold text-white text-base">{faq.question}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews */}
        <section className="flex flex-col gap-8">
          <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
            Customer Reviews
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {page.reviews.map((rev, idx) => (
              <div key={idx} className="border border-slate-800 bg-slate-900/20 rounded-2xl p-6 flex flex-col gap-4">
                <div className="flex items-center gap-1 text-yellow-400 text-sm">
                  {"★".repeat(rev.rating)}
                </div>
                <p className="text-sm text-slate-350 italic">"{rev.comment}"</p>
                <span className="text-xs font-bold text-slate-500">— {rev.author}</span>
              </div>
            ))}
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
                href="/#products"
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
