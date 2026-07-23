"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import ProfilePhoto from "./ProfilePhoto";

export default function AboutSection() {
  const coreExpertise = [
    {
      title: "Software Architecture",
      desc: "Designing scalable, maintainable web and mobile applications.",
      icon: "🏗️"
    },
    {
      title: "AI Integration",
      desc: "Building intelligent workflows, CLI tools, and agent automation.",
      icon: "🤖"
    },
    {
      title: "NFC Technology",
      desc: "Connecting physical smart cards with live digital identities.",
      icon: "🎴"
    },
    {
      title: "Cloud Infrastructure",
      desc: "Deploying reliable, high-performance edge platforms.",
      icon: "☁️"
    },
    {
      title: "Product Engineering",
      desc: "Taking ideas from initial concept to scalable production.",
      icon: "⚡"
    }
  ];

  return (
    <section
      id="about"
      className="relative w-full bg-[#0A0A0A] py-28 md:py-36 px-6 md:px-16 border-t border-white/10"
    >
      <div className="max-w-[1200px] w-full mx-auto flex flex-col gap-16">
        
        {/* Main Grid: Left Portrait Card | Right Narrative */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column (5 cols): Portrait & Rich Quick Specs */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start gap-6">
            <div className="relative w-full max-w-[380px] aspect-[4/5] rounded-3xl overflow-hidden border-2 border-blue-500/30 shadow-2xl bg-[#111625] group">
              <ProfilePhoto
                src="/nibras.png"
                alt="Mohammed Nibrasul Haqq - Co-Founder & CTO at Tapfolio"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/85 to-transparent p-6 flex flex-col">
                <span className="text-xl font-bold font-space-grotesk text-white">Mohammed Nibrasul Haqq</span>
                <span className="text-xs font-semibold text-blue-400">Co-Founder & CTO @ Tapfolio</span>
              </div>
            </div>

            {/* Expanded Quick Specs Card */}
            <div className="w-full max-w-[380px] bg-[#111625]/60 border border-white/10 rounded-2xl p-6 flex flex-col gap-4 text-xs">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400">Founder Profile Specs</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-500 block uppercase font-bold tracking-wider">Role</span>
                  <span className="font-semibold text-white">Co-Founder & CTO</span>
                </div>
                <div>
                  <span className="text-gray-500 block uppercase font-bold tracking-wider">Company</span>
                  <span className="font-semibold text-white">Tapfolio</span>
                </div>
                <div>
                  <span className="text-gray-500 block uppercase font-bold tracking-wider">Location</span>
                  <span className="font-semibold text-white">Kochi, India</span>
                </div>
                <div>
                  <span className="text-gray-500 block uppercase font-bold tracking-wider">Experience</span>
                  <span className="font-semibold text-white">5+ Years Engineering</span>
                </div>
                <div>
                  <span className="text-gray-500 block uppercase font-bold tracking-wider">Focus Areas</span>
                  <span className="font-semibold text-white">SaaS, NFC, AI Agents</span>
                </div>
                <div>
                  <span className="text-gray-500 block uppercase font-bold tracking-wider">Languages</span>
                  <span className="font-semibold text-white">English, Malayalam, Hindi</span>
                </div>
              </div>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-gray-400">
                <span>Availability</span>
                <span className="font-semibold text-emerald-400">Open for Collaboration</span>
              </div>
            </div>
          </div>

          {/* Right Column (7 cols): Story, CTO Leadership & Founder Philosophy */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">About Mohammed Nibrasul Haqq</span>
              <h2 className="text-4xl md:text-5xl font-black font-space-grotesk text-white tracking-tight leading-tight">
                Software Architect, Product Engineer & <span className="text-blue-400">Co-Founder</span>.
              </h2>
            </div>

            {/* Narrative Story (Specific & Impact-Driven) */}
            <div className="space-y-4 text-gray-300 text-base md:text-lg leading-relaxed font-normal">
              <p>
                My interest in software began with building small web applications and gradually evolved into designing complete digital products. That curiosity eventually led me to co-found Tapfolio, where I focus on combining software engineering, NFC technology, and AI to simplify professional networking.
              </p>
              <p>
                My work focuses on designing SaaS platforms, building scalable Next.js applications that enable businesses to manage digital identities and professional networking more efficiently, integrating NFC hardware with contactless smart cards, and developing AI-powered workflows that solve practical business problems.
              </p>
              <p>
                As CTO at Tapfolio, I guide our overall technical vision, product architecture, engineering decisions, and roadmap planning—ensuring our web platforms, mobile services, and card provisioning pipelines operate with performance and high reliability.
              </p>
            </div>

            {/* Enhanced Founder Philosophy Block */}
            <div className="bg-[#111625]/80 border-l-4 border-blue-500 rounded-r-3xl p-8 relative shadow-xl space-y-3 border border-white/5">
              <div className="flex items-center justify-between">
                <span className="text-5xl text-blue-400 font-serif leading-none select-none">❝</span>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                  Founder Philosophy
                </span>
              </div>
              <p className="text-lg md:text-xl text-white font-medium italic leading-relaxed pt-1">
                &quot;I believe technology should remove friction, not add complexity. Every product I build aims to make interactions simpler, faster, and more meaningful.&quot;
              </p>
              <div className="pt-2 text-xs font-bold uppercase tracking-wider text-blue-300">
                — Mohammed Nibrasul Haqq
              </div>
            </div>

            {/* Supporting Navigation Links */}
            <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-white/10">
              <a
                href="#projects"
                className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
              >
                View Case Studies ↓
              </a>
              <span className="text-gray-600">•</span>
              <Link
                href="/founders/mohammed-nibrasul-haqq"
                className="text-xs font-bold text-gray-300 hover:text-white transition-colors flex items-center gap-1"
              >
                Knowledge Entity Record ↗
              </Link>
              <span className="text-gray-600">•</span>
              <a
                href="#articles"
                className="text-xs font-bold text-gray-300 hover:text-white transition-colors flex items-center gap-1"
              >
                Technical Writing ↓
              </a>
              <span className="text-gray-600">•</span>
              <a
                href="#contact"
                className="text-xs font-bold text-gray-300 hover:text-white transition-colors flex items-center gap-1"
              >
                Get in Touch →
              </a>
            </div>

          </div>

        </div>

        {/* Compact "Core Expertise" Grid */}
        <div className="flex flex-col gap-8 pt-8 border-t border-white/10">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Engineering Pillars</span>
            <h3 className="text-2xl font-bold font-space-grotesk text-white">Core Expertise & Domains</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {coreExpertise.map((exp, idx) => (
              <div
                key={idx}
                className="bg-[#111625]/60 border border-white/10 rounded-2xl p-5 flex flex-col gap-3 hover:border-blue-500/30 transition-all"
              >
                <div className="text-2xl">{exp.icon}</div>
                <div>
                  <h4 className="text-sm font-bold text-white font-space-grotesk">{exp.title}</h4>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">{exp.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}