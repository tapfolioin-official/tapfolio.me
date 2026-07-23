"use client";

import { motion } from "framer-motion";
import { experiences } from "@/data/experience";
import ExperienceCard from "./ExperienceCard";

export default function ExperienceSection() {
  return (
    <section
      id="experience"
      className="relative w-full bg-[#0A0A0A] py-28 md:py-36 px-6 md:px-16 border-t border-white/10"
    >
      <div className="max-w-[1200px] w-full mx-auto flex flex-col gap-16">
        
        {/* Section Header */}
        <div className="flex flex-col gap-4">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Chronological Evolution</span>
          <h2 className="text-4xl md:text-6xl font-black font-space-grotesk text-white tracking-tight">
            Founder Journey & Building Products
          </h2>
          <p className="text-gray-400 max-w-2xl text-base md:text-lg">
            A chronological timeline detailing startups co-founded, enterprise client solutions delivered, academic milestones, and engineering leadership.
          </p>
        </div>

        {/* Vertical Founder Timeline Container */}
        <div className="relative border-l-2 border-blue-500/30 pl-6 md:pl-10 ml-2 md:ml-4 flex flex-col gap-12">
          {experiences.map((exp, idx) => (
            <div key={exp.id} className="relative">
              {/* Timeline Node Icon */}
              <div className="absolute -left-[31px] md:-left-[47px] top-6 w-6 h-6 rounded-full bg-[#0A0A0A] border-2 border-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/50">
                <div className="w-2 h-2 rounded-full bg-blue-400" />
              </div>

              {/* Render Modular Experience Card */}
              <ExperienceCard exp={exp} idx={idx} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}