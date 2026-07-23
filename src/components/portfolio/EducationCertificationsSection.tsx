"use client";

import { motion } from "framer-motion";

export default function EducationCertificationsSection() {
  const certifications = [
    {
      title: "Full-Stack Next.js & React Architecture",
      issuer: "Vercel / Modern Web Standards",
      year: "2025",
      icon: "⚡"
    },
    {
      title: "Cloud Infrastructure & Server Ops",
      issuer: "AWS & Cloudflare Edge",
      year: "2024",
      icon: "☁️"
    },
    {
      title: "NFC Protocols & NDEF Payload Engineering",
      issuer: "Smart Hardware Systems",
      year: "2024",
      icon: "🎴"
    }
  ];

  const recognitions = [
    {
      title: "Co-Founder & CTO at Tapfolio",
      event: "Startup Launch & Product Scale",
      description: "Pioneered NFC smart business card platform connecting physical hardware to live digital identity profiles.",
      year: "2024 – Present"
    },
    {
      title: "Open Source Contributor & Maintainer",
      event: "GitHub Community",
      description: "Published open-source utilities for web automation, PDF invoice engines, and React components.",
      year: "2023 – Present"
    },
    {
      title: "Hackathon & Tech Competition Participant",
      event: "Developer Competitions",
      description: "Built real-time GIS transit mapping prototypes and AI agent CLI assistants under tight timelines.",
      year: "2023 – 2025"
    }
  ];

  return (
    <section
      id="education"
      className="relative w-full bg-[#0A0A0A] py-28 md:py-36 px-6 md:px-16 border-t border-white/10"
    >
      <div className="max-w-[1200px] w-full mx-auto flex flex-col gap-16">
        
        {/* Header */}
        <div className="flex flex-col gap-4">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Academic & Technical Credentials</span>
          <h2 className="text-4xl md:text-6xl font-black font-space-grotesk text-white tracking-tight">
            Education, Certifications & Recognition
          </h2>
          <p className="text-gray-400 max-w-2xl text-base md:text-lg">
            Academic foundations in Computer Science, industry technical certifications, open-source work, and product recognitions.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Education Card (6 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-6 bg-[#111625]/60 border border-white/10 rounded-3xl p-8 flex flex-col justify-between gap-6"
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                  Academic Degree
                </span>
                <span className="text-xs font-bold text-gray-400 font-space-grotesk">2020 – 2023</span>
              </div>

              <h3 className="text-2xl font-bold font-space-grotesk text-white">
                Bachelor of Science in Computer Science
              </h3>

              <span className="text-xs font-semibold text-gray-300">
                University & Higher Education Institute • India
              </span>

              <p className="text-sm text-gray-300 leading-relaxed pt-2">
                Core curriculum focused on object-oriented programming, data structures, algorithms, database design (SQL/RDBMS), computer networks, operating systems, and web architecture.
              </p>

              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Relevant Coursework</span>
                <div className="flex flex-wrap gap-2">
                  {["Data Structures & Algorithms", "Database Management (DBMS)", "Software Engineering", "Computer Networks", "Web Development", "Operating Systems"].map((course, idx) => (
                    <span key={idx} className="bg-white/5 border border-white/10 text-gray-300 text-xs px-2.5 py-1 rounded-md">
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 text-xs text-blue-400 font-semibold flex items-center justify-between">
              <span>Graduate Credential Verified</span>
              <span>BSc CS</span>
            </div>
          </motion.div>

          {/* Certifications Card (6 cols) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-6 bg-[#111625]/60 border border-white/10 rounded-3xl p-8 flex flex-col justify-between gap-6"
          >
            <div className="flex flex-col gap-4">
              <span className="text-xs font-extrabold uppercase tracking-widest text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20 w-fit">
                Specialized Certifications
              </span>

              <h3 className="text-2xl font-bold font-space-grotesk text-white">
                Technical Credentials & Stacks
              </h3>

              <div className="space-y-4 pt-2">
                {certifications.map((cert, cIdx) => (
                  <div key={cIdx} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{cert.icon}</span>
                      <div>
                        <h4 className="text-sm font-bold text-white font-space-grotesk">{cert.title}</h4>
                        <span className="text-xs text-gray-400">{cert.issuer}</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-gray-300 bg-white/10 px-2.5 py-1 rounded">{cert.year}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 text-xs text-purple-400 font-semibold flex items-center justify-between">
              <span>Continuous Learning</span>
              <span>2024–2026</span>
            </div>
          </motion.div>

        </div>

        {/* Recognitions & Open Source Grid */}
        <div className="flex flex-col gap-6 pt-6 border-t border-white/10">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">Open Source & Recognitions</span>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recognitions.map((rec, rIdx) => (
              <motion.div
                key={rIdx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: rIdx * 0.1 }}
                className="bg-[#111625]/40 border border-white/10 rounded-2xl p-6 flex flex-col justify-between gap-4"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-400 font-semibold mb-2">
                    <span className="text-emerald-400">{rec.event}</span>
                    <span>{rec.year}</span>
                  </div>
                  <h4 className="text-lg font-bold font-space-grotesk text-white">{rec.title}</h4>
                  <p className="text-xs text-gray-300 leading-relaxed mt-2">{rec.description}</p>
                </div>
                <a
                  href="https://github.com/nibrasul"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors inline-flex items-center gap-1 mt-2"
                >
                  View GitHub Repositories ↗
                </a>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
