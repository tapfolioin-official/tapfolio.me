"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function ContactSection() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("hello@tapfolio.me");
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section
      id="contact"
      className="relative w-full bg-[#0A0A0A] py-28 md:py-36 px-6 md:px-16 border-t border-white/10"
    >
      <div className="max-w-[1200px] w-full mx-auto">
        <div className="bg-gradient-to-br from-[#111625] via-gray-900 to-[#0B0F19] border border-white/10 rounded-3xl p-10 md:p-16 flex flex-col items-center text-center gap-10 shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="flex flex-col items-center gap-4 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20">
              Direct Contact & Collaboration
            </span>
            <h2 className="text-4xl md:text-6xl font-black font-space-grotesk text-white tracking-tight">
              Let&apos;s Build Something Extraordinary.
            </h2>
            <p className="text-gray-300 text-base md:text-lg leading-relaxed">
              Open to technical advisory, enterprise partnerships, architectural consulting, and high-impact software ventures. Based in Kochi, India—available worldwide.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handleCopyEmail}
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-space-grotesk font-bold rounded-full text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-600/25 hover:scale-105 cursor-pointer relative"
            >
              {copied ? "✓ Email Copied (hello@tapfolio.me)!" : "Copy Email (hello@tapfolio.me) 📋"}
            </button>

            <a
              href="mailto:hello@tapfolio.me?subject=Inquiry%20for%20Mohammed%20Nibrasul%20Haqq"
              className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-space-grotesk font-semibold rounded-full text-xs uppercase tracking-widest transition-all border border-white/15 hover:scale-105"
            >
              Send Direct Email ✉️
            </a>

            <Link
              href="/founders/mohammed-nibrasul-haqq"
              className="px-6 py-4 bg-blue-950/60 hover:bg-blue-900/80 text-blue-300 font-space-grotesk font-semibold rounded-full text-xs uppercase tracking-widest transition-all border border-blue-500/30 hover:scale-105"
            >
              Knowledge Entity Record ↗
            </Link>
          </div>

          {/* Secondary Actions: Calendar & Resume Download */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-semibold text-gray-300 pt-2 border-t border-white/10 w-full max-w-2xl">
            <a
              href="mailto:hello@tapfolio.me?subject=Schedule%20Technical%20Meeting"
              className="hover:text-blue-400 transition-colors flex items-center gap-1.5"
            >
              <span>📅 Schedule Technical Chat</span>
            </a>
            <span className="text-gray-600">•</span>
            <a
              href="https://github.com/nibrasul"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors flex items-center gap-1.5"
            >
              <span>💻 GitHub Repositories</span>
            </a>
            <span className="text-gray-600">•</span>
            <a
              href="https://www.linkedin.com/in/mohammed-nibrasul-haqq-8267162ba/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors flex items-center gap-1.5"
            >
              <span>🔗 LinkedIn Profile</span>
            </a>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap justify-center items-center gap-8 pt-4 text-xs font-semibold text-gray-400">
            <a
              href="https://www.linkedin.com/in/mohammed-nibrasul-haqq-8267162ba/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors"
            >
              LinkedIn ↗
            </a>
            <a
              href="https://github.com/nibrasul"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors"
            >
              GitHub ↗
            </a>
            <a
              href="https://x.com/tapfolio"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors"
            >
              X (Twitter) ↗
            </a>
            <a
              href="https://www.tapfolio.me"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-blue-400 transition-colors"
            >
              Tapfolio.me ↗
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}