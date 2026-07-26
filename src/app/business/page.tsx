import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/app/team/_components/Navbar';
import Footer from '@/app/team/_components/Footer';
import Link from 'next/link';

export const dynamic = 'force-static';
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "Business Pricing | Tapfolio",
  description: "Professional custom smart business cards for small businesses and independent executives.",
  alternates: {
    canonical: "https://www.tapfolio.me/business"
  }
};

export default function Page() {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 font-sans flex flex-col pt-20">
      <Navbar />
      <main className="flex-1 w-full max-w-[900px] mx-auto px-6 py-16 flex flex-col gap-10">
        <div className="border border-slate-800 bg-slate-900/40 backdrop-blur-md rounded-3xl p-8 md:p-12 flex flex-col gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px]" />
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Pricing Variant</span>
          <h1 className="text-3xl md:text-5xl font-bold text-white">Business Pricing</h1>
          <p className="text-slate-350 leading-relaxed text-sm md:text-base">Professional custom smart business cards for small businesses and independent executives.</p>
          <hr className="border-slate-800" />
          <div className="flex flex-col gap-4 text-sm text-slate-300">
            <h3 className="font-bold text-white text-base">Plan Features Included:</h3>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-4 list-disc">
              <li>Dynamic profile link updates anytime.</li>
              <li>Universal QR backup printed on the back.</li>
              <li>Comprehensive click tracking analytics.</li>
              <li>Free access to digital networking platforms.</li>
            </ul>
          </div>
          <div className="flex justify-start gap-4 mt-6">
            <Link href="/pricing" className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-8 py-3.5 rounded-full transition-all">
              Compare All Plans
            </Link>
            <Link href="/contact" className="border border-slate-700 hover:bg-slate-900 text-slate-300 font-bold text-xs px-8 py-3.5 rounded-full transition-all">
              Contact Sales
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
