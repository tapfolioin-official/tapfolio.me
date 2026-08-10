import React from "react";
import Link from "next/link";
import Navbar from "@/components/navigation/Navbar";
import FooterSection from "@/components/sections/FooterSection";
import { ShieldCheck, Lock, Database, Trash2, Eye, UserCheck, CheckCircle2, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Tapfolio",
  description: "Read Tapfolio's Privacy Policy. Learn how we secure, process, and protect your digital profile data, contactless records, and account information.",
  alternates: {
    canonical: "https://www.tapfolio.me/privacy",
  },
  metadataBase: new URL("https://www.tapfolio.me"),
  keywords: ["NFC profile", "tap portfolio", "digital business card", "networking tracker", "Tapfolio", "privacy policy"],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Privacy Policy | Tapfolio",
    description: "Read Tapfolio's Privacy Policy. Learn how we secure, process, and protect your digital profile data, contactless records, and account information.",
    url: "https://www.tapfolio.me/privacy",
    type: "website",
    siteName: "Tapfolio",
    images: [
      {
        url: "https://www.tapfolio.me/og/privacy.png",
        width: 1200,
        height: 630,
        alt: "Privacy Policy Tapfolio",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | Tapfolio",
    description: "Read Tapfolio's Privacy Policy. Learn how we secure, process, and protect your digital profile data, contactless records, and account information.",
    images: ["https://www.tapfolio.me/og/privacy.png"],
  }
};

export default function PrivacyPolicy() {
  const highlights = [
    {
      icon: <Lock size={22} className="text-blue-600" />,
      title: "Encrypted & Secure",
      desc: "All profile transmissions and API endpoints use TLS 1.3 encryption."
    },
    {
      icon: <Eye size={22} className="text-blue-600" />,
      title: "Granular Privacy",
      desc: "You control which fields (email, phone, socials) are visible publicly."
    },
    {
      icon: <Database size={22} className="text-blue-600" />,
      title: "No Data Selling",
      desc: "We never sell, rent, or monetize your personal or networking data."
    },
    {
      icon: <Trash2 size={22} className="text-blue-600" />,
      title: "One-Click Deletion",
      desc: "Permanently delete your profile, avatars, and history at any time."
    }
  ];

  return (
    <div className="bg-white min-h-screen font-sans text-gray-900 selection:bg-blue-200 flex flex-col">
      <Navbar />

      <main className="flex-1 w-full pt-28 pb-20">
        {/* Hero Section */}
        <section className="w-full bg-gradient-to-b from-gray-50/80 via-gray-50/40 to-white py-16 border-b border-gray-100">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="max-w-3xl">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-100 mb-6">
                <ShieldCheck size={14} /> Trust & Transparency
              </span>
              <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-gray-950 tracking-tight mb-6">
                Privacy Policy
              </h1>
              <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-6">
                Your privacy and data ownership are fundamental to how TapFolio is built. Here is a clear breakdown of how we safeguard your identity and connections.
              </p>
              <div className="flex items-center gap-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                <span>Last Updated: August 2026</span>
                <span>•</span>
                <span>Version 2.4</span>
              </div>
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
              {highlights.map((item, idx) => (
                <div 
                  key={idx}
                  className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300 flex flex-col"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 text-base mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Policy Content Sections */}
        <div className="max-w-[1200px] mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Sidebar / Table of Contents */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-28 space-y-4">
            <div className="bg-gray-50/80 border border-gray-100 rounded-3xl p-6 shadow-sm">
              <h4 className="font-bold text-xs uppercase tracking-widest text-gray-400 mb-4">
                Policy Navigation
              </h4>
              <nav className="space-y-2 text-sm font-medium">
                <a href="#intro" className="block text-gray-600 hover:text-blue-600 transition-colors py-1">1. Introduction</a>
                <a href="#collection" className="block text-gray-600 hover:text-blue-600 transition-colors py-1">2. Information We Collect</a>
                <a href="#usage" className="block text-gray-600 hover:text-blue-600 transition-colors py-1">3. How We Use Your Data</a>
                <a href="#cookies" className="block text-gray-600 hover:text-blue-600 transition-colors py-1">4. Cookies & Session Storage</a>
                <a href="#sharing" className="block text-gray-600 hover:text-blue-600 transition-colors py-1">5. Data Sharing & Third Parties</a>
                <a href="#rights" className="block text-gray-600 hover:text-blue-600 transition-colors py-1">6. User Rights & Ownership</a>
                <a href="#deletion" className="block text-gray-600 hover:text-blue-600 transition-colors py-1">7. Account & Data Deletion</a>
                <a href="#security" className="block text-gray-600 hover:text-blue-600 transition-colors py-1">8. Security Infrastructure</a>
                <a href="#contact" className="block text-gray-600 hover:text-blue-600 transition-colors py-1">9. Contact Information</a>
              </nav>
            </div>

            <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-lg shadow-blue-600/15">
              <h4 className="font-bold text-lg mb-2">Have a question?</h4>
              <p className="text-blue-100 text-xs leading-relaxed mb-4">
                Our security and compliance team is available to assist with inquiries.
              </p>
              <a 
                href="mailto:tapfolio.in@gmail.com" 
                className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold text-xs px-4 py-2.5 rounded-full hover:bg-blue-50 transition-colors"
              >
                tapfolio.in@gmail.com <ArrowRight size={14} />
              </a>
            </div>
          </aside>

          {/* Right Main Policy Text */}
          <div className="lg:col-span-8 space-y-12 text-gray-600 leading-relaxed text-base">
            
            <section id="intro" className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="font-display font-bold text-2xl md:text-3xl text-gray-950 mb-4">
                1. Introduction
              </h2>
              <p className="mb-4">
                Welcome to Tapfolio ("we," "our," or "us"). We are dedicated to providing modern, dynamic professional networking tools while giving you total ownership of your personal and business data.
              </p>
              <p>
                This Privacy Policy explains how information is collected, processed, encrypted, and safeguarded when you use our mobile applications, access our web platform at <Link href="https://tapfolio.me" className="text-blue-600 font-semibold hover:underline">tapfolio.me</Link>, or scan any of our physical NFC-enabled networking cards.
              </p>
            </section>

            <section id="collection" className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="font-display font-bold text-2xl md:text-3xl text-gray-950 mb-4">
                2. Information We Collect
              </h2>
              <p className="mb-6">
                We only collect information that is strictly required to power your dynamic profile, configure your physical smart card, and track your networking performance:
              </p>
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-1">Account & Identity Credentials</h4>
                  <p className="text-sm text-gray-500">Full name, email address, password hash, and unique profile handle.</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-1">Professional Profile Information</h4>
                  <p className="text-sm text-gray-500">Designation, company, bio, phone number, WhatsApp link, website, social handles (LinkedIn, X, Instagram, YouTube), and avatar image.</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-1">Google Single Sign-On (OAuth)</h4>
                  <p className="text-sm text-gray-500">If you authenticate via Google, we securely receive your verified email, display name, and avatar picture.</p>
                </div>
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-1">Tap & Engagement Analytics</h4>
                  <p className="text-sm text-gray-500">Aggregated tap timestamps, rough city-level geolocation (when shared), and link click counts to populate your analytics dashboard.</p>
                </div>
              </div>
            </section>

            <section id="usage" className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="font-display font-bold text-2xl md:text-3xl text-gray-950 mb-4">
                3. How We Use Your Data
              </h2>
              <p className="mb-4">
                We process your data strictly to deliver and enhance the core TapFolio product experience:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3 text-gray-700">
                  <CheckCircle2 size={18} className="text-blue-600 shrink-0 mt-1" />
                  <span>Instantly render your responsive digital profile when your physical NFC card or QR code is scanned.</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <CheckCircle2 size={18} className="text-blue-600 shrink-0 mt-1" />
                  <span>Maintain your connection records, lead capture inbox, and analytics charts.</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <CheckCircle2 size={18} className="text-blue-600 shrink-0 mt-1" />
                  <span>Send essential security notifications, password resets, and hardware order updates.</span>
                </li>
                <li className="flex items-start gap-3 text-gray-700">
                  <CheckCircle2 size={18} className="text-blue-600 shrink-0 mt-1" />
                  <span>Prevent fraudulent interactions, unauthorized API spam, or terms of service violations.</span>
                </li>
              </ul>
            </section>

            <section id="cookies" className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="font-display font-bold text-2xl md:text-3xl text-gray-950 mb-4">
                4. Cookies & Session Storage
              </h2>
              <p className="mb-4">
                We prioritize user privacy and avoid third-party marketing trackers:
              </p>
              <p>
                On the Web, we use secure, encrypted <strong>HttpOnly session cookies</strong> to maintain your dashboard login state. On mobile applications, authentication tokens are stored inside your device’s secure hardware keychain. <strong>We do not use tracking pixels, cross-site trackers, or advertising cookies.</strong>
              </p>
            </section>

            <section id="sharing" className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="font-display font-bold text-2xl md:text-3xl text-gray-950 mb-4">
                5. Data Sharing & Third Parties
              </h2>
              <p className="mb-4">
                Your profile information is made available to people you choose to connect with when they tap your card or open your link. You have individual privacy switches to hide sensitive fields like phone number or email address.
              </p>
              <p className="mb-4">
                We work only with vetted, enterprise-grade cloud providers for infrastructure:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-gray-600">
                <li><strong>Database & Cloud Hosting:</strong> Secure SOC2-compliant servers with automated TLS encryption at rest and in transit.</li>
                <li><strong>Authentication Services:</strong> Google Identity Services for secure Single Sign-On.</li>
              </ul>
            </section>

            <section id="rights" className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="font-display font-bold text-2xl md:text-3xl text-gray-950 mb-4">
                6. User Rights & Data Ownership
              </h2>
              <p className="mb-4">
                You retain complete ownership of all personal and professional information entered into Tapfolio. You have the right to:
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 font-medium text-gray-800">
                  <UserCheck size={18} className="text-blue-600" /> Access and review your data anytime in your dashboard
                </li>
                <li className="flex items-center gap-2 font-medium text-gray-800">
                  <UserCheck size={18} className="text-blue-600" /> Update your contact links, company, role, or avatar in real time
                </li>
                <li className="flex items-center gap-2 font-medium text-gray-800">
                  <UserCheck size={18} className="text-blue-600" /> Export your connection history to standard CSV/vCard format
                </li>
              </ul>
            </section>

            <section id="deletion" className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="font-display font-bold text-2xl md:text-3xl text-gray-950 mb-4">
                7. Account & Data Deletion
              </h2>
              <p className="mb-6">
                We uphold your right to be forgotten. You can permanently delete your account and all associated profile data at any moment.
              </p>
              
              <div className="bg-red-50/50 border border-red-100 p-6 rounded-2xl">
                <h4 className="font-bold text-red-900 text-sm mb-3">Self-Service Account Deletion Flow:</h4>
                <ol className="list-decimal pl-5 space-y-2 text-sm text-red-800">
                  <li>Open the <strong>Tapfolio App</strong> or log in to your web dashboard.</li>
                  <li>Navigate to <strong>Settings</strong> &gt; <strong>Account Security</strong>.</li>
                  <li>Select <strong>Delete Account</strong> and review the confirmation prompt.</li>
                  <li>Type <strong>DELETE</strong> to confirm permanent erasure.</li>
                </ol>
                <p className="text-xs text-red-700 mt-4">
                  Upon confirmation, all database records, authentication credentials, and uploaded media are permanently wiped within seconds.
                </p>
              </div>
            </section>

            <section id="security" className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="font-display font-bold text-2xl md:text-3xl text-gray-950 mb-4">
                8. Security Infrastructure
              </h2>
              <p className="mb-4">
                Security is built into every layer of the TapFolio ecosystem:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-sm text-gray-600">
                <li><strong>Read-Only NFC Hardware:</strong> NFC chips are locked to prevent malicious overwriting or tampering in the field.</li>
                <li><strong>End-to-End Encryption:</strong> All client-to-server traffic is forced over HTTPS with modern cipher suites.</li>
                <li><strong>Rate Limiting & Protection:</strong> API gateways actively shield against brute force attacks and credential stuffing.</li>
              </ul>
            </section>

            <section id="contact" className="bg-gray-50 p-8 md:p-10 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="font-display font-bold text-2xl md:text-3xl text-gray-950 mb-4">
                9. Contact Information
              </h2>
              <p className="mb-4 text-gray-600">
                For questions regarding this policy, data protection inquiries, or assistance with account management:
              </p>
              <div className="space-y-1 text-sm font-medium text-gray-900">
                <p><strong>Email:</strong> <a href="mailto:tapfolio.in@gmail.com" className="text-blue-600 hover:underline">tapfolio.in@gmail.com</a></p>
                <p><strong>Entity:</strong> TapFolio Inc.</p>
              </div>
            </section>

          </div>

        </div>
      </main>

      <FooterSection />
    </div>
  );
}

