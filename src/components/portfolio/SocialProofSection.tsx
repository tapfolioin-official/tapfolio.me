"use client";

import { motion } from "framer-motion";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "Nibras architected Tapfolio's Next.js platform and NFC provisioning pipelines with remarkable speed and technical clarity. His vision for digital identity is second to none.",
    author: "Abhinand",
    role: "Co-Founder & CEO",
    company: "Tapfolio"
  },
  {
    quote: "Delivered a storytelling e-commerce platform for Old School Tea that elevated our brand presence and optimized digital customer conversions.",
    author: "Client Partner",
    role: "Brand Founder",
    company: "Old School Tea"
  }
];

export default function SocialProofSection() {
  return (
    <section
      id="credentials"
      className="relative w-full bg-[#0A0A0A] py-28 md:py-36 px-6 md:px-16 border-t border-white/10"
    >
      <div className="max-w-[1200px] w-full mx-auto flex flex-col gap-16">
        
        {/* Section Header */}
        <div className="flex flex-col gap-4">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Trust & Authority</span>
          <h2 className="text-4xl md:text-6xl font-black font-space-grotesk text-white tracking-tight">
            Education, Open Source & Endorsements
          </h2>
          <p className="text-gray-400 max-w-2xl text-base md:text-lg">
            Academic foundation, open-source software contributions, client testimonials, and industry achievements.
          </p>
        </div>

        {/* 2-Column Grid: Education & Open Source | Testimonials & Awards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          
          {/* Education & Certifications Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#111625]/60 border border-white/10 rounded-3xl p-8 flex flex-col justify-between gap-6"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl p-2 bg-blue-500/10 border border-blue-500/20 rounded-xl">🎓</span>
                <div>
                  <h3 className="text-2xl font-bold font-space-grotesk text-white">Education & Academics</h3>
                  <span className="text-xs text-blue-400 font-semibold">Computer Science & Systems</span>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-300 block">Degree & Institution</span>
                <h4 className="text-lg font-bold text-white font-space-grotesk">Bachelor of Science in Computer Science (BSc CS)</h4>
                <p className="text-xs text-gray-400">Core Focus: Data Structures, RDBMS, Software Engineering, Distributed Systems & Networking.</p>
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">Relevant Coursework & Competencies</span>
                <div className="flex flex-wrap gap-2">
                  {["Data Structures & Algorithms", "Relational Database Systems", "Operating Systems", "Computer Networks", "Object-Oriented Programming"].map((course, cIdx) => (
                    <span key={cIdx} className="bg-white/5 border border-white/10 text-gray-300 text-xs px-3 py-1 rounded-lg">
                      • {course}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Certifications Badge Bar */}
            <div className="pt-4 border-t border-white/10 flex flex-col gap-2 text-xs">
              <span className="font-bold text-gray-400 uppercase tracking-wider">Technical Certifications & Training</span>
              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-500/10 border border-blue-500/20 text-blue-300 px-3 py-1 rounded-md font-semibold">Next.js Enterprise Systems</span>
                <span className="bg-purple-500/10 border border-purple-500/20 text-purple-300 px-3 py-1 rounded-md font-semibold">NFC NDEF Payload Standards</span>
                <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-3 py-1 rounded-md font-semibold">Flutter Cross-Platform Sync</span>
              </div>
            </div>
          </motion.div>

          {/* Open Source & Testimonials Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#111625]/60 border border-white/10 rounded-3xl p-8 flex flex-col justify-between gap-6"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl p-2 bg-purple-500/10 border border-purple-500/20 rounded-xl">🌟</span>
                <div>
                  <h3 className="text-2xl font-bold font-space-grotesk text-white">Open Source & Testimonials</h3>
                  <span className="text-xs text-purple-400 font-semibold">Community Impact & Client Trust</span>
                </div>
              </div>

              {/* Open Source Highlight */}
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-purple-300">GitHub Contributions</span>
                  <a
                    href="https://github.com/nibrasul"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-blue-400 hover:text-blue-300"
                  >
                    @nibrasul ↗
                  </a>
                </div>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Active contributor to open-source developer tooling, utility scripts, NFC data parsers, and public code repositories.
                </p>
              </div>

              {/* Testimonials */}
              <div className="space-y-3 pt-1">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">Endorsements</span>
                {testimonials.map((t, tIdx) => (
                  <div key={tIdx} className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
                    <p className="text-xs text-gray-200 italic leading-relaxed">
                      &quot;{t.quote}&quot;
                    </p>
                    <div className="text-[11px] font-bold text-blue-300">
                      — {t.author}, <span className="text-gray-400 font-normal">{t.role} @ {t.company}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hackathons & Awards Bar */}
            <div className="pt-4 border-t border-white/10 flex flex-col gap-2 text-xs">
              <span className="font-bold text-gray-400 uppercase tracking-wider">Accolades & Hackathons</span>
              <div className="flex flex-wrap gap-2 text-xs text-gray-300">
                <span className="bg-amber-500/10 border border-amber-500/20 text-amber-300 px-3 py-1 rounded-md font-semibold">🏆 Startup Pitch Finalist</span>
                <span className="bg-blue-500/10 border border-blue-500/20 text-blue-300 px-3 py-1 rounded-md font-semibold">⚡ Hackathon Builder Winner</span>
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
