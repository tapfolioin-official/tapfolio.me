import { Metadata } from 'next';

interface MetadataParams {
  title: string;
  description: string;
  path: string;
  imageUrl?: string;
  keywords?: string[];
}

/**
 * Helper to generate page-level SEO Metadata dynamically in Next.js.
 */
export function generatePageMetadata(params: MetadataParams): Metadata {
  const host = 'https://www.tapfolio.me';
  const url = `${host}${params.path}`;
  const defaultImage = `${host}/logo.png`;
  const finalImage = params.imageUrl || defaultImage;

  return {
    title: `${params.title} | Tapfolio`,
    description: params.description,
    keywords: params.keywords || ["NFC profile", "tap portfolio", "digital business card", "networking tracker", "Tapfolio"],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: params.title,
      description: params.description,
      url: url,
      siteName: 'Tapfolio',
      images: [
        {
          url: finalImage,
          width: 1200,
          height: 630,
          alt: params.title,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: params.title,
      description: params.description,
      images: [finalImage],
    },
  };
}
