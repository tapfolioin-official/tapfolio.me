/**
 * CONTACT PAGE — SELF-CONTAINED
 * Contact form, office info, and support channels.
 * Same UI and colour design as the homepage.
 */

import React from "react";

export const metadata = {
  title: "Contact Us | Tapfolio",
  description: "Get in touch with the Tapfolio team. Reach out for enterprise inquiries, custom orders, technical support, or general feedback.",
  alternates: {
    canonical: "https://www.tapfolio.me/contact",
  },
  metadataBase: new URL("https://www.tapfolio.me"),
  keywords: ["NFC profile", "tap portfolio", "digital business card", "networking tracker", "Tapfolio"],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Contact Us | Tapfolio",
    description: "Get in touch with the Tapfolio team. Reach out for enterprise inquiries, custom orders, technical support, or general feedback.",
    url: "https://www.tapfolio.me/contact",
    type: "website",
    siteName: "Tapfolio",
    images: [
      {
        url: "https://www.tapfolio.me/og/contact.png",
        width: 1200,
        height: 630,
        alt: "Contact Tapfolio",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Us | Tapfolio",
    description: "Get in touch with the Tapfolio team. Reach out for enterprise inquiries, custom orders, technical support, or general feedback.",
    images: ["https://www.tapfolio.me/og/contact.png"],
  }
};

export default function ContactPage() {
  const channels = [
    {
      icon: "📧",
      title: "Email Us",
      desc: "For general inquiries and support.",
      info: "hello@tapfolio.me",
      href: "mailto:hello@tapfolio.me",
    },
    {
      icon: "💼",
      title: "Enterprise Sales",
      desc: "Custom bulk orders and team deployments.",
      info: "enterprise@tapfolio.me",
      href: "mailto:enterprise@tapfolio.me",
    },
    {
      icon: "🛠️",
      title: "Technical Support",
      desc: "Help with your card, dashboard, or API.",
      info: "tapfolio.in@gmail.com",
      href: "mailto:tapfolio.in@gmail.com",
    },
  ];

  const offices = [
    {
      city: "Austin",
      country: "Texas, USA",
      type: "Headquarters",
    },
    {
      city: "London",
      country: "United Kingdom",
      type: "Europe Office",
    },
    {
      city: "Singapore",
      country: "Singapore",
      type: "Asia-Pacific",
    },
  ];

  const faqs = [
    {
      q: "How long does delivery take?",
      a: "Standard orders ship within 5–7 business days. Enterprise bulk orders are typically fulfilled within 10–14 business days.",
    },
    {
      q: "Can I customise my card design?",
      a: "Yes! All TapFolio Metal and Team plans include custom engraving, logo placement, and colour options.",
    },
    {
      q: "Do you offer refunds?",
      a: "We offer a 30-day satisfaction guarantee. If you're not happy, contact us for a full refund.",
    },
    {
      q: "How do I update my digital profile?",
      a: "Log into your TapFolio dashboard at any time. Changes are reflected instantly across all linked NFC cards.",
    },
  ];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": "https://www.tapfolio.me/contact#breadcrumb",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.tapfolio.me"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Contact",
        "item": "https://www.tapfolio.me/contact"
      }
    ]
  };

  return (
    <div className="bg-white min-h-screen text-gray-900 font-sans selection:bg-blue-100 flex flex-col pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* Header */}
      <header className="fixed top-0 left-0 w-full h-20 bg-white/80 backdrop-blur-md border-b border-gray-150 z-50 flex items-center justify-between px-6 md:px-[12%] max-w-[1440px] left-1/2 -translate-x-1/2">
        <a href="/" className="flex items-center gap-1 cursor-pointer">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
            <path d="M5 14C6.10457 14 7 13.1046 7 12C7 10.8954 6.10457 10 5 10C3.89543 10 3 10.8954 3 12C3 13.1046 3.89543 14 5 14Z" fill="#60A5FA" />
            <path d="M9 8C11.2091 8 13 9.79086 13 12C13 14.2091 11.2091 16 9 16" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M13 4C17.4183 4 21 7.58172 21 12C21 16.4183 17.4183 20 13 20" stroke="#2563EB" strokeWidth="3" strokeLinecap="round" />
          </svg>
          <span className="font-bold text-2xl tracking-tight font-sans" style={{ color: '#020b2d' }}>
            Tap<span style={{ color: '#2563EB' }}>folio</span>
          </span>
        </a>
        <a href="/" className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
          Back to Home
        </a>
      </header>

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 py-16 flex flex-col gap-24">
        {/* Hero */}
        <section className="text-center max-w-3xl mx-auto flex flex-col gap-6 mt-8">
          <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight text-gray-950 leading-[1.1]">
            Get in{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Touch
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto">
            Have a question, need support, or want to discuss a custom enterprise deployment? We&apos;d love to hear from you.
          </p>
        </section>

        {/* Contact Channels */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {channels.map((c, i) => (
            <a
              key={i}
              href={c.href}
              className="group border border-gray-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 bg-white hover:-translate-y-1 hover:border-blue-200 block"
            >
              <div className="text-4xl mb-4">{c.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{c.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">{c.desc}</p>
              <span className="text-blue-600 font-semibold text-sm group-hover:underline">{c.info}</span>
            </a>
          ))}
        </section>

        {/* Office Locations */}
        <section className="flex flex-col gap-12">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Global Presence</span>
            <h2 className="text-4xl font-bold text-gray-950 mt-2">Our Offices</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offices.map((o, i) => (
              <div key={i} className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-2xl p-8 text-center hover:shadow-md transition-all">
                <div className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-2">{o.type}</div>
                <div className="text-2xl font-bold text-gray-900">{o.city}</div>
                <div className="text-sm text-gray-500 mt-1">{o.country}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="flex flex-col gap-12">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">FAQ</span>
            <h2 className="text-4xl font-bold text-gray-950 mt-2">Common Questions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {faqs.map((f, i) => (
              <div key={i} className="border border-gray-100 rounded-2xl p-6 bg-white hover:shadow-md transition-all">
                <h3 className="font-bold text-gray-900 mb-2">{f.q}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gray-950 text-white rounded-3xl p-12 md:p-16 text-center flex flex-col items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold">Ready to get started?</h2>
            <p className="text-gray-400 max-w-md mx-auto mt-2">
              Order your custom NFC card today and join thousands of professionals networking smarter.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <a
                href="/#order"
                className="inline-flex items-center justify-center px-8 h-[50px] bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all shadow-md"
              >
                Order Now
              </a>
              <a
                href="/about"
                className="inline-flex items-center justify-center px-8 h-[50px] border border-white/20 text-white font-semibold rounded-full hover:bg-white/10 transition-all"
              >
                About Us
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-gray-100 pt-20 pb-10 flex justify-center">
        <div className="max-w-[1200px] w-full px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <h3 className="font-display font-black text-2xl tracking-tighter text-gray-950 mb-6">TapFolio.</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                The smartest business card on the planet. Eco-friendly, always updated, and designed for modern professionals.
              </p>
              <div className="text-gray-900 font-medium text-sm">hello@tapfolio.me</div>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Products</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><a href="/#products" className="hover:text-blue-600 transition-colors">TapFolio PVC</a></li>
                <li><a href="/#products" className="hover:text-blue-600 transition-colors">TapFolio Metal</a></li>
                <li><a href="/#products" className="hover:text-blue-600 transition-colors">TapFolio Team</a></li>
                <li><a href="/#order" className="hover:text-blue-600 transition-colors">Custom Enterprise</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Software</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><a href="/#technology" className="hover:text-blue-600 transition-colors">Profile Builder</a></li>
                <li><a href="/#technology" className="hover:text-blue-600 transition-colors">Analytics Dashboard</a></li>
                <li><a href="/#technology" className="hover:text-blue-600 transition-colors">Lead Capture</a></li>
                <li><a href="/docs" className="hover:text-blue-600 transition-colors font-semibold text-blue-600">Developer API Docs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Company</h4>
              <ul className="space-y-3 text-sm text-gray-500">
                <li><a href="/about" className="hover:text-blue-600 transition-colors">About Us</a></li>
                <li><a href="/team" className="hover:text-blue-600 transition-colors">Meet the Team</a></li>
                <li><a href="/founders" className="hover:text-blue-600 transition-colors">Founders Directory</a></li>
                <li><a href="/privacy" className="hover:text-blue-600 transition-colors">Privacy & Security</a></li>
                <li><a href="/contact" className="hover:text-blue-600 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-400">
            <div>© 2026 TapFolio Inc. All rights reserved.</div>
            <div className="flex gap-6">
              <a href="/terms" className="hover:text-gray-900 transition-colors">Terms of Service</a>
              <a href="/privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</a>
              <a href="/privacy" className="hover:text-gray-900 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
