"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ProjectCaseStudy } from "@/data/projects";

interface ProjectCardProps {
  project: ProjectCaseStudy;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="bg-[#111625]/60 border border-white/10 rounded-3xl overflow-hidden flex flex-col justify-between hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/10 transition-all group"
    >
      {/* Top Cover Image / Banner */}
      <div className="relative w-full aspect-[16/9] bg-[#0A0A0A] overflow-hidden border-b border-white/10">
        <img
          src={project.image}
          alt={`${project.name} UI Cover`}
          className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111625] via-transparent to-transparent opacity-90" />
        
        {/* Category & Year Floating Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-300 bg-blue-950/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-blue-500/30">
            {project.category}
          </span>
          <span className="text-xs font-bold text-gray-300 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 font-space-grotesk">
            {project.year}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-8 flex flex-col gap-6 flex-grow">
        
        {/* Title & Role */}
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
            {project.role} • {project.duration}
          </span>
          <h3 className="text-3xl font-bold font-space-grotesk text-white group-hover:text-blue-300 transition-colors">
            {project.name}
          </h3>
          <p className="text-xs text-blue-300/90 font-medium italic mt-0.5">
            &quot;{project.tagline}&quot;
          </p>
        </div>

        {/* Problem, Solution, Impact Narrative */}
        <div className="space-y-4 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">Challenge</span>
            <p className="text-gray-300 leading-relaxed">{project.problem}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1">Solution & Architecture</span>
            <p className="text-gray-300 leading-relaxed">{project.solution}</p>
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">Outcome / Impact</span>
            <p className="text-emerald-300 font-medium leading-relaxed">{project.impact}</p>
          </div>
        </div>

        {/* My Responsibilities */}
        <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">My Engineering Contributions</span>
          <div className="flex flex-wrap gap-1.5">
            {project.responsibilities.map((resp, rIdx) => (
              <span
                key={resp}
                className="bg-white/5 border border-white/10 text-gray-300 text-[10px] font-medium px-2.5 py-1 rounded-md"
              >
                {resp}
              </span>
            ))}
          </div>
        </div>

        {/* Key Lesson Learned */}
        {project.lessonsLearned && project.lessonsLearned.length > 0 && (
          <div className="bg-blue-500/10 border-l-2 border-blue-500 rounded-r-xl p-3 text-[11px] text-gray-300 font-medium">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-300 block mb-0.5">Key Lesson Learned</span>
            <p className="italic leading-snug">&quot;{project.lessonsLearned[0]}&quot;</p>
          </div>
        )}

      </div>

      {/* Button Hierarchy Footer */}
      <div className="p-8 pt-0 flex flex-wrap items-center gap-3">
        <Link
          href={`/portfolio/nibras/projects/${project.slug}`}
          className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 px-5 py-3 rounded-full transition-all shadow-md shadow-blue-600/20 flex items-center gap-1"
        >
          Read Case Study →
        </Link>

        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15 px-4 py-3 rounded-full transition-all flex items-center gap-1"
          >
            Live Site ↗
          </a>
        )}

        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-semibold text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15 px-4 py-3 rounded-full transition-all flex items-center gap-1"
          >
            GitHub ↗
          </a>
        )}
      </div>
    </motion.div>
  );
}
