import React from 'react';
import type { Metadata } from 'next';
import LandingPageTemplate from '@/components/templates/LandingPageTemplate';
import { LANDING_PAGES } from '@/lib/content/landing-pages';

export const dynamic = 'force-static';
export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const page = LANDING_PAGES["nfc-card-for-business"];
  return {
    title: `${page.title} | Tapfolio Smart NFC Cards`,
    description: page.definition,
    alternates: {
      canonical: `https://www.tapfolio.me/nfc-card-for-business`
    }
  };
}

export default function Page() {
  return <LandingPageTemplate slug="nfc-card-for-business" />;
}
