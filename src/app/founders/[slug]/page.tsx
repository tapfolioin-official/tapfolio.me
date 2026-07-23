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

  // Other founder for related content graph
  const otherFounderSlug = Object.keys(foundersData).find((s) => s !== founder.slug);
  const otherFounder = otherFounderSlug ? foundersData[otherFounderSlug] : null;

  const tabs = [
    { id: "overview", label: "Overview", href: `/founders/${founder.slug}` },
    { id: "about", label: "Biography", href: `#biography` },
    { id: "timeline", label: "Journey", href: `#timeline` },
    { id: "skills", label: "Skills", href: `#skills` },
    { id: "projects", label: "Projects", href: `#projects` },
    { id: "faq", label: "FAQ", href: `#faq` },
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

      {/* Main Container */}
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 py-12 flex flex-col gap-16">
        
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="text-xs text-gray-400 font-medium flex items-center gap-2">
          <a href="/" className="hover:text-blue-600 transition-colors">Home</a>
          <span>/</span>
          <a href="/founders" className="hover:text-blue-600 transition-colors">Founders</a>
          <span>/</span>
          <span className="text-gray-900 font-semibold">{founder.name}</span>
        </nav>

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-gray-900 via-gray-950 to-blue-950 text-white rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-10 items-center">
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
          <div className="flex-1 flex flex-col gap-4 text-center md:text-left z-10">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <span className="bg-blue-600/20 text-blue-400 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border border-blue-500/30">
                {founder.jobTitle}
              </span>
              <span className="bg-white/10 text-gray-300 text-xs font-medium px-3.5 py-1.5 rounded-full">
                {founder.company}
              </span>
              <span className="bg-emerald-500/20 text-emerald-300 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-500/30">
                ✓ Verified Founder Entity
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-display font-extrabold tracking-tight text-white">
              {founder.name}
            </h1>

            <p className="text-gray-300 text-base leading-relaxed max-w-2xl">
              {founder.shortSummary}
            </p>

            {/* Actions & Socials */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
              {founder.portfolioUrl && (
                <a
                  href={founder.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-6 py-3 rounded-full transition-all shadow-lg hover:shadow-blue-500/25"
                >
                  View Live Portfolio →
                </a>
              )}
              {founder.email && (
                <a
                  href={`mailto:${founder.email}`}
                  className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-5 py-3 rounded-full transition-all border border-white/15"
                >
                  Contact Founder
                </a>
              )}
              
              <div className="flex items-center gap-3 pl-2">
                {founder.socials.map((s, idx) => (
                  <a
                    key={idx}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-white transition-colors text-xs font-medium underline"
                  >
                    {s.platform}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Anchor Tab Navigation Bar */}
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

        {/* Quick Facts Grid */}
        <section className="bg-gray-50 border border-gray-100 rounded-3xl p-8 flex flex-col gap-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-blue-600">Quick Facts & Entity Data</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <div>
              <span className="text-gray-400 text-xs block">Location</span>
              <span className="font-semibold text-gray-900">{founder.quickFacts.location}</span>
            </div>
            <div>
              <span className="text-gray-400 text-xs block">Nationality</span>
              <span className="font-semibold text-gray-900">{founder.quickFacts.nationality}</span>
            </div>
            <div>
              <span className="text-gray-400 text-xs block">Languages</span>
              <span className="font-semibold text-gray-900">{founder.quickFacts.languages.join(", ")}</span>
            </div>
            <div>
              <span className="text-gray-400 text-xs block">Experience</span>
              <span className="font-semibold text-gray-900">{founder.quickFacts.experienceYears}</span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-400 text-xs block">Specialization</span>
              <span className="font-semibold text-gray-900">{founder.quickFacts.specialization}</span>
            </div>
            <div className="col-span-2">
              <span className="text-gray-400 text-xs block">Availability</span>
              <span className="font-semibold text-gray-900">{founder.quickFacts.availability}</span>
            </div>
          </div>
        </section>

        {/* Biography Section */}
        <section id="biography" className="flex flex-col gap-6 scroll-mt-28">
          <div className="border-b border-gray-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Biography & Leadership</span>
            <h2 className="text-3xl font-bold text-gray-950 mt-1">About {founder.name}</h2>
          </div>
          <div className="prose prose-gray max-w-none space-y-5 text-gray-600 leading-relaxed text-base">
            {founder.biography.map((paragraph, pIdx) => (
              <p key={pIdx}>{paragraph}</p>
            ))}
          </div>
        </section>

        {/* Career Timeline */}
        <section id="timeline" className="flex flex-col gap-8 scroll-mt-28">
          <div className="border-b border-gray-100 pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Career Milestones</span>
            <h2 className="text-3xl font-bold text-gray-950 mt-1">Journey & Progression</h2>
          </div>
          <div className="relative border-l-2 border-blue-100 ml-4 pl-6 space-y-8">
            {founder.timeline.map((item, tIdx) => (
              <div key={tIdx} className="relative group">
                <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-blue-600 border-4 border-white ring-4 ring-blue-50" />
                <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest">{item.year}</span>
                <h3 className="text-xl font-bold text-gray-900 mt-0.5">{item.title}</h3>
                <p className="text-gray-500 text-sm mt-1">{item.description}</p>
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
                  <p className="text-gray-500 text-sm leading-relaxed">{proj.description}</p>
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

        {/* Related Entity Content Graph */}
        <section className="bg-blue-50/50 border border-blue-100 rounded-3xl p-8 flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Knowledge Graph Links</span>
            <h2 className="text-2xl font-bold text-gray-950">Related Tapfolio Entities</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {otherFounder && (
              <a
                href={`/founders/${otherFounder.slug}`}
                className="bg-white border border-gray-200 rounded-2xl p-6 flex items-center gap-4 hover:shadow-md transition-all group"
              >
                <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-blue-500/20 bg-gray-100 flex-shrink-0">
                  <AvatarImage src={otherFounder.avatar} alt={otherFounder.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <span className="text-xs font-bold text-blue-600 uppercase block">Co-Founder Entity</span>
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{otherFounder.name}</h3>
                  <span className="text-xs text-gray-500">{otherFounder.jobTitle}</span>
                </div>
              </a>
            )}

            <a
              href="/about"
              className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-center gap-1 hover:shadow-md transition-all group"
            >
              <span className="text-xs font-bold text-blue-600 uppercase">Organization Entity</span>
              <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">Tapfolio Company Story & Mission</h3>
              <span className="text-xs text-gray-500">Explore Tapfolio history and core product values →</span>
            </a>
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

      </main>

      <Footer />
    </div>
  );
}
