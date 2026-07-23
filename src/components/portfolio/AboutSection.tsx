"use client";

import { motion } from "framer-motion";
import ProfilePhoto from "./ProfilePhoto";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative w-full bg-[#0A0A0A] py-28 md:py-36 px-6 md:px-16 border-t border-white/10"
    >
      <div className="max-w-[1200px] w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column: Portrait & Quick Card */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start gap-6">
            <div className="relative w-full max-w-[380px] aspect-[4/5] rounded-3xl overflow-hidden border-2 border-blue-500/20 shadow-2xl bg-[#111625]">
              <ProfilePhoto
                src="/nibras.png"
                alt="Mohammed Nibrasul Haqq"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/80 to-transparent p-6 flex flex-col">
                <span className="text-xl font-bold font-space-grotesk text-white">Mohammed Nibrasul Haqq</span>
                <span className="text-xs font-semibold text-blue-400">Co-Founder & CTO @ Tapfolio</span>
              </div>
            </div>
          </div>

          {/* Right Column: Executive Narrative */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Executive Profile</span>
              <h2 className="text-4xl md:text-5xl font-black font-space-grotesk text-white tracking-tight leading-tight">
                Architecting Products at the Intersection of <span className="text-blue-400">Software</span>, <span className="text-indigo-300">NFC Hardware</span> & <span className="text-emerald-400">AI</span>.
              </h2>
            </div>

            <div className="space-y-4 text-gray-300 text-base md:text-lg leading-relaxed">
              <p>
                I&apos;m a software architect, full-stack engineer, and co-founder of Tapfolio. My work focuses on building clean, high-performance web applications, scaling cloud infrastructure, and bridging physical contactless hardware to live digital identities.
              </p>
              <p>
                As CTO at Tapfolio, I architected our Next.js App Router platform, real-time lead sync APIs, and multi-device NFC provisioning systems that power networking for over 12,000 active professionals worldwide.
              </p>
              <p>
                Whether designing AI agent workflows, optimizing core web vitals, or shipping full-stack SaaS platforms, my philosophy centers on technical precision, extreme speed, and real-world impact.
              </p>
            </div>

            {/* Quick Specs */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs">
              <div>
                <span className="text-gray-500 block uppercase font-bold tracking-wider">Role</span>
                <span className="font-semibold text-white">Co-Founder & CTO</span>
              </div>
              <div>
                <span className="text-gray-500 block uppercase font-bold tracking-wider">Location</span>
                <span className="font-semibold text-white">Bangalore, India</span>
              </div>
              <div>
                <span className="text-gray-500 block uppercase font-bold tracking-wider">Specialization</span>
                <span className="font-semibold text-white">Full-Stack & Systems</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}