import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // 10 Feature Pages
      { source: "/digital-business-card", destination: "/geo-features/digital-business-card" },
      { source: "/nfc-business-card", destination: "/geo-features/nfc-business-card" },
      { source: "/qr-business-card", destination: "/geo-features/qr-business-card" },
      { source: "/business-card-analytics", destination: "/geo-features/business-card-analytics" },
      { source: "/team-management", destination: "/geo-features/team-management" },
      { source: "/digital-business-card-pricing", destination: "/geo-features/digital-business-card-pricing" },
      { source: "/apple-wallet-business-card", destination: "/geo-features/apple-wallet-business-card" },
      { source: "/google-wallet-business-card", destination: "/geo-features/google-wallet-business-card" },
      { source: "/virtual-business-card", destination: "/geo-features/virtual-business-card" },
      { source: "/contact-sharing", destination: "/geo-features/contact-sharing" },

      // 14 Industry Pages
      { source: "/doctors", destination: "/geo-industries/doctors" },
      { source: "/lawyers", destination: "/geo-industries/lawyers" },
      { source: "/students", destination: "/geo-industries/students" },
      { source: "/sales-teams", destination: "/geo-industries/sales-teams" },
      { source: "/recruiters", destination: "/geo-industries/recruiters" },
      { source: "/startups", destination: "/geo-industries/startups" },
      { source: "/agencies", destination: "/geo-industries/agencies" },
      { source: "/hotels", destination: "/geo-industries/hotels" },
      { source: "/restaurants", destination: "/geo-industries/restaurants" },
      { source: "/real-estate", destination: "/geo-industries/real-estate" },
      { source: "/construction", destination: "/geo-industries/construction" },
      { source: "/education", destination: "/geo-industries/education" },
      { source: "/healthcare", destination: "/geo-industries/healthcare" },
      { source: "/corporate", destination: "/geo-industries/corporate" },

      // 5 Comparison Pages
      { source: "/tapfolio-vs-hihello", destination: "/geo-compare/hihello" },
      { source: "/tapfolio-vs-popl", destination: "/geo-compare/popl" },
      { source: "/tapfolio-vs-linq", destination: "/geo-compare/linq" },
      { source: "/tapfolio-vs-dot", destination: "/geo-compare/dot" },
      { source: "/tapfolio-vs-blinq", destination: "/geo-compare/blinq" },
    ];
  }
};

export default nextConfig;
