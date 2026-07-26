import React from 'react';
import type { Metadata } from 'next';
import LandingPageTemplate from '@/components/templates/LandingPageTemplate';
import { LANDING_PAGES } from '@/lib/content/landing-pages';

export const dynamic = 'force-static';
export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const page = LANDING_PAGES["nfc-visiting-card"];
  return {
    title: `${page.title} | Tapfolio Smart NFC Cards`,
    description: page.definition,
    alternates: {
      canonical: `https://www.tapfolio.me/nfc-visiting-card`
    }
  };
}

export default function Page() {
  return <LandingPageTemplate slug="nfc-visiting-card" />;
}
