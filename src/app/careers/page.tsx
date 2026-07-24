import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/app/team/_components/Navbar";
import Footer from "@/app/team/_components/Footer";
import { getWebPageSchema, getBreadcrumbSchema } from "@/lib/geo-schemas";

export const metadata: Metadata = {
  title: "Careers at Tapfolio | Build the Future of Digital Identity",
  description: "Join the team redefining professional networking. Explore open job listings and career opportunities in engineering, product design, and growth marketing.",
  alternates: {
    canonical: "https://tapfolio.me/careers",
  },
  openGraph: {
    title: "Careers at Tapfolio | Build the Future of Digital Identity",
    description: "Join the team redefining professional networking. Explore open job listings and career opportunities in engineering, product design, and growth marketing.",
    url: "https://tapfolio.me/careers",
    type: "website",
    siteName: "Tapfolio",
  }
};

export default function CareersPage() {
  const pageUrl = "https://tapfolio.me/careers";
  const webPageSchema = getWebPageSchema(pageUrl, "Careers at Tapfolio", "Tapfolio job listings and startup opportunities.");
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "https://tapfolio.me" },
    { name: "Careers", url: pageUrl }
  ]);

  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [webPageSchema, breadcrumbSchema]
  };

  const jobs = [
    { title: "Senior Full Stack Engineer (Next.js)", dept: "Engineering", loc: "Kochi, India / Remote", type: "Full-time" },
    { title: "NFC Mobile Developer (Flutter)", dept: "Engineering", loc: "Kochi, India / Hybrid", type: "Full-time" },
    { title: "Brand Strategist & Product Designer", dept: "Product & Design", loc: "Kochi, India / Hybrid", type: "Full-time" },
    { title: "Growth Marketing Specialist", dept: "Growth & Operations", loc: "Remote (Global)", type: "Contract" }
  ];

  return (
    <div className="bg-slate-950 min-h-screen text-slate-100 font-sans selection:bg-blue-600/30 selection:text-blue-300 flex flex-col pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(combinedSchema).replace(/</g, "\\u003c"),
        }}
      />
      <Navbar />

      <main className="flex-1 w-full max-w-[1100px] mx-auto px-6 py-16 flex flex-col gap-16">
        
        {/* Header */}
        <section className="text-center max-w-2xl mx-auto flex flex-col gap-4 mt-8">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Join Our Team</span>
          <h1 className="text-5xl font-bold tracking-tight text-white">
            Build the Future of <span className="text-blue-500">Identity</span>
          </h1>
          <p className="text-slate-400 leading-relaxed">
            We are looking for creative thinkers, developers, and designers to help build the world's most performant contactless networking platform.
          </p>
        </section>

        {/* Core Culture Section */}
        <section className="bg-slate-900/40 border border-slate-800 rounded-3xl p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-white text-lg">💡 Innovation First</h3>
            <p className="text-xs text-slate-400 leading-relaxed">We push standard web limits to compile blazing fast profile page indexes.</p>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-white text-lg">🌿 Eco-Friendly</h3>
            <p className="text-xs text-slate-400 leading-relaxed">We aim to completely eradicate traditional paper business cards.</p>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-bold text-white text-lg">🛡️ High Privacy</h3>
            <p className="text-xs text-slate-400 leading-relaxed">We guarantee safe data controls across all professional connections.</p>
          </div>
        </section>

        {/* Job Listings */}
        <section className="flex flex-col gap-8">
          <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2">
            Open Opportunities
          </h2>
          <div className="flex flex-col gap-4">
            {jobs.map((j, idx) => (
              <div
                key={idx}
                className="border border-slate-800/80 bg-slate-900/20 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-blue-500/50 transition-all"
              >
                <div className="flex flex-col gap-1.5">
                  <h3 className="font-bold text-white text-lg">{j.title}</h3>
                  <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold">
                    <span>🏢 {j.dept}</span>
                    <span>•</span>
                    <span>📍 {j.loc}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
                  <span className="bg-slate-800 text-slate-300 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-slate-700">
                    {j.type}
                  </span>
                  <a
                    href="mailto:careers@tapfolio.me"
                    className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all"
                  >
                    Apply Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
