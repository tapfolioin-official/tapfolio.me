/**
 * ABOUT PAGE — SELF-CONTAINED
 * All dependencies are co-located in _components/ and _lib/ directories.
 * This page can be freely moved to any folder and will work independently.
 */

import React from "react";
import Footer from "./_components/Footer";
import { generatePageMetadata } from "./_lib/metadata";
import { getOrganizationSchema } from "./_lib/schemas";

const baseMetadata = generatePageMetadata({
  title: "About Us | Tapfolio — Company Story, Mission & Values",
  description:
    "Learn about Tapfolio's journey to reinventing business cards. Discover our mission, values, company history, and vision for the future of networking.",
  path: "/about",
  imageUrl: "/og/about.png"
});

export const metadata = {
  ...baseMetadata,
  metadataBase: new URL("https://www.tapfolio.me"),
  robots: {
    index: true,
    follow: true
  }
};

export default function AboutPage() {
  const aboutPageSchema = {
    "@type": "AboutPage",
    "@id": "https://tapfolio.me/about#webpage",
    "url": "https://tapfolio.me/about",
    "name": "About Us | Tapfolio",
    "description": "Tapfolio's mission, values, history, and product details.",
    "isPartOf": {
      "@id": "https://tapfolio.me/#website"
    },
    "mainEntity": {
      "@id": "https://tapfolio.me/#organization"
    },
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": [".speakable-title", ".speakable-description"]
    }
  };

  const breadcrumbSchema = {
    "@type": "BreadcrumbList",
    "@id": "https://tapfolio.me/about#breadcrumb",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://tapfolio.me"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "About",
        "item": "https://tapfolio.me/about"
      }
    ]
  };

  const faqSchema = {
    "@type": "FAQPage",
    "@id": "https://tapfolio.me/about#faq",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is Tapfolio?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Tapfolio is a professional networking and digital identity platform that connects tactile NFC smart business cards to dynamic, real-time web profiles."
        }
      },
      {
        "@type": "Question",
        "name": "Who founded Tapfolio?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Tapfolio was co-founded by Abhinand K.S. (Founder & CEO) and Mohammed Nibrasul Haqq (Co-founder & CTO)."
        }
      },
      {
        "@type": "Question",
        "name": "How does Tapfolio work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Tapfolio cards contain passive NFC microchips. Tapping the card against a smartphone transmits your dynamic profile link over-the-air, loading your portfolio and contact card instantly."
        }
      }
    ]
  };

  const schema = {
    "@context": "https://schema.org",
    "@graph": [aboutPageSchema, breadcrumbSchema, faqSchema]
  };

  // ---------- Data ----------
  const stats = [
    { label: "Active Users", value: "12K+", suffix: "" },
    { label: "Avg. Rating", value: "4.9", suffix: "★" },
    { label: "Taps Completed", value: "340K+", suffix: "" },
    { label: "Countries Served", value: "48", suffix: "+" },
  ];

  const values = [
    {
      title: "Innovation First",
      desc: "We continually push the boundaries of what a card and digital profile can accomplish.",
      icon: (
        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: "Eco‑Friendly",
      desc: "By replacing millions of paper cards annually, we are building a more sustainable future.",
      icon: (
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
      ),
    },
    {
      title: "Frictionless Exchange",
      desc: "We make contact and profile sharing happen instantly in one clean tap.",
      icon: (
        <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
  ];

  const milestones = [
    {
      year: "2025",
      title: "The Concept",
      desc: "Tapfolio co‑founders envisioned bridging physical NFC cards with live digital portfolios.",
    },
    {
      year: "2026",
      title: "Enterprise Launch",
      desc: "Developed the Next.js platform and local mobile tracker, deploying metal cards worldwide.",
    },
    {
      year: "2027",
      title: "Leaderboard & Analytics",
      desc: "Scaled connections matching engine to support thousands of active transactions.",
    },
    {
      year: "2028",
      title: "Global Expansion",
      desc: "Opened offices in Austin, London, and Singapore — serving enterprise clients across 6 continents.",
    },
  ];

  const team = [
    { name: "Abhinand K.S.", role: "Founder & CEO", img: "/abhinand.png", link: "/founders/abhinand" },
    { name: "Mohammed Nibrasul Haqq", role: "Co-founder & CTO", img: "/nibras.png", link: "/founders/mohammed-nibrasul-haqq" },
    { name: "Sarah Chen", role: "Head of Product", img: "/sarah.png" },
    { name: "Michael Torres", role: "Lead Engineer", img: "/michael.png" },
  ];

  const testimonials = [
    {
      quote: "Tapfolio has completely transformed how our sales team shares information. Our close rate increased by 30% in just two months.",
      author: "Jessica Lee",
      role: "VP of Sales, CloudSphere",
    },
    {
      quote: "The combination of premium hardware and real‑time analytics is a game‑changer. We’re finally able to track our networking ROI.",
      author: "David Park",
      role: "Founder, Park Capital",
    },
    {
      quote: "I love the environmental impact. My whole company now uses Tapfolio, and we’ve eliminated paper cards entirely.",
      author: "Emma Watson",
      role: "Sustainability Lead, GreenTech",
    },
  ];

  const partners = [
    { name: "Microsoft", logo: "/partners/microsoft.svg" },
    { name: "Google", logo: "/partners/google.svg" },
    { name: "Salesforce", logo: "/partners/salesforce.svg" },
    { name: "HubSpot", logo: "/partners/hubspot.svg" },
  ];

  // ---------- Render ----------
  return (
    <div className="bg-white min-h-screen text-gray-900 font-sans selection:bg-blue-100 flex flex-col pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
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
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
          <a href="/product" className="hover:text-blue-600 transition-colors">Product</a>
          <a href="/blog" className="hover:text-blue-600 transition-colors">Blog</a>
          <a href="/careers" className="hover:text-blue-600 transition-colors">Careers</a>
        </nav>
        <a href="/" className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
          Back to Home
        </a>
      </header>

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 py-16 flex flex-col gap-24">
        {/* Hero */}
        <section className="text-center max-w-4xl mx-auto flex flex-col gap-6 mt-8">
          <div className="inline-flex items-center gap-2 mx-auto bg-blue-50 text-blue-700 text-xs font-semibold px-4 py-2 rounded-full border border-blue-100/50">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Building the future of networking
          </div>
          <h1 className="speakable-title text-5xl md:text-7xl font-display font-extrabold tracking-tight text-gray-950 leading-[1.1]">
            Reinventing the way the world{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Connects
            </span>
            .
          </h1>
          <p className="speakable-description text-lg md:text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto">
            Tapfolio combines premium hardware with real‑time digital profiles.
            Share your links, build relationships, and save paper—all in a
            single tap.
          </p>
          <div className="flex flex-wrap justify-center gap-10 pt-4">
            {stats.map((stat, idx) => (
              <div key={idx}>
                <div className="text-3xl font-black text-gray-900">
                  {stat.value} <span className="text-blue-600">{stat.suffix}</span>
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Story & Mission/Vision */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="flex flex-col gap-6">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Our Story
            </span>
            <h2 className="text-4xl font-bold text-gray-950 leading-tight">
              From paper waste to a digital ecosystem
            </h2>
            <p className="text-gray-600 leading-relaxed text-lg">
              Traditional business cards were designed for a disconnected
              world. They are easily lost, expensive to print, and quickly go
              out of date. We set out to change that by building an ecosystem
              that updates instantly.
            </p>
            <p className="text-gray-600 leading-relaxed">
              With Tapfolio, your digital business card resides in the cloud. It
              features lead capture integrations, instant connection history,
              and advanced analytics—packaged inside a premium, custom‑engraved
              physical medium.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Mission
              </span>
              <p className="text-xl font-semibold text-gray-900 mt-2">
                Make networking frictionless, memorable, and environmentally
                friendly.
              </p>
            </div>
            <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-all">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Vision
              </span>
              <p className="text-xl font-semibold text-gray-900 mt-2">
                Become the global standard for professional identity and direct
                connection exchange.
              </p>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="flex flex-col gap-12">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Core Values
            </span>
            <h2 className="text-4xl font-bold text-gray-950 mt-2">
              What drives us forward
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto mt-2">
              Our principles guide every decision we make and every product we
              build.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v, i) => (
              <div
                key={i}
                className="group border border-gray-100 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 bg-white hover:-translate-y-1 hover:border-blue-200"
              >
                <div className="mb-4">{v.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {v.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Tapfolio */}
        <section className="bg-gray-50 rounded-3xl p-12 md:p-16 flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Why Tapfolio
            </span>
            <h2 className="text-3xl font-bold text-gray-950 mt-2">
              Built for the modern professional
            </h2>
            <ul className="mt-6 space-y-4 text-gray-600">
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold text-xl">✓</span>
                <span><strong className="text-gray-900">Real‑time updates</strong> — your profile always reflects your latest info.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold text-xl">✓</span>
                <span><strong className="text-gray-900">Analytics dashboard</strong> — see who viewed your profile and when.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold text-xl">✓</span>
                <span><strong className="text-gray-900">Seamless integrations</strong> — sync with CRM, email, and calendar.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-blue-600 font-bold text-xl">✓</span>
                <span><strong className="text-gray-900">Premium materials</strong> — engraved metal or wood cards that leave a lasting impression.</span>
              </li>
            </ul>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="w-64 h-64 bg-gradient-to-tr from-blue-400 to-purple-400 rounded-3xl flex items-center justify-center text-white text-6xl shadow-2xl">
              ⚡
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="flex flex-col gap-12">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Timeline
            </span>
            <h2 className="text-4xl font-bold text-gray-950 mt-2">
              Our journey so far
            </h2>
          </div>
          <div className="relative flex flex-col gap-10 max-w-2xl mx-auto pl-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-blue-200">
            {milestones.map((m, i) => (
              <div key={i} className="relative pl-6 before:absolute before:left-[-24px] before:top-2 before:w-4 before:h-4 before:rounded-full before:bg-blue-600 before:ring-4 before:ring-blue-50">
                <span className="text-sm font-black text-blue-600">
                  {m.year}
                </span>
                <h3 className="text-xl font-bold text-gray-900">{m.title}</h3>
                <p className="text-gray-500">{m.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="flex flex-col gap-12">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Team
            </span>
            <h2 className="text-4xl font-bold text-gray-950 mt-2">
              The people behind Tapfolio
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto mt-2">
              A passionate group of innovators, engineers, and designers
              dedicated to redefining professional networking.
            </p>
          </div>
          <section id="team-leadership" aria-label="Tapfolio Leadership Team" className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member, i) => {
              const isLeadership = i < 2;

              const content = (
                <>
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-150 bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <img
                      src={member.img}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {isLeadership ? (
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{member.name}</h3>
                  ) : (
                    <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{member.name}</h4>
                  )}
                  <p className={`${isLeadership ? "role " : ""}text-sm text-gray-500`}>{member.role}</p>
                </>
              );

              return member.link ? (
                <a
                  key={i}
                  href={member.link}
                  className={`${isLeadership ? "team-member " : ""}group bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center hover:shadow-md hover:border-blue-200 transition-all block`}
                >
                  {content}
                </a>
              ) : (
                <div
                  key={i}
                  className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center shadow-none"
                >
                  {content}
                </div>
              );
            })}
          </section>
        </section>

        {/* Testimonials */}
        <section className="flex flex-col gap-12">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Testimonials
            </span>
            <h2 className="text-4xl font-bold text-gray-950 mt-2">
              What our clients say
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all"
              >
                <div className="text-blue-600 text-3xl mb-4">“</div>
                <p className="text-gray-600 leading-relaxed">{t.quote}</p>
                <div className="mt-4 border-t border-gray-100 pt-4">
                  <p className="font-bold text-gray-900">{t.author}</p>
                  <p className="text-sm text-gray-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Partners */}
        <section className="flex flex-col gap-8">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Partners
            </span>
            <h2 className="text-3xl font-bold text-gray-950 mt-2">
              Trusted by industry leaders
            </h2>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-70">
            {partners.map((p, i) => (
              <div key={i} className="text-gray-400 font-semibold text-xl tracking-tight">
                {p.name}
              </div>
            ))}
          </div>
        </section>

        {/* CTA - Join the team */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-3xl p-12 md:p-16 text-center flex flex-col items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold">Join the team</h2>
            <p className="text-blue-100 max-w-md mx-auto mt-2">
              We’re always looking for talented individuals to help us shape the
              future of networking.
            </p>
            <a
              href="/careers"
              className="inline-block mt-8 bg-white text-blue-600 font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105"
            >
              View Open Positions
            </a>
          </div>
        </section>

        {/* Contact */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 bg-gray-50 rounded-3xl p-12">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900">Headquarters</h3>
            <p className="text-gray-500">Austin, Texas, USA</p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900">Email</h3>
            <a href="mailto:tapfolio.in@gmail.com" className="text-blue-600 hover:underline">
              tapfolio.in@gmail.com
            </a>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="font-bold text-gray-900">Follow us</h3>
            <div className="flex gap-4 mt-1">
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">LinkedIn</a>
              <a href="#" className="text-gray-400 hover:text-blue-600 transition-colors">Instagram</a>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Custom animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes ping {
          75%,
          100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}} />
    </div>
  );
}