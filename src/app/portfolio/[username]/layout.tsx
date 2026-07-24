import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const formattedName = username.charAt(0).toUpperCase() + username.slice(1);

  return {
    title: `${formattedName} | Interactive Portfolio Showcase`,
    description: `Explore ${formattedName}'s visual showcase, projects, philosophy, and professional networks powered by Tapfolio.`,
    alternates: {
      canonical: `https://www.tapfolio.me/portfolio/${username}`,
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `${formattedName} | Showcase`,
      description: `Premium interactive visual layout for ${formattedName}.`,
      type: 'profile',
      url: `https://www.tapfolio.me/portfolio/${username}`,
      siteName: 'Tapfolio',
    },
  };
}

export default function PortfolioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
