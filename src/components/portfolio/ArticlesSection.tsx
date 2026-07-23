"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface JournalTopic {
  id: string;
  title: string;
  category: "Engineering" | "Startup" | "NFC & Hardware" | "AI Automation";
  status: "Upcoming Journal Entry" | "In Research" | "Drafting";
  abstract: string;
  tags: string[];
}

const upcomingTopics: JournalTopic[] = [
  {
    id: "top-1",
    title: "How We Designed Tapfolio's NFC Architecture & Real-Time Profile Routing",
    category: "Engineering",
    status: "Upcoming Journal Entry",
    abstract: "An engineering retrospective on designing Tapfolio's Next.js App Router platform, NDEF payload provisioning algorithms, and low-latency profile rendering pipelines.",
    tags: ["Next.js", "NFC Hardware", "Architecture", "SaaS"]
  },
  {
    id: "top-2",
    title: "Lessons From Co-Founding & Building a SaaS Startup in India",
    category: "Startup",
    status: "Upcoming Journal Entry",
    abstract: "Reflections on product engineering, hardware-software integration, finding early user traction, and navigating technical decisions as CTO.",
    tags: ["Startup Journey", "SaaS", "CTO Insights", "Product Strategy"]
  },
  {
    id: "top-3",
    title: "NFC Protocols & NDEF Payload Engineering for Web Developers",
    category: "NFC & Hardware",
    status: "In Research",
    abstract: "A technical deep dive into NTAG215 and NTAG216 memory bank layouts, record types, URI record formatting, and native mobile contactless handshakes.",
    tags: ["NFC", "NDEF", "Protocols", "Mobile Sync"]
  },
  {
    id: "top-4",
    title: "Autonomous AI Agents for Local Development & Cloud Server Orchestration",
    category: "AI Automation",
    status: "Drafting",
    abstract: "Architecting an event-driven voice and CLI shell assistant utilizing OpenAI APIs and Node.js microservices to automate server ops and environment setups.",
    tags: ["AI Agents", "OpenAI API", "Node.js", "CLI Automation"]
  }
];

export default function ArticlesSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");

  const categories = ["All", "Engineering", "Startup", "NFC & Hardware", "AI Automation"];

  const filteredTopics = selectedCategory === "All"
    ? upcomingTopics
    : upcomingTopics.filter((t) => t.category === selectedCategory);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 4000);
    }
  };

  return (
    <section
      id="articles"
      className="relative w-full bg-[#0A0A0A] py-28 md:py-36 px-6 md:px-16 border-t border-white/10"
    >
      <div className="max-w-[1200px] w-full mx-auto flex flex-col gap-16">
        
        {/* Section Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3.5 py-1 rounded-full border border-blue-500/20">
              Engineering Journal & Insights
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              🟢 Publishing Soon
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black font-space-grotesk text-white tracking-tight">
            Articles & Insights
          </h2>
          <p className="text-gray-400 max-w-2xl text-base md:text-lg">
            Original engineering essays, SaaS startup retrospectives, NFC protocol deep dives, and AI automation notes authored by Mohammed Nibrasul Haqq.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-white/10 pb-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/25"
                  : "bg-white/5 text-gray-400 hover:text-white border border-white/10"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Upcoming Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredTopics.map((topic, idx) => (
            <motion.div
              key={topic.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#111625]/60 border border-white/10 rounded-3xl p-8 flex flex-col justify-between gap-6 hover:border-blue-500/40 transition-all group"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between text-xs text-gray-400 font-semibold">
                  <span className="text-blue-400 uppercase tracking-wider bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                    {topic.category}
                  </span>
                  <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                    {topic.status}
                  </span>
                </div>

                <h3 className="text-2xl font-bold font-space-grotesk text-white group-hover:text-blue-300 transition-colors leading-tight">
                  {topic.title}
                </h3>

                <p className="text-gray-300 text-sm leading-relaxed">
                  {topic.abstract}
                </p>
              </div>

              <div className="flex flex-col gap-4 pt-4 border-t border-white/10">
                <div className="flex flex-wrap gap-2">
                  {topic.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="bg-white/5 border border-white/10 text-gray-400 text-xs font-medium px-2.5 py-1 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs pt-2">
                  <span className="text-gray-500">By Mohammed Nibrasul Haqq</span>
                  <span className="text-blue-400 font-bold">Release Pending →</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Newsletter / Journal Subscription Box */}
        <div className="bg-gradient-to-r from-[#111625] via-blue-950/40 to-[#111625] border border-white/10 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="flex flex-col gap-2 max-w-xl text-left">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Engineering Journal Updates</span>
            <h3 className="text-2xl md:text-3xl font-bold font-space-grotesk text-white">
              Get Notified When New Technical Essays Publish
            </h3>
            <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
              Subscribe to receive new technical write-ups on Next.js architectures, NFC protocols, Flutter systems, and SaaS startup insights directly in your inbox.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address..."
              className="px-5 py-3.5 bg-black/60 border border-white/15 rounded-full text-xs text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 w-full sm:w-72"
            />
            <button
              type="submit"
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-space-grotesk font-bold rounded-full text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-600/25 cursor-pointer whitespace-nowrap"
            >
              {subscribed ? "✓ Subscribed!" : "Subscribe Updates →"}
            </button>
          </form>
        </div>

      </div>
    </section>
  );
}
