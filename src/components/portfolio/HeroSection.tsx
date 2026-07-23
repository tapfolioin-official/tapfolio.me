"use client";

import { useRef, useCallback } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import ProfilePhoto from "./ProfilePhoto";

export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const fadeIn = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative w-full min-h-screen flex flex-col justify-center items-center px-6 md:px-16 pt-28 pb-16 bg-[#0A0A0A] overflow-hidden"
    >
      {/* Background Radial Glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none"
      />
      <div
        className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"
      />

      {/* Main Split Layout Container */}
      <div className="relative z-10 max-w-[1200px] w-full mx-auto flex flex-col gap-12">

        {/* Top Status & Location Bar */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4 text-xs text-gray-400 font-medium"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>📍 Kochi, India • Open to Collaboration • Available Worldwide</span>
          </div>
          <div className="flex items-center gap-2 text-blue-400 font-semibold">
            <span>Co-Founder & CTO @ Tapfolio</span>
          </div>
        </motion.div>

        {/* Split Grid: Left Intro & CTAs | Right Portrait */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column (7 cols): Name, Factual Badge, Bio, Mission & Links */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.8, delay: 0.1 }}
            className="lg:col-span-7 flex flex-col gap-6 text-left"
          >
            {/* Factual Role & Stack Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full w-fit">
              <span className="text-xs font-bold tracking-wide text-blue-300">
                Co-Founder & CTO at Tapfolio • Next.js • Flutter • AI • NFC
              </span>
            </div>

            {/* Name Headline */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black font-space-grotesk tracking-tight text-white leading-[1.08]">
              Mohammed <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-white bg-clip-text text-transparent">
                Nibrasul Haqq
              </span>
            </h1>

            {/* Extended Intro Paragraph */}
            <p className="text-base md:text-lg font-inter text-gray-200 leading-relaxed">
              <strong>Mohammed Nibrasul Haqq</strong> is an Indian software engineer and Co-Founder & CTO of Tapfolio. He focuses on building scalable products that solve real-world business problems through NFC technology, AI, and modern web platforms.
            </p>

            {/* Stronger Personal Identity Mission Sentence */}
            <p className="text-sm md:text-base font-inter font-medium text-blue-300 border-l-2 border-blue-500/40 pl-4 py-0.5">
              I build digital products at the intersection of NFC, AI, SaaS, and user experience—passionate about simplifying how people connect, share, and grow through technology.
            </p>

            {/* Primary Trust Statement */}
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Building products used by professionals & businesses across India and worldwide.
            </div>

            {/* Action CTAs using Next.js Link */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => scrollToSection("projects")}
                className="px-7 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-space-grotesk font-bold rounded-full text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-600/25 hover:scale-105 cursor-pointer"
              >
                Featured Work ↓
              </button>

              <a
                href="https://www.linkedin.com/in/mohammed-nibrasul-haqq-8267162ba/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-space-grotesk font-semibold rounded-full text-xs uppercase tracking-widest transition-all border border-white/15 hover:scale-105"
              >
                LinkedIn ↗
              </a>

              <a
                href="https://github.com/nibrasul"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-space-grotesk font-semibold rounded-full text-xs uppercase tracking-widest transition-all border border-white/15 hover:scale-105"
              >
                GitHub ↗
              </a>

              <Link
                href="/founders/mohammed-nibrasul-haqq"
                className="px-5 py-3.5 bg-blue-950/60 hover:bg-blue-900/80 text-blue-300 font-space-grotesk font-semibold rounded-full text-xs uppercase tracking-widest transition-all border border-blue-500/30 hover:scale-105"
              >
                Knowledge Entity Record ↗
              </Link>
            </div>
          </motion.div>

          {/* Right Column (5 cols): Professional Portrait Frame */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 flex flex-col items-center lg:items-end justify-center"
          >
            <div className="relative w-full max-w-[340px] md:max-w-[380px] aspect-[4/5] rounded-3xl overflow-hidden border-2 border-blue-500/30 shadow-2xl bg-[#111625] group cursor-pointer">
              <ProfilePhoto
                src="/nibras.png"
                alt="Mohammed Nibrasul Haqq - Co-Founder & CTO at Tapfolio"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />

              {/* Interactive Hover Overlay */}
              <div className="absolute inset-0 bg-[#0A0A0A]/85 backdrop-blur-md p-6 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 ease-out z-10 border border-blue-500/30 text-left">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Founder Snapshot</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Experience</span>
                    <span className="text-base font-bold text-white font-space-grotesk">5+ Years</span>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">Products</span>
                    <span className="text-base font-bold text-white font-space-grotesk">10+ Shipped</span>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Location</span>
                    <span className="text-xs font-bold text-white font-space-grotesk">Kochi, India</span>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-3 rounded-xl">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Status</span>
                    <span className="text-xs font-bold text-emerald-300">CTO @ Tapfolio</span>
                  </div>
                </div>

                <div className="text-[11px] text-gray-300 font-medium pt-2 border-t border-white/10 flex items-center justify-between">
                  <span>Mohammed Nibrasul Haqq</span>
                  <span className="text-blue-400 font-bold">Tapfolio →</span>
                </div>
              </div>

              {/* Default Bottom Bar */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/90 to-transparent p-6 flex flex-col gap-2 group-hover:opacity-0 transition-opacity duration-300">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold font-space-grotesk text-white">Mohammed Nibrasul Haqq</span>
                  <span className="bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase px-2.5 py-1 rounded border border-blue-500/30">
                    CTO @ Tapfolio
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {["Next.js", "Flutter", "NFC Hardware", "AI Agents", "Node.js"].map((tech, idx) => (
                    <span key={idx} className="bg-white/10 text-gray-300 text-[10px] font-semibold px-2 py-0.5 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Featured Work Strip (Replacing abstract metric grid with tangible work) */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col gap-4 pt-10 border-t border-white/10"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
              Featured Work Showcase
            </span>
            <button
              onClick={() => scrollToSection("projects")}
              className="text-xs font-bold text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              View All Case Studies →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {/* Work 1: Tapfolio */}
            <button
              onClick={() => scrollToSection("projects")}
              className="bg-[#111625]/60 hover:bg-[#111625] border border-white/10 hover:border-blue-500/40 rounded-2xl p-5 text-left flex flex-col justify-between gap-3 transition-all group cursor-pointer"
            >
              <div>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">NFC & SaaS Platform</span>
                <h3 className="text-lg font-bold text-white font-space-grotesk group-hover:text-blue-300 transition-colors">Tapfolio</h3>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">Digital identity & smart NFC business card platform.</p>
              </div>
              <span className="text-[11px] font-semibold text-gray-300 group-hover:text-blue-400 flex items-center gap-1">
                Next.js • Flutter • NFC →
              </span>
            </button>

            {/* Work 2: Invoice Printer */}
            <button
              onClick={() => scrollToSection("projects")}
              className="bg-[#111625]/60 hover:bg-[#111625] border border-white/10 hover:border-blue-500/40 rounded-2xl p-5 text-left flex flex-col justify-between gap-3 transition-all group cursor-pointer"
            >
              <div>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">Business Utility</span>
                <h3 className="text-lg font-bold text-white font-space-grotesk group-hover:text-blue-300 transition-colors">Invoice Printer</h3>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">Enterprise invoice editor & vector PDF generator.</p>
              </div>
              <span className="text-[11px] font-semibold text-gray-300 group-hover:text-blue-400 flex items-center gap-1">
                React • TypeScript • PDF →
              </span>
            </button>

            {/* Work 3: JARVIS AI */}
            <button
              onClick={() => scrollToSection("projects")}
              className="bg-[#111625]/60 hover:bg-[#111625] border border-white/10 hover:border-blue-500/40 rounded-2xl p-5 text-left flex flex-col justify-between gap-3 transition-all group cursor-pointer"
            >
              <div>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">AI Orchestrator</span>
                <h3 className="text-lg font-bold text-white font-space-grotesk group-hover:text-blue-300 transition-colors">JARVIS AI Suite</h3>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">Autonomous CLI & voice shell assistant for developer ops.</p>
              </div>
              <span className="text-[11px] font-semibold text-gray-300 group-hover:text-blue-400 flex items-center gap-1">
                Node.js • OpenAI • CLI →
              </span>
            </button>

            {/* Work 4: Old School Tea */}
            <button
              onClick={() => scrollToSection("projects")}
              className="bg-[#111625]/60 hover:bg-[#111625] border border-white/10 hover:border-blue-500/40 rounded-2xl p-5 text-left flex flex-col justify-between gap-3 transition-all group cursor-pointer"
            >
              <div>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">E-Commerce</span>
                <h3 className="text-lg font-bold text-white font-space-grotesk group-hover:text-blue-300 transition-colors">Old School Tea</h3>
                <p className="text-xs text-gray-400 mt-1 line-clamp-2">Storytelling digital storefront for artisanal tea brand.</p>
              </div>
              <span className="text-[11px] font-semibold text-gray-300 group-hover:text-blue-400 flex items-center gap-1">
                Next.js • Stripe • UX →
              </span>
            </button>
          </div>
        </motion.div>

        {/* Bottom Discover More Scroll Indicator */}
        <div className="flex justify-center pt-2">
          <button
            onClick={() => scrollToSection("about")}
            className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-blue-400 transition-colors cursor-pointer"
          >
            <span>Discover More</span>
            <span className="animate-bounce text-sm">↓</span>
          </button>
        </div>

      </div>
    </section>
  );
}