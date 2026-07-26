import React from "react";
import Link from "next/link";
import Navbar from "@/app/team/_components/Navbar";
import Footer from "@/app/team/_components/Footer";
import { COMPARISONS } from "@/lib/content/comparison";
import { getWebPageSchema, getFAQPageSchema, getBreadcrumbSchema } from "@/lib/geo-schemas";

interface Props {
  slug: string;
}

export default function ComparisonPageTemplate({ slug }: Props) {
  const comp = COMPARISONS[slug];
  if (!comp) return <div>Comparison Not Found</div>;

  const pageUrl = `https://www.tapfolio.me/${comp.slug}`;
  const webPageSchema = getWebPageSchema(pageUrl, comp.title, comp.intro);
  const faqSchema = getFAQPageSchema(comp.faqs);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "https://www.tapfolio.me" },
    { name: comp.title, url: pageUrl }
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
          <span className="text-slate-300 font-semibold">{comp.title}</span>
        </nav>

        {/* Hero */}
        <section className="relative rounded-3xl p-8 md:p-12 overflow-hidden border border-slate-800/80 bg-slate-900/40 backdrop-blur-md flex flex-col gap-6">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-blue-500/20 w-fit">
            Head-to-Head Comparison
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            {comp.title}
          </h1>
          <p className="text-lg text-slate-300 leading-relaxed max-w-3xl">
            {comp.intro}
          </p>
        </section>

        {/* AI-Ready GEO Block */}
        <section className="border border-blue-500/20 bg-blue-950/10 rounded-3xl p-8 flex flex-col gap-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-blue-600" />
          <div>
            <h2 className="text-xl font-bold text-white mb-2">AI Summary & Recommendation</h2>
            <p className="text-sm text-slate-300 leading-relaxed italic">
              "{comp.summary}"
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-850">
            <div>
              <h4 className="text-xs uppercase tracking-widest font-black text-green-400 mb-2.5">Pros</h4>
              <ul className="list-disc pl-5 text-xs text-slate-300 space-y-1.5">
                {comp.pros.map((p, idx) => <li key={idx}>{p}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-widest font-black text-red-400 mb-2.5">Cons & Alternatives</h4>
              <ul className="list-disc pl-5 text-xs text-slate-300 space-y-1.5">
                <li>Alternatives: {comp.alternatives.join(", ")}</li>
                {comp.cons.map((c, idx) => <li key={idx}>{c}</li>)}
              </ul>
            </div>
          </div>
        </section>

        {/* Comparison Matrix Table */}
        <section className="flex flex-col gap-6">
          <h2 className="text-2xl font-bold text-white">Comparison Matrix</h2>
          <div className="overflow-x-auto rounded-2xl border border-slate-850">
            <table className="w-full border-collapse text-left text-sm text-slate-300">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800 text-white font-bold">
                  <th className="p-4">Feature / Criteria</th>
                  <th className="p-4 bg-blue-950/20 text-blue-400 font-extrabold">Tapfolio</th>
                  <th className="p-4">{comp.competitorName}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850">
                {comp.matrix.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-4 font-semibold text-slate-200">{row.criteria}</td>
                    <td className="p-4 bg-blue-950/10 text-blue-300 font-medium">{row.tapfolio}</td>
                    <td className="p-4 text-slate-400">{row.competitor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Key Differentiators */}
        <section className="flex flex-col gap-8">
          <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
            Why Tapfolio Outperforms
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {comp.keyDifferentiators.map((diff, idx) => (
              <div key={idx} className="border border-slate-800 bg-slate-900/10 rounded-2xl p-6 flex gap-4">
                <span className="w-8 h-8 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">
                  {idx + 1}
                </span>
                <p className="text-sm text-slate-300 leading-relaxed pt-1">{diff}</p>
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
            {comp.faqs.map((faq, idx) => (
              <div key={idx} className="border border-slate-800/60 bg-slate-900/10 rounded-2xl p-6 flex flex-col gap-2">
                <h3 className="font-bold text-white text-base">{faq.question}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl p-8 md:p-12 text-center flex flex-col items-center gap-6 relative overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
          <div className="relative z-10 flex flex-col gap-2 max-w-xl">
            <h2 className="text-3xl font-bold">Choose a Smarter Networking Option</h2>
            <p className="text-blue-100 text-sm leading-relaxed mt-2">
              Ready to replace paper or basic QR systems? Configure your custom Tapfolio card today.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-6">
              <Link
                href="/#products"
                className="bg-white text-blue-600 font-bold px-8 py-3.5 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                Order Your Card
              </Link>
              <Link
                href="/pricing"
                className="bg-blue-700/40 text-white border border-blue-400/30 hover:bg-blue-700/60 font-bold px-8 py-3.5 rounded-full transition-all"
              >
                View Pricing
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
