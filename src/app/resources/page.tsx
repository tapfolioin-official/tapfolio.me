import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/app/team/_components/Navbar';
import Footer from '@/app/team/_components/Footer';
import Link from 'next/link';

export const dynamic = 'force-static';
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Resource Center | Tapfolio",
  description: "Find blog guides, technical documentation, design templates, and case studies to maximize your dynamic networking tools.",
  alternates: {
    canonical: "https://www.tapfolio.me/resources"
  }
};

export default function Page() {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 font-sans flex flex-col pt-20">
      <Navbar />
      <main className="flex-1 w-full max-w-[1100px] mx-auto px-6 py-16 flex flex-col gap-12">
        <section className="text-center max-w-2xl mx-auto flex flex-col gap-4">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Resource Center</span>
          <h1 className="text-4xl md:text-5xl font-bold text-white">Guides & Resources</h1>
          <p className="text-slate-400 leading-relaxed text-sm">Everything you need to configure your NFC card, build your digital profile, or connect team software dashboards.</p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-slate-800 bg-slate-900/10 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-white text-lg mb-2">Tapfolio Insights (Blog)</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">Read our guides on NFC trends, contactless networking security, and optimization tips.</p>
            </div>
            <Link href="/blog" className="text-xs font-bold text-blue-400">Visit Blog →</Link>
          </div>

          <div className="border border-slate-800 bg-slate-900/10 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-white text-lg mb-2">Developer API Docs</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">Query developer REST integrations, configure webhook triggers, or fetch vCard details.</p>
            </div>
            <Link href="/docs" className="text-xs font-bold text-blue-400">Read API Docs →</Link>
          </div>

          <div className="border border-slate-800 bg-slate-900/10 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-white text-lg mb-2">Case Studies</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">See how teams and corporations deploy Tapfolio to double CRM registrations at meetups.</p>
            </div>
            <Link href="/customer-success" className="text-xs font-bold text-blue-400">Read Success Stories →</Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
