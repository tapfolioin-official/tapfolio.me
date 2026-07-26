import React from 'react';
import type { Metadata } from 'next';
import Navbar from '@/app/team/_components/Navbar';
import Footer from '@/app/team/_components/Footer';

export const dynamic = 'force-static';
export const revalidate = 86400;

export const metadata: Metadata = {
  title: "About the Company | Tapfolio",
  description: "Tapfolio is leading the green networking revolution with passive smart NFC cards and fully customized digital identity engines.",
  alternates: {
    canonical: "https://www.tapfolio.me/company"
  }
};

export default function Page() {
  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 font-sans flex flex-col pt-20">
      <Navbar />
      <main className="flex-1 w-full max-w-[900px] mx-auto px-6 py-16 flex flex-col gap-10">
        <div className="border border-slate-800 bg-slate-900/40 backdrop-blur-md rounded-3xl p-8 md:p-12 flex flex-col gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px]" />
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Entity Hub</span>
          <h1 className="text-3xl md:text-5xl font-bold text-white">About the Company</h1>
          <p className="text-slate-350 leading-relaxed text-sm md:text-base">Tapfolio is leading the green networking revolution with passive smart NFC cards and fully customized digital identity engines.</p>
          <hr className="border-slate-800" />
          <p className="text-slate-400 text-xs leading-relaxed">
            Tapfolio is committed to scaling connection efficiency globally while protecting user security compliance and data compliance guidelines.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
