"use client";

import { motion } from "framer-motion";

interface Article {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  abstract: string;
  tags: string[];
  link?: string;
}

const articles: Article[] = [
  {
    id: "art-1",
    title: "Building Tapfolio: Bridging Tactile NFC Cards with Real-Time Web Architecture",
    category: "SaaS & Architecture",
    date: "February 10, 2026",
    readTime: "8 min read",
    abstract: "An engineering retrospective on designing Tapfolio's Next.js App Router platform, NDEF payload provisioning algorithms, and low-latency profile rendering pipelines scaling to thousands of active professionals.",
    tags: ["Next.js", "NFC", "Architecture", "SaaS"],
    link: "/founders/mohammed-nibrasul-haqq"
  },
  {
    id: "art-2",
    title: "NFC Protocols & NDEF Payload Engineering for Modern Web Developers",
    category: "Hardware & NFC",
    date: "January 20, 2026",
    readTime: "6 min read",
    abstract: "A technical deep dive into NTAG215 and NTAG216 memory bank layouts, record types, URI record formatting, and native iOS & Android browser contactless handshake protocols.",
    tags: ["NFC Hardware", "NDEF", "Protocols", "Mobile"],
    link: "/founders/mohammed-nibrasul-haqq"
  },
  {
    id: "art-3",
    title: "Flutter & Next.js Hybrid Architectures for Digital Identity Ecosystems",
    category: "Mobile & Full-Stack",
    date: "November 15, 2025",
    readTime: "10 min read",
    abstract: "Lessons learned building cross-platform Flutter applications that sync seamlessly with Next.js web applications, managing state synchronization, offline caching, and instant lead capture.",
    tags: ["Flutter", "Next.js", "State Sync", "Mobile"],
    link: "/founders/mohammed-nibrasul-haqq"
  },
  {
    id: "art-4",
    title: "Autonomous AI Agents for Local Development & Server Orchestration",
    category: "AI Automation",
    date: "September 5, 2025",
    readTime: "7 min read",
    abstract: "Architecting an event-driven voice and CLI shell assistant utilizing OpenAI APIs and Node.js microservices to automate server maintenance, environment provisioning, and database operations.",
    tags: ["AI Agents", "OpenAI API", "Node.js", "Automation"],
    link: "/founders/mohammed-nibrasul-haqq"
  }
];

export default function ArticlesSection() {
  return (
    <section
      id="articles"
      className="relative w-full bg-[#0A0A0A] py-28 md:py-36 px-6 md:px-16 border-t border-white/10"
    >
      <div className="max-w-[1200px] w-full mx-auto flex flex-col gap-16">
        
        {/* Section Header */}
        <div className="flex flex-col gap-4">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Technical Articles & Insights</span>
          <h2 className="text-4xl md:text-6xl font-black font-space-grotesk text-white tracking-tight">
            Writing & Engineering Notes
          </h2>
          <p className="text-gray-400 max-w-2xl text-base md:text-lg">
            Original articles authored by Mohammed Nibrasul Haqq on full-stack architecture, NFC protocols, Flutter mobile development, and AI agent automation.
          </p>
        </div>

        {/* Articles List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {articles.map((art, idx) => (
            <motion.div
              key={art.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#111625]/50 border border-white/10 rounded-3xl p-8 flex flex-col justify-between gap-6 hover:border-blue-500/40 transition-all group"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between text-xs text-gray-400 font-semibold">
                  <span className="text-blue-400 uppercase tracking-wider bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                    {art.category}
                  </span>
                  <span>{art.date} • {art.readTime}</span>
                </div>

                <h3 className="text-2xl font-bold font-space-grotesk text-white group-hover:text-blue-300 transition-colors leading-tight">
                  {art.title}
                </h3>

                <p className="text-gray-300 text-sm leading-relaxed">
                  {art.abstract}
                </p>
              </div>

              <div className="flex flex-col gap-4 pt-4 border-t border-white/10">
                <div className="flex flex-wrap gap-2">
                  {art.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="bg-white/5 border border-white/10 text-gray-400 text-xs font-medium px-2.5 py-1 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>

                {art.link && (
                  <a
                    href={art.link}
                    className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 mt-1"
                  >
                    Read Full Article & Entity Record →
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
