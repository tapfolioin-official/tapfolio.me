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
  metadataBase: new URL("https://tapfolio.me"),
  title: "Tapfolio | Smart NFC Professional Profiles & Digital Cards",
  description: "Redefine networking with Tapfolio. Built by Founder & CEO Abhinand and Co-founder & CTO Mohammed Nibrasul Haqq, providing contactless, smart NFC business cards.",
  keywords: ["NFC profile", "tap portfolio", "digital business card", "networking tracker", "Tapfolio"],
  openGraph: {
    type: "website",
    url: "https://tapfolio.me",
    title: "Tapfolio | Smart NFC Professional Profiles",
    description: "Redefine networking with Tapfolio. Built by Founder & CEO Abhinand and Co-founder & CTO Mohammed Nibrasul Haqq, providing contactless, smart NFC business cards.",
    images: [
      {
        url: "https://tapfolio.me/assets/og-image.png",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tapfolio | Smart NFC Professional Profiles",
    description: "Redefine networking with Tapfolio. Built by Founder & CEO Abhinand and Co-founder & CTO Mohammed Nibrasul Haqq, providing contactless, smart NFC business cards.",
    images: ["https://tapfolio.me/assets/og-image.png"],
  }
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Tapfolio",
  "url": "https://tapfolio.me",
  "logo": "https://tapfolio.me/assets/logo.png",
  "description": "Tapfolio provides smart NFC professional profiles and digital business cards.",
  "founder": [
    {
      "@type": "Person",
      "name": "Abhinand",
      "jobTitle": "Founder and CEO",
      "url": "https://tapfolio.me"
    }
  ],
  "founders": [
    {
      "@type": "Person",
      "name": "Abhinand",
      "jobTitle": "Founder and CEO"
    },
    {
      "@type": "Person",
      "name": "Mohammed Nibrasul Haqq",
      "jobTitle": "Co-founder and CTO"
    }
  ],
  "employee": [
    {
      "@type": "Person",
      "name": "Abhinand",
      "jobTitle": "Founder and CEO"
    },
    {
      "@type": "Person",
      "name": "Mohammed Nibrasul Haqq",
      "jobTitle": "Co-founder and CTO"
    }
  ]
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
