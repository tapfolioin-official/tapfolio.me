"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import LenisScrollProvider from "@/lib/LenisScrollProvider";
import Navbar from "@/components/navigation/Navbar";
import Preloader from "@/components/hero/Preloader";

// Above the fold - eager import for instant LCP
import HeroSection from "@/components/sections/HeroSection";
import TrustedBySection from "@/components/sections/TrustedBySection";
import MetricsStrip from "@/components/sections/MetricsStrip";

// Below the fold - dynamic lazy loading to eliminate mobile TBT and payload
const WhyTapfolioSection = dynamic(() => import("@/components/sections/WhyTapfolioSection"));
const ProductsSection = dynamic(() => import("@/components/sections/ProductsSection"));
const HowItWorksSection = dynamic(() => import("@/components/sections/HowItWorksSection"));
const EcosystemBento = dynamic(() => import("@/components/sections/EcosystemBento"));
const SecuritySection = dynamic(() => import("@/components/sections/SecuritySection"));
const LiveDemoSection = dynamic(() => import("@/components/sections/LiveDemoSection"));
const TrustCompanySection = dynamic(() => import("@/components/sections/TrustCompanySection"));
const ConfiguratorSection = dynamic(() => import("@/components/sections/ConfiguratorSection"));
const FooterSection = dynamic(() => import("@/components/sections/FooterSection"));

export default function HomeClient() {
  const [preloaderComplete, setPreloaderComplete] = useState(false);

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-blue-200">
      <Navbar />

      {!preloaderComplete && (
        <Preloader onComplete={() => setPreloaderComplete(true)} />
      )}

      <LenisScrollProvider>
        <div className="flex flex-col relative w-full overflow-hidden">
          {/* Main Page Flow (12 Sections) */}
          <main className="w-full flex flex-col">
            <HeroSection />
            <TrustedBySection />
            <MetricsStrip />
            <WhyTapfolioSection />
            <ProductsSection />
            <HowItWorksSection />
            <EcosystemBento />
            <SecuritySection />
            <LiveDemoSection />
            <TrustCompanySection />
            <ConfiguratorSection />
          </main>

          <FooterSection />
        </div>
      </LenisScrollProvider>
    </div>
  );
}
