"use client";

import { motion } from "framer-motion";

interface SkillCategory {
  title: string;
  subtitle: string;
  description: string;
  skills: string[];
  icon: string;
}

const skillCategories: SkillCategory[] = [
  {
    title: "Full-Stack Web Architecture",
    subtitle: "Modern Next.js & React Ecosystems",
    description: "Architecting high-performance web applications with server-side rendering, dynamic API routes, clean component systems, and sub-second page loads.",
    skills: ["Next.js (App Router)", "React 19", "TypeScript", "TailwindCSS", "Framer Motion", "GSAP"],
    icon: "⚡"
  },
  {
    title: "Hardware & NFC Systems",
    subtitle: "Direct Physical-to-Digital Sync",
    description: "Engineering NDEF data structures, NFC card provisioning pipelines, custom URL routing, and seamless contact sharing for physical smart cards.",
    skills: ["NTAG215/216 Chips", "NDEF Data Formats", "Contactless Protocols", "Enterprise Card Provisioning"],
    icon: "🎴"
  },
  {
    title: "Cloud, Backend & Databases",
    subtitle: "Scalable Infrastructure & APIs",
    description: "Designing RESTful and GraphQL APIs, relational database schemas, real-time WebSockets, and edge cloud deployments.",
    skills: ["Node.js", "Express", "PostgreSQL", "Prisma ORM", "Supabase", "Redis", "Vercel", "AWS"],
    icon: "☁️"
  },
  {
    title: "AI Agents & System Automation",
    subtitle: "Intelligent Workflows & Machine Learning",
    description: "Integrating LLM APIs, building autonomous developer AI agents, CLI shell assistants, and geospatial machine learning pipelines.",
    skills: ["OpenAI APIs", "AI Agents", "Python", "TensorFlow", "Pandas", "Vector Search", "CLI Automation"],
    icon: "🤖"
  }
];

export default function ServicesSection() {
  return (
    <section
      id="skills"
      className="relative w-full bg-[#0A0A0A] py-28 md:py-36 px-6 md:px-16 border-t border-white/10"
    >
      <div className="max-w-[1200px] w-full mx-auto flex flex-col gap-16">
        
        {/* Header */}
        <div className="flex flex-col gap-4">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Technical Competencies</span>
          <h2 className="text-4xl md:text-6xl font-black font-space-grotesk text-white tracking-tight">
            Skills & Capabilities
          </h2>
          <p className="text-gray-400 max-w-2xl text-base md:text-lg">
            Core technical domains and software stacks specialized across web applications, cloud infrastructure, NFC hardware, and AI automation.
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillCategories.map((cat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#111625]/60 border border-white/10 rounded-3xl p-8 flex flex-col justify-between gap-6 hover:border-blue-500/40 transition-all"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-2xl">
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold font-space-grotesk text-white">{cat.title}</h3>
                    <span className="text-xs font-semibold text-blue-400">{cat.subtitle}</span>
                  </div>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed pt-2">
                  {cat.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                {cat.skills.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold px-3 py-1.5 rounded-lg"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}