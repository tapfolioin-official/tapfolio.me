import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '@/app/team/_components/Navbar';
import Footer from '@/app/team/_components/Footer';
import { PRODUCTS } from '@/lib/content/products';
import { getEnhancedProductSchema } from '@/lib/content/schema';
import { getBreadcrumbSchema } from '@/lib/geo-schemas';
import Link from 'next/link';

export const dynamic = 'force-static';
export const revalidate = 86400;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(PRODUCTS).map(slug => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const prod = PRODUCTS[slug];
  if (!prod) return { title: 'Product Not Found | Tapfolio' };
  return {
    title: `${prod.name} | Premium NFC Cards`,
    description: prod.description,
    alternates: {
      canonical: `https://www.tapfolio.me/products/${slug}`
    }
  };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const prod = PRODUCTS[slug];
  if (!prod) notFound();

  const pageUrl = `https://www.tapfolio.me/products/${slug}`;
  const productSchema = getEnhancedProductSchema(prod);
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Home', url: 'https://www.tapfolio.me' },
    { name: 'Pricing', url: 'https://www.tapfolio.me/pricing' },
    { name: prod.name, url: pageUrl }
  ]);

  const combinedSchema = {
    '@context': 'https://schema.org',
    '@graph': [productSchema, breadcrumbSchema]
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
      <main className="flex-1 w-full max-w-[1100px] mx-auto px-6 py-16 flex flex-col gap-16">
        <nav aria-label="Breadcrumb" className="text-xs text-slate-500 font-medium flex items-center gap-2">
          <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/pricing" className="hover:text-blue-400 transition-colors">Pricing</Link>
          <span>/</span>
          <span className="text-slate-300 font-semibold">{prod.name}</span>
        </nav>

        {/* Product Layout Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Left: Interactive design display */}
          <div className="border border-slate-800 bg-slate-900/40 rounded-3xl p-8 flex flex-col gap-6 items-center justify-center min-h-[350px] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px]" />
            <div className="w-64 h-40 rounded-2xl shadow-2xl border border-white/10 bg-gradient-to-tr from-slate-900 to-slate-850 flex flex-col justify-between p-6 rotate-3 hover:rotate-0 transition-transform duration-500">
              <span className="text-sm font-bold text-white tracking-widest">Tapfolio</span>
              <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">NFC ACTIVE CHIP</span>
            </div>
            <span className="text-xs text-slate-500 font-medium">3D WebGL preview config loading...</span>
          </div>

          {/* Right: Buy options */}
          <div className="flex flex-col gap-6">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">{prod.category}</span>
            <h1 className="text-3xl md:text-5xl font-bold text-white">{prod.name}</h1>
            <div className="flex items-baseline gap-1 text-2xl font-black text-white">
              <span>{prod.price}</span>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{prod.description}</p>
            <hr className="border-slate-800" />

            {/* AI Summary Block */}
            <div className="border border-blue-500/20 bg-blue-950/10 rounded-2xl p-6 flex flex-col gap-3">
              <h3 className="text-sm font-bold text-white">AI Quick Specs</h3>
              <p className="text-xs text-slate-400 italic">"Marine grade, edge custom printed, dynamic redirects."</p>
              <ul className="text-xs pl-4 list-disc text-slate-300">
                <li>Material: {prod.specifications["Material"] || "Premium Polymer"}</li>
                <li>Weight: {prod.specifications["Weight"] || "8 grams"}</li>
              </ul>
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-slate-500">Available Variants:</span>
              <div className="flex gap-2">
                {prod.variants.map((v, idx) => (
                  <span key={idx} className="bg-slate-900 border border-slate-800 text-xs px-3.5 py-2 rounded-xl flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: v.hex }} />
                    {v.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4 mt-4">
              <Link href="/contact" className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-4 rounded-full text-center transition-all shadow-lg shadow-blue-500/10">
                Order Your Custom Card
              </Link>
              <span className="text-[10px] text-slate-500 text-center">{prod.shipping}</span>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="flex flex-col gap-6">
          <h2 className="text-xl font-bold text-white">Product FAQs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {prod.faqs.map((faq, idx) => (
              <div key={idx} className="border border-slate-800 bg-slate-900/10 rounded-2xl p-6 flex flex-col gap-2">
                <h3 className="font-semibold text-white text-sm">{faq.question}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Reviews */}
        <section className="flex flex-col gap-6">
          <h2 className="text-xl font-bold text-white">Reviews & Ratings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {prod.reviews.map((rev, idx) => (
              <div key={idx} className="border border-slate-800 bg-slate-900/20 rounded-2xl p-6 flex flex-col gap-3">
                <div className="flex text-yellow-400 text-xs">{"★".repeat(Math.round(rev.rating))}</div>
                <p className="text-xs text-slate-350 italic">"{rev.comment}"</p>
                <span className="text-[10px] font-bold text-slate-500">— {rev.author}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
