"use client";

import { motion } from "framer-motion";

interface RepoHighlight {
  name: string;
  desc: string;
  tech: string[];
  link: string;
}

const publicRepos: RepoHighlight[] = [
  {
    name: "Add-1 (Tapfolio Platform)",
    desc: "Tapfolio core SaaS web engine, NFC provisioning pipelines, and real-time digital identity system.",
    tech: ["Next.js", "TypeScript", "PostgreSQL", "TailwindCSS"],
    link: "https://github.com/nibrasul/Add-1"
  },
  {
    name: "JARVIS AI Suite",
    desc: "Autonomous CLI & voice shell assistant for developer ops and cloud server maintenance.",
    tech: ["Node.js", "OpenAI API", "Python", "CLI"],
    link: "https://github.com/nibrasul"
  },
  {
    name: "Spatial Crime Analytics",
    desc: "Predictive geospatial ML modeling and D3.js temporal density visualization dashboard.",
    tech: ["Python", "TensorFlow", "React", "D3.js"],
    link: "https://github.com/nibrasul"
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
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Professional Credibility</span>
          <h2 className="text-4xl md:text-6xl font-black font-space-grotesk text-white tracking-tight">
            Education, Community & Recognition
          </h2>
          <p className="text-gray-400 max-w-2xl text-base md:text-lg">
            Academic credentials, public software repositories, startup ecosystem involvement, and genuine team endorsements.
          </p>
        </div>

        {/* 4-Card Multi-Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Card 1: Education & Academic Credentials */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#111625]/60 border border-white/10 rounded-3xl p-8 flex flex-col justify-between gap-6 hover:border-blue-500/30 transition-all"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-2xl">🎓</span>
                <div>
                  <h3 className="text-2xl font-bold font-space-grotesk text-white">Education</h3>
                  <span className="text-xs text-blue-400 font-semibold">Academic Foundation</span>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-300">Degree</span>
                  <span className="text-xs font-bold text-gray-400 font-space-grotesk">2023 – 2026</span>
                </div>
                <h4 className="text-lg font-bold text-white font-space-grotesk">Bachelor of Science in Computer Science (BSc CS)</h4>
                <p className="text-xs text-gray-300 font-medium">St. Albert&apos;s College (Autonomous), Kochi, Kerala</p>
              </div>

              <div className="space-y-2 pt-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Relevant Coursework</span>
                <div className="flex flex-wrap gap-2">
                  {["Data Structures", "Database Management Systems", "Computer Networks", "Operating Systems", "Software Engineering"].map((course, cIdx) => (
                    <span key={cIdx} className="bg-white/5 border border-white/10 text-gray-300 text-xs px-3 py-1 rounded-lg">
                      • {course}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 flex flex-col gap-2 text-xs">
              <span className="font-bold text-gray-400 uppercase tracking-wider">Technical Expertise Domains</span>
              <div className="flex flex-wrap gap-2">
                <span className="bg-blue-500/10 border border-blue-500/20 text-blue-300 px-3 py-1 rounded-md font-semibold">Next.js Enterprise Architecture</span>
                <span className="bg-purple-500/10 border border-purple-500/20 text-purple-300 px-3 py-1 rounded-md font-semibold">NFC NDEF Payload Standards</span>
                <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 px-3 py-1 rounded-md font-semibold">Flutter Cross-Platform Sync</span>
              </div>
            </div>
          </motion.div>

          {/* Card 2: Open Source & Public Repositories */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#111625]/60 border border-white/10 rounded-3xl p-8 flex flex-col justify-between gap-6 hover:border-purple-500/30 transition-all"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl p-2.5 bg-purple-500/10 border border-purple-500/20 rounded-2xl">💻</span>
                  <div>
                    <h3 className="text-2xl font-bold font-space-grotesk text-white">Open Source</h3>
                    <span className="text-xs text-purple-400 font-semibold">GitHub Code & Repositories</span>
                  </div>
                </div>
                <a
                  href="https://github.com/nibrasul"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20"
                >
                  github.com/nibrasul ↗
                </a>
              </div>

              <div className="space-y-3 pt-1">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Featured Public Repositories</span>
                {publicRepos.map((repo, rIdx) => (
                  <a
                    key={rIdx}
                    href={repo.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 flex flex-col gap-2 transition-all block group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white font-space-grotesk group-hover:text-blue-300 transition-colors">
                        {repo.name}
                      </span>
                      <span className="text-xs text-blue-400 font-bold">↗</span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">{repo.desc}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {repo.tech.map((t, tIdx) => (
                        <span key={tIdx} className="bg-white/5 text-gray-400 text-[10px] px-2 py-0.5 rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Card 3: Community & Startup Ecosystem */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#111625]/60 border border-white/10 rounded-3xl p-8 flex flex-col justify-between gap-6 hover:border-emerald-500/30 transition-all"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">🌍</span>
                <div>
                  <h3 className="text-2xl font-bold font-space-grotesk text-white">Community & Startup Programs</h3>
                  <span className="text-xs text-emerald-400 font-semibold">Incubation & Hackathons</span>
                </div>
              </div>

              <div className="space-y-3 pt-1">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">Startup Incubation</span>
                  <h4 className="text-sm font-bold text-white font-space-grotesk">Tapfolio Product Development & Launch</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">Incubating and building Tapfolio&apos;s physical-digital networking ecosystem in Kochi & Bangalore.</p>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">Developer Ecosystem</span>
                  <h4 className="text-sm font-bold text-white font-space-grotesk">Kerala Startup & Hackathon Builder Initiatives</h4>
                  <p className="text-xs text-gray-300 leading-relaxed">Participating in regional software developer meetups, open-source sprints, and technical workshops.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 4: Products Built & Collaborations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#111625]/60 border border-white/10 rounded-3xl p-8 flex flex-col justify-between gap-6 hover:border-amber-500/30 transition-all"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl">🤝</span>
                <div>
                  <h3 className="text-2xl font-bold font-space-grotesk text-white">Worked With & Built</h3>
                  <span className="text-xs text-amber-400 font-semibold">Platforms & Collaborations</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-1">
                  <span className="text-xs font-bold text-white font-space-grotesk">Tapfolio</span>
                  <span className="text-[10px] text-blue-400 font-semibold">Co-Founder & CTO</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-1">
                  <span className="text-xs font-bold text-white font-space-grotesk">Old School Tea</span>
                  <span className="text-[10px] text-purple-400 font-semibold">Client E-Commerce</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-1">
                  <span className="text-xs font-bold text-white font-space-grotesk">LocalConnect</span>
                  <span className="text-[10px] text-emerald-400 font-semibold">Founder & Mobile</span>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col gap-1">
                  <span className="text-xs font-bold text-white font-space-grotesk">Invoice Printer</span>
                  <span className="text-[10px] text-amber-400 font-semibold">Business Utility</span>
                </div>
              </div>
            </div>

            <div className="pt-2 text-xs text-gray-400 flex items-center justify-between border-t border-white/10">
              <span>Verified Founders & Products</span>
              <a href="https://www.tapfolio.me/founders" className="text-blue-400 hover:text-blue-300 font-bold">
                Tapfolio Founders →
              </a>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
