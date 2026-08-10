import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/app/team/_components/Navbar";
import Footer from "@/app/team/_components/Footer";
import { getWebPageSchema, getBreadcrumbSchema } from "@/lib/geo-schemas";

export const metadata: Metadata = {
  title: "Refund & Return Policy | Tapfolio Smart Cards",
  description: "Read Tapfolio's refund, replacement, and warranty guidelines for our PVC, wooden, and metal NFC business card hardware products.",
  alternates: {
    canonical: "https://tapfolio.me/refund",
  },
  openGraph: {
    title: "Refund & Return Policy | Tapfolio Smart Cards",
    description: "Read Tapfolio's refund, replacement, and warranty guidelines for our PVC, wooden, and metal NFC business card hardware products.",
    url: "https://tapfolio.me/refund",
    type: "website",
    siteName: "Tapfolio",
  }
};

export default function RefundPage() {
  const pageUrl = "https://tapfolio.me/refund";
  const webPageSchema = getWebPageSchema(pageUrl, "Refund Policy", "Tapfolio returns, refunds, and hardware warranty details.");
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Home", url: "https://tapfolio.me" },
    { name: "Refund Policy", url: pageUrl }
  ]);

  const combinedSchema = {
    "@context": "https://schema.org",
    "@graph": [webPageSchema, breadcrumbSchema]
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

      <main className="flex-1 w-full max-w-[800px] mx-auto px-6 py-16 flex flex-col gap-10">
        
        {/* Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="text-xs text-slate-500 font-medium flex items-center gap-2">
          <Link href="/" className="hover:text-blue-400 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-slate-300 font-semibold">Refund Policy</span>
        </nav>

        {/* Content */}
        <article className="border border-slate-800/80 bg-slate-900/40 backdrop-blur-md rounded-3xl p-8 md:p-12 flex flex-col gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
          
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white leading-tight border-b border-slate-800 pb-4">
            Refund & Return Policy
          </h1>

          <div className="text-sm text-slate-300 space-y-6 leading-relaxed">
            <p>
              Thank you for purchasing physical NFC hardware assets from Tapfolio. We pride ourselves on the build quality of our PVC, wooden, and anodized steel smart business cards.
            </p>

            <h2 className="text-white font-bold text-lg pt-2">1. Custom Engraved & Printed Cards</h2>
            <p>
              Because custom-engraved metal, wooden, or printed PVC cards are personalized with your unique logo, names, and credentials, **we do not accept returns or offer refunds** for these items once production begins, unless they arrive damaged or defective.
            </p>

            <h2 className="text-white font-bold text-lg pt-2">2. Hardware Defect & Replacement Warranty</h2>
            <p>
              Every Tapfolio card includes a **lifetime warranty** against microchip failures. If your card's internal NFC tag stops scanning or fails to operate under normal usage parameters, contact us at <a href="mailto:tapfolio.in@gmail.com" className="text-blue-400 hover:underline">tapfolio.in@gmail.com</a>. We will ship a replacement card of the same tier for free.
            </p>

            <h2 className="text-white font-bold text-lg pt-2">3. Shipping Discrepancies</h2>
            <p>
              Please inspect your package upon receipt. If the custom engraving contains errors compared to your dashboard design preview or if the card arrives bent or damaged during transport, report it to our support line within 7 business days for a free replacement reprint.
            </p>

            <h2 className="text-white font-bold text-lg pt-2">4. Software Subscription Billing</h2>
            <p>
              For enterprise plans and profile software upgrades, billing occurs monthly or annually. You can cancel your subscription at any time via your settings dashboard. Cancellations apply to the next billing cycle, and no partial refunds are provided for active months.
            </p>
          </div>
        </article>

      </main>
      <Footer />
    </div>
  );
}
