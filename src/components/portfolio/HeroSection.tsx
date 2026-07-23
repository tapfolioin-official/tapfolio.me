"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section 
      id="hero"
      ref={containerRef}
      className="relative w-full min-h-screen flex flex-col justify-center items-center px-6 md:px-16 pt-28 pb-16 bg-[#0A0A0A] overflow-hidden"
    >
      {/* Radial Glow */}
      <div 
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none"
      />
      <div 
        className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"
      />

      {/* Main Container */}
      <div className="relative z-10 max-w-[1200px] w-full mx-auto flex flex-col items-center text-center gap-8">
        
        {/* Entity Verified Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2.5 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold tracking-wide text-blue-300">
            Co-Founder & CTO @ Tapfolio • Full-Stack Systems & AI Architect
          </span>
        </motion.div>

        {/* Primary Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4 max-w-4xl"
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black font-space-grotesk tracking-tight text-white leading-[1.05]">
            Mohammed <br className="hidden md:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-white bg-clip-text text-transparent">
              Nibrasul Haqq
            </span>
          </h1>
          
          {/* Rich Intro Sentence targeting Entity SEO */}
          <p className="text-lg md:text-xl font-inter font-normal text-gray-200 max-w-3xl mx-auto leading-relaxed pt-2">
            <strong>Mohammed Nibrasul Haqq</strong> is an Indian software engineer, Co-Founder & CTO of Tapfolio, specializing in NFC technology, SaaS platforms, Flutter, Next.js, AI integrations, and digital identity products.
          </p>
        </motion.div>

        {/* Action CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-center gap-4 pt-2"
        >
          <button
            onClick={() => scrollToSection("projects")}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-space-grotesk font-bold rounded-full text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-600/25 hover:scale-105 cursor-pointer"
          >
            Explore Projects & Case Studies ↓
          </button>
          
          <a
            href="https://www.linkedin.com/in/mohammed-nibrasul-haqq-8267162ba/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-space-grotesk font-semibold rounded-full text-xs uppercase tracking-widest transition-all border border-white/15 hover:scale-105"
          >
            LinkedIn Profile ↗
          </a>

          <a
            href="https://github.com/nibrasul"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-space-grotesk font-semibold rounded-full text-xs uppercase tracking-widest transition-all border border-white/15 hover:scale-105"
          >
            GitHub Repositories ↗
          </a>

          <a
            href="/founders/mohammed-nibrasul-haqq"
            className="px-6 py-4 bg-blue-950/60 hover:bg-blue-900/80 text-blue-300 font-space-grotesk font-semibold rounded-full text-xs uppercase tracking-widest transition-all border border-blue-500/30 hover:scale-105"
          >
            Knowledge Entity Page ↗
          </a>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl pt-12 border-t border-white/10 mt-6"
        >
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-4xl font-extrabold text-white font-space-grotesk">5+ Years</span>
            <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold mt-1">Systems Engineering</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-4xl font-extrabold text-blue-400 font-space-grotesk">12K+</span>
            <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold mt-1">Active Professionals</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-4xl font-extrabold text-white font-space-grotesk">10+</span>
            <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold mt-1">Products Shipped</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-3xl md:text-4xl font-extrabold text-emerald-400 font-space-grotesk">99.9%</span>
            <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold mt-1">Platform Uptime</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}