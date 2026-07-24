import type { Metadata } from "next";
import HomeClient from "./_components/HomeClient";

export const metadata: Metadata = {
  title: "Tapfolio | Smart NFC Professional Profiles & Digital Cards",
  description: "Redefine your networking with Tapfolio. Share interactive profiles instantly via smart NFC cards, track analytics, and build professional connections.",
  keywords: ["NFC profile", "tap portfolio", "digital business card", "networking tracker", "Tapfolio"],
  metadataBase: new URL("https://www.tapfolio.me"),
  alternates: {
    canonical: "https://www.tapfolio.me",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Tapfolio | Smart NFC Professional Profiles & Digital Cards",
    description: "Redefine your networking with Tapfolio. Share interactive profiles instantly via smart NFC cards, track analytics, and build professional connections.",
    url: "https://www.tapfolio.me",
    type: "website",
    siteName: "Tapfolio",
    images: [
      {
        url: "https://www.tapfolio.me/og/home.png",
        width: 1200,
        height: 630,
        alt: "Tapfolio Home",
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

export default function Home() {
  return <HomeClient />;
}
