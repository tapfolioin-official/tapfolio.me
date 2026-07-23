'use client';

import { useParams, notFound } from 'next/navigation';
import { useEffect, useState } from 'react';

// Abhinand Portfolio Components
import AbhinandHero from "@/components/portfolio/abhinand/HeroSection";
import AbhinandPhilosophy from "@/components/portfolio/abhinand/PhilosophySection";
import AbhinandAbout from "@/components/portfolio/abhinand/AboutSection";
import AbhinandExperience from "@/components/portfolio/abhinand/ExperienceSection";
import AbhinandContact from "@/components/portfolio/abhinand/ContactSection";
import AbhinandBreathing from "@/components/portfolio/abhinand/BreathingSpaceSection";

// Nibras Professional Portfolio Components
import Navigation from "@/components/portfolio/Navigation";
import NibrasHero from "@/components/portfolio/HeroSection";
import NibrasAbout from "@/components/portfolio/AboutSection";
import ProjectsSection from "@/components/portfolio/ProjectsSection";
import NibrasExperience from "@/components/portfolio/ExperienceSection";
import ServicesSection from "@/components/portfolio/ServicesSection";
import ArticlesSection from "@/components/portfolio/ArticlesSection";
import MediaKitSection from "@/components/portfolio/MediaKitSection";
import NibrasContact from "@/components/portfolio/ContactSection";
import FooterSection from "@/components/portfolio/FooterSection";

export default function DynamicPortfolioPage() {
  const params = useParams();
  const rawUsername = params.username as string;
  const username = rawUsername ? rawUsername.toLowerCase().trim() : '';

  const [loading, setLoading] = useState(true);
  const [profileExists, setProfileExists] = useState<boolean | null>(null);

  useEffect(() => {
    if (!username) {
      setProfileExists(false);
      setLoading(false);
      return;
    }

    // Bypass check for static template users to ensure showcase pages work instantly
    if (username === 'abhinand' || username === 'nibras') {
      setProfileExists(true);
      setLoading(false);
      return;
    }

    // Verify user profile exists in database
    fetch(`/api/profile/${username}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.profile) {
          setProfileExists(true);
        } else {
          setProfileExists(false);
        }
      })
      .catch((err) => {
        console.error('Failed to verify portfolio profile:', err);
        setProfileExists(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [username]);

  if (loading) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', background: '#0A0A0A', color: 'white', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading visual portfolio showcase...</p>
      </div>
    );
  }

  if (profileExists === false) {
    return notFound();
  }

  if (username === 'abhinand') {
    return (
      <main className="relative w-full bg-[#0A0A0A] overflow-x-hidden">
        <div className="relative w-full">
          <div className="sticky top-0 z-0">
            <AbhinandHero />
          </div>
          <div className="relative z-10 bg-[#0A0A0A]">
            <div className="sticky top-0 z-10">
              <AbhinandPhilosophy />
            </div>
            <div className="relative z-20 bg-[#0A0A0A]">
              <AbhinandAbout />
            </div>
          </div>
        </div>

        <div className="relative z-30 bg-[#0A0A0A]">
          <AbhinandExperience />
          <AbhinandBreathing />
        </div>

        <div className="relative w-full z-40 bg-[#0A0A0A]">
          <AbhinandContact />
        </div>
      </main>
    );
  }

  // Modern Professional Portfolio Layout for Nibras
  return (
    <main className="relative w-full bg-[#0A0A0A] text-white overflow-x-hidden selection:bg-blue-600 selection:text-white">
      <Navigation />
      <NibrasHero />
      <NibrasAbout />
      <ProjectsSection />
      <NibrasExperience />
      <ServicesSection />
      <ArticlesSection />
      <MediaKitSection />
      <NibrasContact />
      <FooterSection />
    </main>
  );
}
