import React from 'react';
import type { Metadata } from 'next';
import ComparisonPageTemplate from '@/components/templates/ComparisonPageTemplate';
import { COMPARISONS } from '@/lib/content/comparison';

export const dynamic = 'force-static';
export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
  const comp = COMPARISONS["tapfolio-vs-popl"];
  return {
    title: `${comp.title} | Tapfolio Head-to-Head Comparison`,
    description: comp.intro,
    alternates: {
      canonical: `https://www.tapfolio.me/tapfolio-vs-popl`
    }
  };
}

export default function Page() {
  return <ComparisonPageTemplate slug="tapfolio-vs-popl" />;
}
