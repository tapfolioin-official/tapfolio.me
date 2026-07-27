'use client';

// Nibras Professional Portfolio Components
import Navigation from "@/components/portfolio/Navigation";
import ReadingProgressBar from "@/components/portfolio/ReadingProgressBar";
import NibrasHero from "@/components/portfolio/HeroSection";
import NibrasAbout from "@/components/portfolio/AboutSection";
import ProjectsSection from "@/components/portfolio/ProjectsSection";
import NibrasExperience from "@/components/portfolio/ExperienceSection";
import ServicesSection from "@/components/portfolio/ServicesSection";
import SocialProofSection from "@/components/portfolio/SocialProofSection";
import ArticlesSection from "@/components/portfolio/ArticlesSection";
import MediaKitSection from "@/components/portfolio/MediaKitSection";
import NibrasContact from "@/components/portfolio/ContactSection";
import FooterSection from "@/components/portfolio/FooterSection";

export default function NibrasulHaqqPage() {
  // Structured Data (JSON-LD) for Nibras Portfolio Entity SEO
  const portfolioSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": "https://www.tapfolio.me/nibrasulhaqq#profilepage",
        "url": "https://www.tapfolio.me/nibrasulhaqq",
        "name": "Mohammed Nibrasul Haqq — Portfolio & Case Studies",
        "isPartOf": {
          "@id": "https://www.tapfolio.me/#website"
        },
        "mainEntity": {
          "@id": "https://www.tapfolio.me/founders/mohammed-nibrasul-haqq#person"
        }
      },
      {
        "@type": "Person",
        "@id": "https://www.tapfolio.me/founders/mohammed-nibrasul-haqq#person",
        "name": "Mohammed Nibrasul Haqq",
        "alternateName": ["Nibras", "Nibrasul Haqq"],
        "jobTitle": "Co-Founder & Chief Technology Officer",
        "worksFor": {
          "@type": "Organization",
          "@id": "https://www.tapfolio.me/#organization",
          "name": "Tapfolio",
          "url": "https://www.tapfolio.me"
        },
        "url": "https://www.tapfolio.me/nibrasulhaqq",
        "sameAs": [
          "https://www.linkedin.com/in/mohammed-nibrasul-haqq-8267162ba/",
          "https://github.com/nibrasul",
          "https://x.com/Nibrasulhaqq"
        ],
        "knowsAbout": [
          "NFC Technology",
          "Software Architecture",
          "Next.js",
          "Flutter",
          "AI Automation",
          "SaaS Platform Engineering"
        ]
      },
      {
        "@type": "WebApplication",
        "@id": "https://www.tapfolio.me/#tapfolio-app",
        "name": "Tapfolio",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "All",
        "url": "https://www.tapfolio.me",
        "author": {
          "@id": "https://www.tapfolio.me/founders/mohammed-nibrasul-haqq#person"
        }
      }
    ]
  };

  return (
    <main className="relative w-full bg-[#0A0A0A] text-white overflow-x-hidden selection:bg-blue-600 selection:text-white">
      {/* Inject JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioSchema) }}
      />

      <ReadingProgressBar />
      <Navigation />
      <NibrasHero />
      <NibrasAbout />
      <ProjectsSection />
      <NibrasExperience />
      <ServicesSection />
      <SocialProofSection />
      <ArticlesSection />
      <MediaKitSection />
      <NibrasContact />
      <FooterSection />
    </main>
  );
}
