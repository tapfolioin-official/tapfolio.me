import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Navbar from "../_components/Navbar";
import Footer from "../_components/Footer";
import AvatarImage from "../_components/AvatarImage";
import { foundersData } from "../_data/founders";
import {
  getPersonEntitySchema,
  getProfilePageSchema,
  getFounderBreadcrumbSchema,
  getFounderFAQSchema,
  getOrganizationEntitySchema
} from "../_lib/schemas";

interface FounderPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return Object.keys(foundersData).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: FounderPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const founder = foundersData[resolvedParams.slug];

  if (!founder) {
    return {
      title: "Founder Not Found | Tapfolio",
    };
  }

  const canonicalUrl = `https://www.tapfolio.me/founders/${founder.slug}`;

  return {
    title: `${founder.name} | ${founder.jobTitle} | Tapfolio`,
    description: founder.shortSummary,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title: `${founder.name} — ${founder.jobTitle} at Tapfolio`,
      description: founder.shortSummary,
      url: canonicalUrl,
      siteName: "Tapfolio",
      images: [
        {
          url: `https://www.tapfolio.me${founder.avatar}`,
          width: 800,
          height: 800,
          alt: `${founder.name} - ${founder.jobTitle}`,
        },
      ],
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${founder.name} | ${founder.jobTitle} | Tapfolio`,
      description: founder.shortSummary,
      images: [`https://www.tapfolio.me${founder.avatar}`],
    },
  };
}

export default async function FounderProfilePage({ params }: FounderPageProps) {
  const resolvedParams = await params;
  const founder = foundersData[resolvedParams.slug];

  if (!founder) {
    notFound();
  }

  const orgSchema = getOrganizationEntitySchema();
  const personSchema = getPersonEntitySchema(founder);
  const profileSchema = getProfilePageSchema(founder);
  const breadcrumbSchema = getFounderBreadcrumbSchema(founder);
  const faqSchema = getFounderFAQSchema(founder);

  const mohammed = foundersData["mohammed-nibrasul-haqq"];
  const abhinand = foundersData["abhinand"];

  const tabs = [
    { id: "overview", label: "Overview", href: `/founders/${founder.slug}` },
    { id: "biography", label: "Biography", href: `#biography` },
    { id: "timeline", label: "Journey", href: `#timeline` },
    { id: "skills", label: "Skills", href: `#skills` },
    { id: "projects", label: "Projects", href: `#projects` },
    { id: "leadership", label: "Leadership Team", href: `#leadership` },
    { id: "faq", label: "FAQ", href: `#faq` },
  ];

  const founderTechStack = [
    "Next.js", "React", "TypeScript", "Flutter", "Node.js", "AI Agents", "NFC Hardware", "PostgreSQL"
  ];

  const currentlyWorkingOn = [
    "Tapfolio Next.js Platform & NDEF Card Provisioning Engine",
    "Autonomous AI Developer Agents & CLI Tooling",
    "Cross-Platform Flutter Identity Mobile Sync",
    "Knowledge Graph & Entity Indexing Architecture"
  ];

  return (
    <div className="bg-white min-h-screen text-gray-900 font-sans selection:bg-blue-100 flex flex-col pt-20">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profileSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <Navbar />

      {/* Main Container - 7xl / 1360px Spacious Layout */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 flex flex-col gap-16">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="text-xs text-gray-400 font-medium flex items-center gap-2">
          <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
          <span>/</span>
          <a href="/founders" className="hover:text-blue-600 transition-colors">Founders</a>
          <span>/</span>
          <span className="text-gray-900 font-semibold">{founder.name}</span>
        </nav>

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-gray-900 via-gray-950 to-blue-950 text-white rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col lg:flex-row gap-10 items-center">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />
          
          {/* Portrait */}
          <div className="relative w-44 h-44 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-blue-500/30 shadow-2xl flex-shrink-0 bg-gray-800">
            <AvatarImage
              src={founder.avatar}
              alt={`${founder.name} - ${founder.jobTitle}`}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Identity & Short Bio */}
          <div className="flex-1 flex flex-col gap-5 text-center lg:text-left z-10">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <span className="bg-blue-600/20 text-blue-400 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-blue-500/30">
                {founder.jobTitle}
              </span>
              <span className="bg-white/10 text-gray-300 text-xs font-medium px-3.5 py-1.5 rounded-full">
                {founder.company}
              </span>
              <span className="bg-blue-500/10 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full border border-blue-500/20">
                Official Tapfolio Founder
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-display font-black tracking-tight text-white leading-tight">
              {founder.name}
            </h1>

            <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-3xl">
              {founder.shortSummary}
            </p>

            {/* Stat Cards Row */}
            <div className="grid grid-cols-3 gap-4 max-w-lg py-1 border-y border-white/10">
              <div>
                <span className="text-xl md:text-2xl font-bold font-display text-white">10+</span>
                <span className="text-[10px] text-gray-400 block uppercase tracking-wider">Projects Shipped</span>
              </div>
              <div>
                <span className="text-xl md:text-2xl font-bold font-display text-blue-400">Since 2023</span>
                <span className="text-[10px] text-gray-400 block uppercase tracking-wider">Started Building</span>
              </div>
              <div>
                <span className="text-xl md:text-2xl font-bold font-display text-emerald-400">CTO</span>
                <span className="text-[10px] text-gray-400 block uppercase tracking-wider">@ Tapfolio</span>
              </div>
            </div>

            {/* Technology Stack Chips */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-1.5 pt-1">
              {founderTechStack.map((tech, idx) => (
                <span key={idx} className="bg-white/5 border border-white/10 text-gray-300 text-xs px-2.5 py-1 rounded-md font-medium">
                  {tech}
                </span>
              ))}
            </div>

            {/* Action CTAs & SVG Socials */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-3">
              {founder.portfolioUrl && (
                <a
                  href={founder.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-6 py-3 rounded-full transition-all shadow-lg hover:shadow-blue-500/25"
                >
                  Explore Portfolio →
                </a>
              )}
              {founder.email && (
                <a
                  href={`mailto:${founder.email}`}
                  className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-5 py-3 rounded-full transition-all border border-white/15"
                >
                  Connect with {founder.name.split(" ")[0]}
                </a>
              )}
              
              {/* SVG Social Icons */}
              <div className="flex items-center gap-3 pl-2">
                <a
                  href="https://www.linkedin.com/in/mohammed-nibrasul-haqq-8267162ba/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open LinkedIn profile of ${founder.name}`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                  </svg>
                </a>

                <a
                  href="https://github.com/nibrasul"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open GitHub profile of ${founder.name}`}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
                  </svg>
                </a>

                <a
                  href="https://x.com/tapfolio"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open X profile of Tapfolio"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Sticky Anchor Tab Navigation Bar */}
        <div className="sticky top-20 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 py-3 flex items-center gap-6 overflow-x-auto">
          {tabs.map((tab) => (
            <a
              key={tab.id}
              href={tab.href}
              className="text-xs font-bold uppercase tracking-wider text-gray-500 hover:text-blue-600 transition-colors whitespace-nowrap"
            >
              {tab.label}
            </a>
          ))}
        </div>

        {/* Balanced 3x3 Quick Facts & Entity Data Grid */}
        <section className="bg-gray-50 border border-gray-100 rounded-3xl p-8 flex flex-col gap-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600">Quick Facts & Entity Data</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 text-sm">
            <div className="flex items-center gap-3">
              <span className="text-xl">📍</span>
              <div>
                <span className="text-gray-400 text-xs block">Location</span>
                <span className="font-semibold text-gray-900">{founder.quickFacts.location}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xl">🌐</span>
              <div>
                <span className="text-gray-400 text-xs block">Languages</span>
                <span className="font-semibold text-gray-900">{founder.quickFacts.languages.join(", ")}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xl">💼</span>
              <div>
                <span className="text-gray-400 text-xs block">Role</span>
                <span className="font-semibold text-gray-900">{founder.jobTitle}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xl">🏢</span>
              <div>
                <span className="text-gray-400 text-xs block">Company</span>
                <span className="font-semibold text-gray-900">{founder.company}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xl">⚡</span>
              <div>
                <span className="text-gray-400 text-xs block">Experience</span>
                <span className="font-semibold text-gray-900">{founder.quickFacts.experienceYears}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xl">🎯</span>
              <div>
                <span className="text-gray-400 text-xs block">Specialization</span>
                <span className="font-semibold text-gray-900">Full-Stack Web & AI Systems</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xl">🧑‍💻</span>
              <div>
                <span className="text-gray-400 text-xs block">Primary Stack</span>
                <span className="font-semibold text-gray-900">Next.js, Flutter, Node, AI</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xl">🌍</span>
              <div>
                <span className="text-gray-400 text-xs block">Nationality</span>
                <span className="font-semibold text-gray-900">{founder.quickFacts.nationality}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xl">🚀</span>
              <div>
                <span className="text-gray-400 text-xs block">Availability</span>
                <span className="font-semibold text-gray-900">Strategic Partnerships</span>
              </div>
            </div>
          </div>
        </section>

        {/* Biography Section - Optimal Readable Column Width (max-w-[850px], text-[18px], leading-[1.9]) */}
        <section id="biography" className="flex flex-col gap-6 scroll-mt-28">
          <div className="border-b border-gray-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Executive Narrative</span>
            <h2 className="text-3xl font-bold text-gray-950 mt-1">Biography</h2>
          </div>

          <div className="max-w-[850px] space-y-6 text-gray-700 text-[18px] leading-[1.9] tracking-[-0.01em]">
            {founder.biography.map((paragraph, pIdx) => (
              <p key={pIdx}>{paragraph}</p>
            ))}
          </div>
        </section>

        {/* Academic Background */}
        {founder.education && founder.education.length > 0 && (
          <section className="max-w-[850px] bg-blue-50/40 border border-blue-100 rounded-3xl p-8 flex flex-col gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Academic Background</span>
            {founder.education.map((edu, eIdx) => (
              <div key={eIdx} className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">{edu.degree}</h3>
                  <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">{edu.years}</span>
                </div>
                <p className="text-sm font-semibold text-gray-700">{edu.institution}</p>
                {edu.achievements && (
                  <p className="text-xs text-gray-500 mt-1">{edu.achievements}</p>
                )}
              </div>
            ))}
          </section>
        )}

        {/* Career Timeline */}
        <section id="timeline" className="flex flex-col gap-8 scroll-mt-28">
          <div className="border-b border-gray-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Career Milestones</span>
            <h2 className="text-3xl font-bold text-gray-950 mt-1">Journey</h2>
          </div>
          <div className="relative border-l-2 border-blue-100 ml-4 pl-6 space-y-8 max-w-[850px]">
            {founder.timeline.map((item, tIdx) => (
              <div key={tIdx} className="relative group">
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-blue-600 border-4 border-white ring-4 ring-blue-50" />
                <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest">{item.year}</span>
                <h3 className="text-xl font-bold text-gray-900 mt-0.5">{item.title}</h3>
                <p className="text-gray-600 text-sm mt-1 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Categorized Skills */}
        <section id="skills" className="flex flex-col gap-8 scroll-mt-28">
          <div className="border-b border-gray-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Technical Expertise</span>
            <h2 className="text-3xl font-bold text-gray-950 mt-1">Skills & Specializations</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {founder.skills.map((cat, cIdx) => (
              <div key={cIdx} className="border border-gray-100 bg-white rounded-2xl p-6 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-4">{cat.category}</h3>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-blue-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Projects Showcase */}
        <section id="projects" className="flex flex-col gap-8 scroll-mt-28">
          <div className="border-b border-gray-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Selected Work</span>
            <h2 className="text-3xl font-bold text-gray-950 mt-1">Projects & Products</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {founder.projects.map((proj, pIdx) => (
              <div key={pIdx} className="border border-gray-100 bg-white rounded-3xl p-8 flex flex-col justify-between gap-6 hover:shadow-xl transition-all">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{proj.role}</span>
                    <span className="text-xs text-gray-400 font-medium">{proj.year}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-950">{proj.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{proj.description}</p>
                </div>

                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap gap-2">
                    {proj.techStack.map((tech, tIdx) => (
                      <span key={tIdx} className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 pt-2 border-t border-gray-100">
                    {proj.url && (
                      <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-blue-600 hover:underline">
                        Visit Project →
                      </a>
                    )}
                    {proj.github && (
                      <a href={proj.github} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-gray-600 hover:underline">
                        Source Code
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Currently Working On Section */}
        <section className="bg-gradient-to-r from-gray-900 to-blue-950 text-white rounded-3xl p-8 md:p-10 flex flex-col gap-6 shadow-xl">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400">Fresh Focus</span>
            <h2 className="text-2xl md:text-3xl font-bold font-display">Currently Working On</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentlyWorkingOn.map((item, idx) => (
              <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                <span className="text-blue-400 font-bold">•</span>
                <span className="text-xs md:text-sm text-gray-200 font-medium">{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Redesigned Tapfolio Leadership Team Section */}
        <section id="leadership" className="bg-blue-50/50 border border-blue-100 rounded-3xl p-8 md:p-10 flex flex-col gap-8 scroll-mt-28">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Company Leadership</span>
            <h2 className="text-3xl font-bold text-gray-950">Leadership Team</h2>
            <p className="text-gray-500 text-sm">Tapfolio&apos;s executive co-founders driving product strategy and platform architecture.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mohammed && (
              <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between gap-6 hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500/20 bg-gray-100 flex-shrink-0">
                    <AvatarImage src={mohammed.avatar} alt={mohammed.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{mohammed.name}</h3>
                    <span className="text-xs font-bold text-blue-600 uppercase block">{mohammed.jobTitle}</span>
                    <span className="text-xs text-gray-500">Software Engineering & Architecture</span>
                  </div>
                </div>

                <a
                  href={`/founders/${mohammed.slug}`}
                  className="text-xs font-bold text-blue-600 hover:underline border-t border-gray-100 pt-4 flex items-center justify-between"
                >
                  <span>View Founder Profile</span>
                  <span>→</span>
                </a>
              </div>
            )}

            {abhinand && (
              <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between gap-6 hover:shadow-md transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-blue-500/20 bg-gray-100 flex-shrink-0">
                    <AvatarImage src={abhinand.avatar} alt={abhinand.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">{abhinand.name}</h3>
                    <span className="text-xs font-bold text-blue-600 uppercase block">{abhinand.jobTitle}</span>
                    <span className="text-xs text-gray-500">Strategy, Operations & Product Design</span>
                  </div>
                </div>

                <a
                  href={`/founders/${abhinand.slug}`}
                  className="text-xs font-bold text-blue-600 hover:underline border-t border-gray-100 pt-4 flex items-center justify-between"
                >
                  <span>View Founder Profile</span>
                  <span>→</span>
                </a>
              </div>
            )}
          </div>
        </section>

        {/* Entity FAQ Section */}
        <section id="faq" className="flex flex-col gap-8 scroll-mt-28">
          <div className="border-b border-gray-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Structured Data Q&A</span>
            <h2 className="text-3xl font-bold text-gray-950 mt-1">Frequently Asked Questions</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {founder.faqs.map((faq, fIdx) => (
              <div key={fIdx} className="border border-gray-100 bg-white rounded-2xl p-6 flex flex-col gap-2">
                <h3 className="text-base font-bold text-gray-900">{faq.question}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer Collaboration Callout */}
        <section className="border-t border-gray-100 pt-12 flex flex-col items-center text-center gap-6">
          <h2 className="text-3xl font-bold text-gray-950">Interested in collaborating?</h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={founder.portfolioUrl || "/portfolio/nibras"}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-3 rounded-full shadow-md transition-all"
            >
              Explore Portfolio →
            </a>
            <a
              href="https://www.linkedin.com/in/mohammed-nibrasul-haqq-8267162ba/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold text-xs px-5 py-3 rounded-full transition-all"
            >
              LinkedIn ↗
            </a>
            <a
              href="https://github.com/nibrasul"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold text-xs px-5 py-3 rounded-full transition-all"
            >
              GitHub ↗
            </a>
            <a
              href={`mailto:${founder.email || "hello@tapfolio.me"}`}
              className="bg-gray-900 hover:bg-gray-800 text-white font-semibold text-xs px-5 py-3 rounded-full transition-all"
            >
              Contact Nibras
            </a>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
