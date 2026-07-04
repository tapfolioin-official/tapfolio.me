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

// Nibras Portfolio Components (Default Template)
import NibrasHero from "@/components/portfolio/HeroSection";
import NibrasPhilosophy from "@/components/portfolio/PhilosophySection";
import NibrasAbout from "@/components/portfolio/AboutSection";
import NibrasExperience from "@/components/portfolio/ExperienceSection";
import NibrasContact from "@/components/portfolio/ContactSection";
import NibrasBreathing from "@/components/portfolio/BreathingSpaceSection";

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

  return (
    <main className="relative w-full bg-[#0A0A0A] overflow-x-hidden">
      <div className="relative w-full">
        <div className="sticky top-0 z-0">
          <NibrasHero />
        </div>
        <div className="relative z-10 bg-[#0A0A0A]">
          <div className="sticky top-0 z-10">
            <NibrasPhilosophy />
          </div>
          <div className="relative z-20 bg-[#0A0A0A]">
            <NibrasAbout />
          </div>
        </div>
      </div>

      <div className="relative z-30 bg-[#0A0A0A]">
        <NibrasExperience />
        <NibrasBreathing />
      </div>

      <div className="relative w-full z-40 bg-[#0A0A0A]">
        <NibrasContact />
      </div>
    </main>
  );
}
