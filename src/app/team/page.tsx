/**
 * TEAM PAGE — SELF-CONTAINED
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
  title: "Meet the Team | Professional Departments",
  description: "Explore Tapfolio's cross-functional team across Engineering, Product, Design, Marketing, and Operations. Meet the experts building the smart card ecosystem.",
  path: "/team",
});

/**
 * Team page component.
 * Organizes members by department and outputs Person structured data.
 * 
 * @returns {React.ReactElement} Team page layout
 */
export default function TeamPage() {
  const departments = [
    {
      name: "Leadership",
      members: [
        { name: "Mohammed Nibrasul Haqq", role: "Co-founder & CTO", bio: "Reinventing networking using NFC cards.", image: "/nibras.png", profileUrl: "/founders/mohammed-nibrasul-haqq" },
        { name: "Abhinand", role: "Co-founder & CEO", bio: "Designing hardware and dynamic platforms.", image: "/abhinand.png", profileUrl: "/founders/abhinand" }
      ]
    },
    {
      name: "Engineering",
      members: [
        { name: "Sarah Jenkins", role: "Lead Full Stack Developer", bio: "Revising client-facing dashboard and NextJS matching engine APIs.", image: "/avatar.png" },
        { name: "David K.", role: "Senior Mobile Engineer", bio: "Rebuilding and optimizing the Flutter app and native services.", image: "/avatar.png" }
      ]
    },
    {
      name: "Product & Design",
      members: [
        { name: "Marcus Chen", role: "Director of Product", bio: "Managing lifecycle and hardware distribution strategy.", image: "/avatar.png" },
        { name: "Elena Rostova", role: "Creative Director", bio: "Crafting modern, beautiful profiles and user interfaces.", image: "/avatar.png" }
      ]
    },
    {
      name: "Growth & Operations",
      members: [
        { name: "Sophia Patel", role: "Head of Growth", bio: "Connecting professionals worldwide with Tapfolio.", image: "/avatar.png" },
        { name: "James Miller", role: "Operations Lead", bio: "Managing custom enterprise card engraving pipeline.", image: "/avatar.png" }
      ]
    }
  ];

  const flatMembers = departments.flatMap(d => 
    d.members.map(m => ({
      name: m.name,
      jobTitle: m.role,
      description: m.bio,
      image: m.image,
      url: `https://www.tapfolio.me/team#${m.name.toLowerCase().replace(/ /g, '-')}`
    }))
  );

  const schema = {
    "@context": "https://schema.org",
    "@graph": flatMembers.map(m => getPersonSchema(m))
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
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">Our Experts</span>
          <h1 className="text-5xl font-display font-extrabold tracking-tight text-gray-950">
            Meet the <span className="text-blue-600">Team</span>
          </h1>
          <p className="text-gray-500 leading-relaxed">
            The cross-functional professionals behind Tapfolio&apos;s software and hardware success.
          </p>
        </section>

        {/* Departments Listing */}
        <div className="flex flex-col gap-16">
          {departments.map((dept, dIdx) => (
            <section key={dIdx} className="flex flex-col gap-8">
              <h2 className="text-2xl font-bold text-gray-950 border-b border-gray-100 pb-2">
                {dept.name}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {dept.members.map((m: any, mIdx) => (
                  <div 
                    key={mIdx} 
                    id={m.name.toLowerCase().replace(/ /g, '-')}
                    className="border border-gray-100 rounded-2xl p-6 bg-white flex flex-col items-center text-center gap-4 hover:shadow-lg transition-all"
                  >
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-100 bg-gray-50 flex items-center justify-center">
                      <AvatarImage 
                        src={m.image} 
                        alt={m.name} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="font-bold text-gray-950 text-base">{m.name}</h3>
                      <span className="text-xs font-medium text-gray-400">{m.role}</span>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed max-w-xs">{m.bio}</p>
                    {m.profileUrl && (
                      <a
                        href={m.profileUrl}
                        className="text-xs font-bold text-blue-600 hover:underline mt-1"
                      >
                        View Entity Profile →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
