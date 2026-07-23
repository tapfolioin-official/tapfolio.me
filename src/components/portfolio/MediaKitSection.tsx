"use client";

import { motion } from "framer-motion";

export default function MediaKitSection() {
  return (
    <section
      id="media-kit"
      className="relative w-full bg-[#0A0A0A] py-28 md:py-36 px-6 md:px-16 border-t border-white/10"
    >
      <div className="max-w-[1200px] w-full mx-auto flex flex-col gap-16">
        
        {/* Section Header */}
        <div className="flex flex-col gap-4">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Speaker & Press Resources</span>
          <h2 className="text-4xl md:text-6xl font-black font-space-grotesk text-white tracking-tight">
            Media Kit & Bio Assets
          </h2>
          <p className="text-gray-400 max-w-2xl text-base md:text-lg">
            Download official headshots, bios, brand assets, and speaking topic guidelines for interviews, podcasts, and technical conferences.
          </p>
        </div>

        {/* Media Kit Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Official Bios */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#111625]/60 border border-white/10 rounded-3xl p-8 flex flex-col gap-6"
          >
            <h3 className="text-2xl font-bold font-space-grotesk text-white">Official Biographies</h3>
            
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block mb-2">Short Biography (50 Words)</span>
                <p className="text-sm text-gray-300 leading-relaxed">
                  &quot;Mohammed Nibrasul Haqq is an Indian software engineer, Co-Founder & CTO of Tapfolio, specializing in NFC technology, SaaS platforms, Flutter, Next.js, AI integrations, and digital identity products. He leads Tapfolio&apos;s technical architecture and engineering team in Bangalore.&quot;
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-400 block mb-2">Long Biography (150 Words)</span>
                <p className="text-sm text-gray-300 leading-relaxed">
                  &quot;Mohammed Nibrasul Haqq is the Co-Founder and Chief Technology Officer (CTO) of Tapfolio. Combining expertise in web architectures, real-time sync platforms, and physical-to-digital hardware integration, Nibras leads core software development and cloud infrastructure at Tapfolio. He architected the platform&apos;s Next.js application, multi-device NFC provisioning algorithms, and analytics engines serving over 12,000 active users across 48 countries. Beyond Tapfolio, Nibras develops autonomous AI developer agents and machine learning spatial systems.&quot;
                </p>
              </div>
            </div>
          </motion.div>

          {/* Speaking Topics & Downloads */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#111625]/60 border border-white/10 rounded-3xl p-8 flex flex-col justify-between gap-6"
          >
            <div className="flex flex-col gap-4">
              <h3 className="text-2xl font-bold font-space-grotesk text-white">Speaking Topics & Asset Downloads</h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                Nibras is available for conference keynotes, technical panels, podcasts, and developer workshops.
              </p>

              <div className="space-y-3 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">Featured Speaking Topics</span>
                <ul className="space-y-2 text-xs text-gray-300">
                  <li className="flex items-center gap-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span>Building Tactile NFC Hardware & Next.js SaaS Architectures</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span>Cross-Platform Flutter & Web Real-Time Synchronization</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span>AI Agent Automation for Developer Operations & Systems</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span>The Future of Digital Identity & Contactless Networking</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10">
              <a
                href="/nibras.png"
                download="Mohammed_Nibrasul_Haqq_Portrait.png"
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-3 rounded-full transition-all"
              >
                Download Official Portrait (PNG) ↓
              </a>
              <a
                href="mailto:hello@tapfolio.me?subject=Media/Speaking%20Inquiry%20-%20Mohammed%20Nibrasul%20Haqq"
                className="bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-5 py-3 rounded-full transition-all border border-white/15"
              >
                Inquire for Speaking / Press →
              </a>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
