import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Mohammed Nibrasul Haqq | Co-founder & CTO | Tapfolio",
  description: "Explore Mohammed Nibrasul Haqq's visual showcase, projects, philosophy, and professional networks powered by Tapfolio.",
  alternates: {
    canonical: "https://www.tapfolio.me/nibrasulhaqq",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Mohammed Nibrasul Haqq | Showcase",
    description: "Premium interactive visual layout for Mohammed Nibrasul Haqq.",
    type: 'profile',
    url: "https://www.tapfolio.me/nibrasulhaqq",
    siteName: 'Tapfolio',
  },
};

export default function NibrasulHaqqLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
