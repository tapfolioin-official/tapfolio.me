/**
 * FOUNDERS PAGE — SELF-CONTAINED
 * All dependencies are co-located in _components/ and _lib/ directories.
 * This page can be freely moved to any folder and will work independently.
 */

import React from "react";
import Navbar from "./_components/Navbar";
import Footer from "./_components/Footer";
import AvatarImage from "./_components/AvatarImage";
import { generatePageMetadata } from "./_lib/metadata";
import { getPersonSchema } from "./_lib/schemas";

export const metadata = generatePageMetadata({
  title: "Co-Founders | Leadership & Vision",
  description: "Meet the founders of Tapfolio. Discover the vision, experience, and leadership driving the next generation of professional networking products.",
  path: "/founders",
});

/**
 * Founders page component.
 * Displays co-founder details, photos, and Person schemas.
 * 
 * @returns {React.ReactElement} Founders page layout
 */
export default function FoundersPage() {
  const founders = [
    {
      slug: "mohammed-nibrasul-haqq",
      name: "Mohammed Nibrasul Haqq",
      jobTitle: "Co-founder & CTO",
      description: "Co-founder & Chief Technology Officer of Tapfolio. Visionary builder focused on reinventing professional networking using state-of-the-art NFC technology and modern web platforms.",
      image: "/nibras.png",
      url: "https://www.tapfolio.me/founders/mohammed-nibrasul-haqq",
      vision: " frictionless, memorable, and green professional networking for the world.",
      experience: "Senior Software Engineer & Tech Lead specializing in web architectures and scalable direct matching ecosystems.",
      sameAs: ["https://www.linkedin.com/in/mohammed-nibrasul-haqq-8267162ba/", "https://github.com/nibrasul"]
    },
    {
      slug: "abhinand",
      name: "Abhinand",
      jobTitle: "Co-founder & CEO",
      description: "Co-founder & Chief Executive Officer of Tapfolio. Passionate systems engineer and creative designer driving the software architecture and physical device provisioning pipelines.",
      image: "/abhinand.png",
      url: "https://www.tapfolio.me/founders/abhinand",
      vision: "Bridging the gap between the physical medium and the real-time digital connection hub.",
      experience: "Lead Systems Architect with deep experience designing hardware integrations, real-time sync systems, and responsive designs.",
      sameAs: ["https://www.linkedin.com/in/abhinand-ks-428387332/", "#"]
    }
  ];

  const schema = {
    "@context": "https://schema.org",
    "@graph": founders.map(f => getPersonSchema(f))
  };

  return (
    <div className="bg-white min-h-screen text-gray-900 font-sans selection:bg-blue-100 flex flex-col pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <Navbar />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 py-16 flex flex-col gap-16">
        {/* Header */}
        <section className="text-center max-w-2xl mx-auto flex flex-col gap-4 mt-8">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Our Leadership</span>
          <h1 className="text-5xl font-display font-extrabold tracking-tight text-gray-950">
            Meet the <span className="text-blue-600">Founders</span>
          </h1>
          <p className="text-gray-500 leading-relaxed">
            The builders shaping the future of physical and digital networking cards.
          </p>
        </section>

        {/* Founders Listing Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {founders.map((f, idx) => (
            <div
              key={idx}
              className="border border-gray-100 bg-white rounded-3xl p-8 flex flex-col items-center text-center gap-6 hover:shadow-xl transition-all"
            >
              {/* Photo */}
              <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-blue-500/20 bg-gray-100 flex items-center justify-center">
                <AvatarImage
                  src={f.image}
                  alt={f.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Identity */}
              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold text-gray-950">{f.name}</h2>
                <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">{f.jobTitle}</span>
              </div>

              {/* Bio & Vision */}
              <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
                {f.description}
              </p>

              <hr className="w-full border-gray-100" />

              <div className="flex flex-col gap-4 text-left w-full">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase">Expertise</span>
                  <p className="text-sm text-gray-700 font-medium">{f.experience}</p>
                </div>
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase">Vision Statement</span>
                  <p className="text-sm text-gray-700 italic">&quot;{f.vision}&quot;</p>
                </div>
              </div>

              {/* Profile Links & CTA */}
              <div className="flex flex-col gap-3 w-full mt-2">
                <a
                  href={`/founders/${f.slug}`}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-3 rounded-full transition-all text-center"
                >
                  View Full Entity Profile →
                </a>
                <div className="flex justify-center gap-4">
                  {f.sameAs.map((link, lIdx) => (
                    <a
                      key={lIdx}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-gray-500 hover:text-blue-600 hover:underline"
                    >
                      {link.includes('github') ? 'GitHub' : 'LinkedIn'}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>
      </main>

      <Footer />
    </div>
  );
}
