/**
 * ABOUT PAGE — SELF-CONTAINED
 * All dependencies are co-located in _components/ and _lib/ directories.
 * This page can be freely moved to any folder and will work independently.
 */

import React from "react";
import Footer from "./_components/Footer";
import { generatePageMetadata } from "./_lib/metadata";
import { getOrganizationSchema } from "./_lib/schemas";

export const metadata = generatePageMetadata({
  title: "About Us | Tapfolio — Company Story, Mission & Values",
  description:
    "Learn about Tapfolio's journey to reinventing business cards. Discover our mission, values, company history, and vision for the future of networking.",
  path: "/about",
});

export default function AboutPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    mainEntity: getOrganizationSchema(),
    description: "Tapfolio's mission, values, history, and product details.",
  };

  const values = [
    {
      title: "Innovation First",
      desc: "We continually push the boundaries of what a card and digital profile can accomplish.",
      icon: "🚀",
    },
    {
      title: "Eco‑Friendly",
      desc: "By replacing millions of paper cards annually, we are building a more sustainable future.",
      icon: "🌱",
    },
    {
      title: "Frictionless Exchange",
      desc: "We make contact and profile sharing happen instantly in one clean tap.",
      icon: "⚡",
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
    { name: "Mohammed Nibrasul Haqq", role: "CEO & Co‑founder", img: "/nibras.png" },
    { name: "Abhinand", role: "Founder", img: "/abhinand.png" },
  ];

  return (
    <div className="bg-white min-h-screen text-gray-900 font-sans selection:bg-blue-100 flex flex-col pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      {/* Simplified Header */}
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
        {/* Hero Section with animated gradient */}
        <section className="text-center max-w-4xl mx-auto flex flex-col gap-6 mt-8">
          <div className="inline-flex items-center gap-2 mx-auto bg-blue-50 text-blue-700 text-xs font-semibold px-4 py-2 rounded-full border border-blue-100/50">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Building the future of networking
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-extrabold tracking-tight text-gray-950 leading-[1.1]">
            Reinventing the way the world{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Connects
            </span>
            .
          </h1>
          <p className="text-lg md:text-xl text-gray-500 leading-relaxed max-w-2xl mx-auto">
            Tapfolio combines premium hardware with real‑time digital profiles.
            Share your links, build relationships, and save paper—all in a
            single tap.
          </p>
          <div className="flex flex-wrap justify-center gap-8 pt-4">
            <div>
              <div className="text-3xl font-black text-gray-900">12K+</div>
              <div className="text-sm text-gray-400">Active Users</div>
            </div>
            <div>
              <div className="text-3xl font-black text-gray-900">4.9★</div>
              <div className="text-sm text-gray-400">Avg. Rating</div>
            </div>
            <div>
              <div className="text-3xl font-black text-gray-900">340K+</div>
              <div className="text-sm text-gray-400">Taps Completed</div>
            </div>
          </div>
        </section>

        {/* Story & Mission/Vision Cards */}
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

        {/* Values Grid with icons */}
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
                <div className="text-4xl mb-4">{v.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {v.title}
                </h3>
                <p className="text-gray-500 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline with visual line */}
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

        {/* Team Section */}
        <section className="flex flex-col gap-12">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Team
            </span>
            <h2 className="text-4xl font-bold text-gray-950 mt-2">
              The people behind Tapfolio
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <div
                key={i}
                className="bg-gray-50 border border-gray-100 rounded-2xl p-6 text-center hover:shadow-md transition-all"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-150 bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h4 className="font-bold text-gray-900">{member.name}</h4>
                <p className="text-sm text-gray-500">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact / CTA */}
        <section className="bg-gray-950 text-white rounded-3xl p-12 md:p-16 text-center flex flex-col items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
          <div className="relative z-10">
            <h2 className="text-4xl font-bold">Get in Touch</h2>
            <p className="text-gray-400 max-w-md mx-auto mt-2">
              Whether you are looking to equip your enterprise sales team or
              just have general feedback, we'd love to hear from you.
            </p>
            <div className="flex flex-wrap justify-center gap-8 mt-8">
              <div>
                <div className="text-sm text-gray-400">Headquarters</div>
                <div className="font-semibold">Austin, Texas, USA</div>
              </div>
              <div>
                <div className="text-sm text-gray-400">Email</div>
                <a
                  href="mailto:hello@tapfolio.me"
                  className="text-blue-400 font-semibold hover:underline"
                >
                  hello@tapfolio.me
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Custom keyframe animations via style tag (optional) */}
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