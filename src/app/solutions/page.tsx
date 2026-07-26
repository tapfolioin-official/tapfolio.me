import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/app/team/_components/Navbar';
import Footer from '@/app/team/_components/Footer';
import { INDUSTRIES } from '@/lib/content/industries';
import Link from 'next/link';

export const dynamic = 'force-static';
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Solutions | Tapfolio Industry NFC Solutions",
  description: "Explore dynamic, contactless networking layouts mapped specifically for your professional field, including doctors, lawyers, sales, and creators.",
  alternates: {
    canonical: "https://www.tapfolio.me/solutions"
  }
};

export default function Page() {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 font-sans flex flex-col pt-20">
      <Navbar />
      <main className="flex-1 w-full max-w-[1100px] mx-auto px-6 py-16 flex flex-col gap-12">
        <section className="text-center max-w-2xl mx-auto flex flex-col gap-4">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Directory</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white">Industry Solutions</h1>
          <p className="text-slate-400 leading-relaxed text-sm">Explore target configurations mapped specifically to build connections and drive leads in your field.</p>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {Object.entries(INDUSTRIES).map(([slug, ind]) => (
            <Link key={slug} href={`/solutions/${slug}`} className="border border-slate-800 bg-slate-900/10 hover:border-blue-500/40 rounded-2xl p-6 flex flex-col justify-between hover:bg-slate-900/20 transition-all">
              <div>
                <h3 className="font-bold text-white text-lg mb-2">{ind.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">{ind.subtitle}</p>
              </div>
              <span className="text-xs font-bold text-blue-400">View Solution →</span>
            </Link>
          ))}
        </section>
      </main>
      <Footer />
    </div>
  );
}
