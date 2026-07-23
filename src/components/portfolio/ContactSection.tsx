"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

export default function ContactSection() {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText("hello@tapfolio.me");
      setCopied(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Failed to copy email:", err);
    }
  };

  const servicesHelp = [
    "SaaS Product Development",
    "AI Integration & Automation",
    "NFC Smart Card Systems",
    "Flutter Mobile Applications",
    "Next.js Web Platforms",
    "Startup MVP Engineering"
  ];

  const availabilityBadges = [
    "Consulting",
    "Speaking",
    "Partnerships",
    "Product Development",
    "Startup Advisory"
  ];

  return (
    <section
      id="contact"
      className="relative w-full bg-[#0A0A0A] py-28 md:py-36 px-6 md:px-16 border-t border-white/10"
    >
      <div className="max-w-[1200px] w-full mx-auto flex flex-col gap-16">
        
        {/* Contact Container Card */}
        <div className="bg-gradient-to-br from-[#111625] via-gray-900 to-[#0B0F19] border border-white/10 rounded-3xl p-8 md:p-16 flex flex-col items-center text-center gap-10 shadow-2xl relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Header & Response Time */}
          <div className="flex flex-col items-center gap-4 max-w-3xl">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-4 py-1.5 rounded-full border border-blue-500/20">
                Get in Touch
              </span>
              <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                ⚡ Usually replies within 24 hours
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl font-black font-space-grotesk text-white tracking-tight">
              Let&apos;s Build Something Extraordinary.
            </h2>

            <p className="text-gray-300 text-base md:text-lg leading-relaxed pt-2">
              I&apos;m always interested in discussing startups, product development, AI, NFC technology, and ambitious software ideas. Whether you&apos;re looking for a technical co-founder, engineering partner, or simply want to connect, I&apos;d be happy to hear from you.
            </p>
          </div>

          {/* "Looking for Help With" Conversion Section */}
          <div className="w-full max-w-3xl bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center gap-4">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-300">
              Looking for Technical Expertise in:
            </span>
            <div className="flex flex-wrap justify-center gap-2">
              {servicesHelp.map((item, idx) => (
                <span key={idx} className="bg-blue-500/10 border border-blue-500/20 text-blue-200 text-xs font-semibold px-3 py-1.5 rounded-lg">
                  • {item}
                </span>
              ))}
            </div>
          </div>

          {/* Availability Badges Bar */}
          <div className="flex flex-wrap justify-center items-center gap-2 text-xs font-medium text-gray-300">
            <span className="text-gray-500 uppercase font-bold mr-1">Available For:</span>
            {availabilityBadges.map((badge, bIdx) => (
              <span key={bIdx} className="bg-white/5 border border-white/10 px-3 py-1 rounded-full text-emerald-300 font-semibold">
                ✓ {badge}
              </span>
            ))}
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="mailto:hello@tapfolio.me"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-space-grotesk font-bold rounded-full text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-600/25 hover:scale-105"
            >
              Send Email (hello@tapfolio.me) →
            </a>

            <button
              onClick={handleCopyEmail}
              className="px-6 py-4 bg-white/10 hover:bg-white/20 text-white font-space-grotesk font-semibold rounded-full text-xs uppercase tracking-widest transition-all border border-white/15 hover:scale-105 cursor-pointer relative"
            >
              {copied ? "✓ Copied to Clipboard!" : "Copy Email 📋"}
            </button>

            <a
              href="mailto:hello@tapfolio.me?subject=Schedule%20a%20Meeting%20Request"
              className="px-6 py-4 bg-purple-950/60 hover:bg-purple-900/80 text-purple-300 font-space-grotesk font-semibold rounded-full text-xs uppercase tracking-widest transition-all border border-purple-500/30 hover:scale-105"
            >
              Schedule a Meeting 📅
            </a>

            <Link
              href="/founders/mohammed-nibrasul-haqq"
              className="px-6 py-4 bg-blue-950/60 hover:bg-blue-900/80 text-blue-300 font-space-grotesk font-semibold rounded-full text-xs uppercase tracking-widest transition-all border border-blue-500/30 hover:scale-105"
            >
              Founder Profile →
            </Link>
          </div>

          {/* Social Channels with SVG Icons & Accessibility */}
          <div className="flex flex-wrap justify-center items-center gap-8 pt-6 border-t border-white/10 w-full max-w-xl text-xs font-semibold text-gray-400">
            <a
              href="https://www.linkedin.com/in/mohammed-nibrasul-haqq-8267162ba/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open LinkedIn profile of Mohammed Nibrasul Haqq"
              className="hover:text-blue-400 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
              </svg>
              <span>LinkedIn</span>
            </a>

            <a
              href="https://github.com/nibrasul"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open GitHub profile of Mohammed Nibrasul Haqq"
              className="hover:text-blue-400 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
              </svg>
              <span>GitHub</span>
            </a>

            <a
              href="https://x.com/tapfolio"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open X profile of Tapfolio"
              className="hover:text-blue-400 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <span>X (Twitter)</span>
            </a>

            <a
              href="https://www.tapfolio.me"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit Tapfolio main website"
              className="hover:text-blue-400 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
              </svg>
              <span>Tapfolio.me</span>
            </a>
          </div>

          {/* Final Impression Callout */}
          <div className="pt-6 border-t border-white/10 text-sm font-bold text-white font-space-grotesk flex items-center gap-2">
            <span>Have an idea?</span>
            <span className="text-blue-400">Let&apos;s build it together.</span>
          </div>

        </div>

        {/* Elegant Bottom Footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500 border-t border-white/10 pt-8">
          <div>
            © 2026 Mohammed Nibrasul Haqq. All rights reserved.
          </div>
          <div className="flex items-center gap-2">
            <span>Built with Next.js • React • TypeScript • TailwindCSS</span>
          </div>
          <div className="font-semibold text-gray-400">
            Made in Kochi, India 🇮🇳
          </div>
        </div>

      </div>
    </section>
  );
}