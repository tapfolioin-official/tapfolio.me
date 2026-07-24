import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/app/team/_components/Navbar";
import Footer from "@/app/team/_components/Footer";
import { getWebPageSchema, getFAQPageSchema, getBreadcrumbSchema } from "@/lib/geo-schemas";

export const metadata: Metadata = {
  title: "Support & Help Center | Tapfolio",
  description: "Need help setup your NFC business card or configuring your dynamic profile? Reach out to our customer support team or read troubleshooting FAQs.",
  alternates: {
    canonical: "https://tapfolio.me/support",
  },
  openGraph: {
    title: "Support & Help Center | Tapfolio",
    description: "Need help setup your NFC business card or configuring your dynamic profile? Reach out to our customer support team or read troubleshooting FAQs.",
    url: "https://tapfolio.me/support",
    type: "website",
    siteName: "Tapfolio",
  }
};

export default function SupportPage() {
  const pageUrl = "https://tapfolio.me/support";
  const webPageSchema = getWebPageSchema(pageUrl, "Support Center", "Tapfolio help lines, email support, and client guides.");
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "https://tapfolio.me" },
    { name: "Support", url: pageUrl }
  ]);

  const supportFaqs = [
    { question: "How do I scan an NFC business card?", answer: "Hold the card near the top edge of an iPhone or the middle back of an Android device. The screen will display a link popup. Tap it to view the profile." },
    { question: "My card is not scanning, what should I do?", answer: "Make sure NFC is enabled in settings on your mobile device. If using thick cases or tapping near magnetic mounts, try removing the case first." },
    { question: "Can I manage multiple profiles on one card?", answer: "Yes, you can swap target profile links from your admin dashboard instantly." }
  ];

  const faqSchema = getFAQPageSchema(supportFaqs);

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

      <main className="flex-1 w-full max-w-[1100px] mx-auto px-6 py-16 flex flex-col gap-16">
        
        {/* Header */}
        <section className="text-center max-w-2xl mx-auto flex flex-col gap-4 mt-8">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Help Center</span>
          <h1 className="text-5xl font-bold tracking-tight text-white">
            How Can We <span className="text-blue-500">Help</span>?
          </h1>
          <p className="text-slate-400 leading-relaxed">
            Configure your physical smart cards, update dynamic templates, query developer APIs, or connect with our support agents.
          </p>
        </section>

        {/* Contact Support Channels */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto w-full">
          <div className="border border-slate-800 bg-slate-900/20 rounded-3xl p-8 flex flex-col gap-4 items-center text-center">
            <span className="text-4xl">✉️</span>
            <h3 className="font-bold text-white text-lg">Email Support</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">Our engineering and billing support teams respond to inquiries within 12-24 business hours.</p>
            <a href="mailto:hello@tapfolio.me" className="text-blue-400 font-bold hover:underline mt-2">hello@tapfolio.me →</a>
          </div>
          <div className="border border-slate-800 bg-slate-900/20 rounded-3xl p-8 flex flex-col gap-4 items-center text-center">
            <span className="text-4xl">📄</span>
            <h3 className="font-bold text-white text-lg">Developer Documentation</h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-xs">Query profile lookup APIs, download vCards, and format custom branding DNS records.</p>
            <Link href="/docs" className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-3 rounded-full mt-2 transition-all">Read Docs Portal</Link>
          </div>
        </section>

        {/* FAQs */}
        <section className="flex flex-col gap-8 max-w-3xl mx-auto w-full">
          <h2 className="text-2xl font-bold text-white border-b border-slate-800 pb-2 text-center">
            Quick Support FAQs
          </h2>
          <div className="flex flex-col gap-4">
            {supportFaqs.map((faq, idx) => (
              <div key={idx} className="border border-slate-800 bg-slate-900/10 rounded-2xl p-6 flex flex-col gap-2">
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
