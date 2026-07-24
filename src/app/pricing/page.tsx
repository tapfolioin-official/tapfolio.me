import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/app/team/_components/Navbar";
import Footer from "@/app/team/_components/Footer";
import { getWebPageSchema, getProductSchema, getFAQPageSchema, getBreadcrumbSchema } from "@/lib/geo-schemas";

export const metadata: Metadata = {
  title: "Pricing Plans | Tapfolio Smart NFC Cards & Team Software",
  description: "Explore flexible plans for Tapfolio digital cards. Choose lifetime free profiles with physical cards, premium customization upgrades, or enterprise team software.",
  alternates: {
    canonical: "https://tapfolio.me/pricing",
  },
  openGraph: {
    title: "Pricing Plans | Tapfolio Smart NFC Cards & Team Software",
    description: "Explore flexible plans for Tapfolio digital cards. Choose lifetime free profiles with physical cards, premium customization upgrades, or enterprise team software.",
    url: "https://tapfolio.me/pricing",
    type: "website",
    siteName: "Tapfolio",
  }
};

export default function PricingPage() {
  const pageUrl = "https://tapfolio.me/pricing";
  const webPageSchema = getWebPageSchema(pageUrl, "Pricing Plans", "Tapfolio pricing tiers and software plans.");
  const productSchema = getProductSchema("Tapfolio Premium Profile Upgrade", "Unlock advanced link tracking, custom branding, and dynamic video portfolio layouts.", "4.99");
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "https://tapfolio.me" },
    { name: "Pricing", url: pageUrl }
  ]);

  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [webPageSchema, productSchema, breadcrumbSchema]
  };

  const plans = [
    {
      name: "Basic (Free)",
      price: "$0",
      period: "forever",
      desc: "Perfect for students and independent professionals building their digital identity.",
      features: [
        "Dynamic digital business profile",
        "Unlimited contact downloads",
        "Up to 5 active links",
        "Standard QR code fallback",
        "Basic layout themes"
      ],
      cta: "Create Free Card",
      link: "/register"
    },
    {
      name: "Pro Card",
      price: "$29",
      period: "one-time payment",
      desc: "Get premium physical NFC hardware with a lifetime free dynamic pro profile.",
      features: [
        "Premium PVC, Wood, or Metal card",
        "Dynamic NDEF microchip mapping",
        "Custom logo engraving/printing",
        "Unlimited custom links & videos",
        "Advanced traffic analytics graphs"
      ],
      cta: "Configure Card",
      link: "/#order",
      popular: true
    },
    {
      name: "Enterprise Teams",
      price: "$4.99",
      period: "per user / month",
      desc: "Deploy, lock, and manage digital profiles for your entire organization.",
      features: [
        "Centralized team admin dashboard",
        "Lock corporate layout templates",
        "SSO (Okta/Microsoft Azure) integrations",
        "Bulk lead exports to Salesforce/HubSpot",
        "Aggregated department tap tracking"
      ],
      cta: "Contact Sales",
      link: "/contact"
    }
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
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Simple Pricing</span>
          <h1 className="text-5xl font-bold tracking-tight text-white">
            Choose Your <span className="text-blue-500">Plan</span>
          </h1>
          <p className="text-slate-400 leading-relaxed">
            From free digital profiles to premium metal cards and enterprise dashboards, select the perfect networking solution for your business.
          </p>
        </section>

        {/* Pricing Cards Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {plans.map((p, idx) => (
            <div
              key={idx}
              className={`border rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden backdrop-blur-md transition-all duration-300 hover:-translate-y-1 ${
                p.popular
                  ? "border-blue-500 bg-blue-950/10 shadow-lg shadow-blue-500/10"
                  : "border-slate-800 bg-slate-900/20"
              }`}
            >
              {p.popular && (
                <div className="absolute top-4 right-4 bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full">
                  Popular
                </div>
              )}
              <div className="flex flex-col gap-5">
                <div>
                  <h3 className="font-bold text-white text-xl">{p.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{p.desc}</p>
                </div>
                <div className="flex items-baseline gap-1 py-2 border-y border-slate-850">
                  <span className="text-4xl font-extrabold text-white">{p.price}</span>
                  <span className="text-xs text-slate-500">/ {p.period}</span>
                </div>
                <ul className="flex flex-col gap-3 py-2">
                  {p.features.map((f, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <span className="text-blue-500 shrink-0">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href={p.link}
                className={`w-full text-center font-bold text-xs py-3.5 rounded-full transition-all mt-8 ${
                  p.popular
                    ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                    : "bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-850"
                }`}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </section>

      </main>
      <Footer />
    </div>
  );
}
