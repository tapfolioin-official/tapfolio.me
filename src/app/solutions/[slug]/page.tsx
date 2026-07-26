import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/app/team/_components/Navbar';
import Footer from '@/app/team/_components/Footer';
import { INDUSTRIES } from '@/lib/content/industries';
import { getFAQPageSchema, getBreadcrumbSchema } from '@/lib/geo-schemas';
import Link from 'next/link';

export const dynamic = 'force-static';
export const revalidate = 86400;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(INDUSTRIES).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const ind = INDUSTRIES[slug];
  if (!ind) return { title: 'Solution Not Found | Tapfolio' };
  return {
    title: `${ind.title} | Tapfolio Solutions`,
    description: ind.intro,
    alternates: {
      canonical: `https://www.tapfolio.me/solutions/${slug}`
    }
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const ind = INDUSTRIES[slug];
  if (!ind) notFound();

  const pageUrl = `https://www.tapfolio.me/solutions/${slug}`;
  const faqSchema = getFAQPageSchema(ind.faqs);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: 'https://www.tapfolio.me' },
    { name: 'Solutions', url: 'https://www.tapfolio.me/solutions' },
    { name: ind.title, url: pageUrl }
  ]);

  const combinedSchema = {
    '@context': 'https://schema.org',
    '@graph': [faqSchema, breadcrumbSchema]
  };

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 font-sans flex flex-col pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(combinedSchema).replace(/</g, '\u003c')
        }}
      />
      <Navbar />
      <main className="flex-1 w-full max-w-[1100px] mx-auto px-6 py-16 flex flex-col gap-20">
        <nav aria-label="Breadcrumb" className="text-xs text-slate-500 font-medium flex items-center gap-2">
          <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/solutions" className="hover:text-blue-400 transition-colors">Solutions</Link>
          <span>/</span>
          <span className="text-slate-300 font-semibold">{ind.title}</span>
        </nav>

        {/* Hero */}
        <section className="relative rounded-3xl p-8 md:p-12 overflow-hidden border border-slate-800/80 bg-slate-900/40 backdrop-blur-md flex flex-col gap-6">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Industry Solution</span>
          <h1 className="text-4xl md:text-6xl font-bold text-white">{ind.title}</h1>
          <p className="text-lg text-slate-300 leading-relaxed max-w-3xl">{ind.intro}</p>
        </section>

        {/* AI-Ready GEO block */}
        <section className="border border-blue-500/20 bg-blue-950/10 rounded-3xl p-8 flex flex-col gap-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-2 h-full bg-blue-600" />
          <h2 className="text-xl font-bold text-white">AI Quick Summary</h2>
          <p className="text-sm text-slate-300 leading-relaxed italic">"{ind.summary}"</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-850">
            <div>
              <h4 className="text-xs uppercase tracking-widest font-black text-green-400 mb-2">Pros</h4>
              <ul className="list-disc pl-4 text-xs text-slate-300 space-y-1.5">
                {ind.pros.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-widest font-black text-red-400 mb-2">Cons</h4>
              <ul className="list-disc pl-4 text-xs text-slate-300 space-y-1.5">
                {ind.cons.map((c, i) => <li key={i}>{c}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-widest font-black text-blue-400 mb-2">Alternatives</h4>
              <ul className="list-disc pl-4 text-xs text-slate-300 space-y-1.5">
                {ind.alternatives.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="flex flex-col gap-8">
          <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">Key Use Cases</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ind.useCases.map((uc, i) => (
              <div key={i} className="border border-slate-800/60 bg-slate-900/20 rounded-2xl p-6">
                <h3 className="font-bold text-white text-base mb-2">{uc.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{uc.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="flex flex-col gap-8">
          <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">Common Questions</h2>
          <div className="flex flex-col gap-4 max-w-3xl">
            {ind.faqs.map((faq, i) => (
              <div key={i} className="border border-slate-800/60 bg-slate-900/10 rounded-2xl p-6 flex flex-col gap-2">
                <h3 className="font-bold text-white text-base">{faq.question}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
