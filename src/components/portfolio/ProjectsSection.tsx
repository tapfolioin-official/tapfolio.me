"use client";

import { projectsData } from "@/data/projects";
import ProjectCard from "./ProjectCard";

export default function ProjectsSection() {
  return (
    <section
      id="projects"
      className="relative w-full bg-[#0A0A0A] py-28 md:py-36 px-6 md:px-16 border-t border-white/10"
    >
      <div className="max-w-[1200px] w-full mx-auto flex flex-col gap-16">
        
        {/* Section Header */}
        <div className="flex flex-col gap-4">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Featured Showcase</span>
          <h2 className="text-4xl md:text-6xl font-black font-space-grotesk text-white tracking-tight">
            Case Studies & Shipped Works
          </h2>
          <p className="text-gray-400 max-w-2xl text-base md:text-lg">
            Detailed engineering case studies covering technical problems, software architecture, key outcomes, and lessons learned across NFC systems, SaaS platforms, and AI automation.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {projectsData.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>

      </div>
    </section>
  );
}