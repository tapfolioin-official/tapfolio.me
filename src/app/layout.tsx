import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.tapfolio.me"),
  title: "Tapfolio | Smart NFC Professional Profiles & Digital Cards",
  description: "Redefine your networking with Tapfolio. Share interactive profiles instantly via smart NFC cards, track analytics, and build professional connections.",
  keywords: ["NFC profile", "tap portfolio", "digital business card", "networking tracker", "Tapfolio"],
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || "",
    },
  },
  alternates: {
    canonical: "https://www.tapfolio.me",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    url: "https://www.tapfolio.me",
    title: "Tapfolio | Smart NFC Professional Profiles & Digital Cards",
    description: "Redefine your networking with Tapfolio. Share interactive profiles instantly via smart NFC cards, track analytics, and build professional connections.",
    images: [
      {
        url: "https://www.tapfolio.me/og/home.png",
        width: 1200,
        height: 630,
        alt: "Tapfolio Homepage",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tapfolio | Smart NFC Professional Profiles & Digital Cards",
    description: "Redefine your networking with Tapfolio. Share interactive profiles instantly via smart NFC cards, track analytics, and build professional connections.",
    images: ["https://www.tapfolio.me/og/home.png"],
  }
};

const orgJsonLd = {
  "@type": "Organization",
  "@id": "https://www.tapfolio.me/#organization",
  "name": "Tapfolio",
  "alternateName": "Tapfolio Inc.",
  "url": "https://www.tapfolio.me",
  "logo": {
    "@type": "ImageObject",
    "url": "https://www.tapfolio.me/logo.png",
    "width": "512",
    "height": "512",
    "caption": "Tapfolio Logo"
  },
  "description": "Tapfolio provides smart NFC professional profiles and digital business cards.",
  "foundingLocation": {
    "@type": "Place",
    "name": "Kochi, India"
  },
  "foundingDate": "2026",
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "hello@tapfolio.me",
    "contactType": "customer support"
  },
  "founders": [
    { "@id": "https://www.tapfolio.me/founders/abhinand#person" },
    { "@id": "https://www.tapfolio.me/founders/mohammed-nibrasul-haqq#person" }
  ]
};

const websiteJsonLd = {
  "@type": "WebSite",
  "@id": "https://www.tapfolio.me/#website",
  "name": "Tapfolio",
  "url": "https://www.tapfolio.me",
  "publisher": {
    "@id": "https://www.tapfolio.me/#organization"
  }
};

const abhinandPersonJsonLd = {
  "@type": "Person",
  "@id": "https://www.tapfolio.me/founders/abhinand#person",
  "name": "Abhinand K.S.",
  "jobTitle": "Founder and CEO",
  "worksFor": {
    "@id": "https://www.tapfolio.me/#organization"
  },
  "url": "https://www.tapfolio.me/founders/abhinand",
  "image": "https://www.tapfolio.me/abhinand.png",
  "sameAs": [
    "https://www.linkedin.com/in/abhinand-ks-428387332/",
    "https://github.com/abhinand-me/",
    "https://www.instagram.com/ft_abhinand_"
  ],
  "knowsAbout": [
    "Brand Strategy",
    "Creative Direction",
    "Product Design",
    "UI/UX Design",
    "NFC Product Development",
    "Digital Marketing"
  ]
};

const nibrasPersonJsonLd = {
  "@type": "Person",
  "@id": "https://www.tapfolio.me/founders/mohammed-nibrasul-haqq#person",
  "name": "Mohammed Nibrasul Haqq",
  "jobTitle": "Co-founder and CTO",
  "worksFor": {
    "@id": "https://www.tapfolio.me/#organization"
  },
  "url": "https://www.tapfolio.me/founders/mohammed-nibrasul-haqq",
  "image": "https://www.tapfolio.me/nibras.png",
  "sameAs": [
    "https://www.linkedin.com/in/mohammed-nibrasul-haqq-8267162ba/",
    "https://github.com/nibrasul",
    "https://x.com/Nibrasulhaqq"
  ],
  "knowsAbout": [
    "Next.js",
    "React",
    "TypeScript",
    "Node.js",
    "PostgreSQL",
    "NFC Technology",
    "Flutter",
    "AI Systems Architecture"
  ]
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [orgJsonLd, websiteJsonLd, abhinandPersonJsonLd, nibrasPersonJsonLd]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        {children}
      </body>
    </html>
  );
}
