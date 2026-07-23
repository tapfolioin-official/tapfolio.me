"use client";

import { motion } from "framer-motion";
import { ExperienceItem } from "@/data/experience";

interface ExperienceCardProps {
  exp: ExperienceItem;
  idx: number;
}

export default function ExperienceCard({ exp, idx }: ExperienceCardProps) {
  const getTypeBadgeStyle = (type: ExperienceItem["type"]) => {
    switch (type) {
      case "STARTUP":
        return "bg-blue-500/10 text-blue-300 border-blue-500/30";
      case "CLIENT WORK":
        return "bg-purple-500/10 text-purple-300 border-purple-500/30";
      case "FREELANCE":
        return "bg-emerald-500/10 text-emerald-300 border-emerald-500/30";
      case "ACADEMIC":
        return "bg-amber-500/10 text-amber-300 border-amber-500/30";
      default:
        return "bg-white/10 text-white border-white/20";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="bg-[#111625]/60 border border-white/10 rounded-3xl p-8 flex flex-col gap-6 hover:border-blue-500/40 transition-all shadow-xl"
    >
      {/* Header: Type Badge & Period */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="text-2xl p-2 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
            {exp.icon}
          </span>
          <div>
            <span className={`text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full border ${getTypeBadgeStyle(exp.type)}`}>
              {exp.type}
            </span>
            <h3 className="text-2xl font-bold font-space-grotesk text-white mt-1">
              {exp.company}
            </h3>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-xs font-bold text-gray-300 bg-white/5 border border-white/10 px-3 py-1 rounded-full font-space-grotesk">
            {exp.year}
          </span>
          <span className="text-xs text-gray-500 mt-1">{exp.location}</span>
        </div>
      </div>

      {/* Role Title */}
      <div className="text-base font-bold text-blue-300 font-space-grotesk">
        {exp.role}
      </div>

      {/* Narrative Description */}
      <p className="text-gray-300 text-sm leading-relaxed">
        {exp.description}
      </p>

      {/* Business & System Outcome Highlight */}
      <div className="bg-emerald-500/10 border-l-3 border-emerald-400 p-4 rounded-r-xl text-xs space-y-1">
        <span className="font-bold text-emerald-400 uppercase tracking-wider block">Impact & Outcome</span>
        <p className="text-emerald-200 font-medium leading-relaxed">{exp.outcome}</p>
      </div>

      {/* Responsibilities */}
      <div className="space-y-2 pt-1">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Key Responsibilities</span>
        <div className="flex flex-wrap gap-2">
          {exp.responsibilities.map((resp) => (
            <span key={resp} className="bg-white/5 border border-white/10 text-gray-300 text-xs px-3 py-1 rounded-lg">
              • {resp}
            </span>
          ))}
        </div>
      </div>

      {/* Key Achievements Bullet Points using unique bullet as key */}
      <div className="space-y-2 pt-1">
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Highlights & Architecture</span>
        <ul className="space-y-2 text-xs text-gray-300">
          {exp.bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-2">
              <span className="text-blue-400 font-bold">•</span>
              <span className="leading-relaxed">{bullet}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Technology Tags */}
      <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/10">
        {exp.technologies.map((tech) => (
          <span key={tech} className="bg-blue-500/10 border border-blue-500/20 text-blue-300 text-[11px] font-medium px-2.5 py-1 rounded-md">
            {tech}
          </span>
        ))}
      </div>

      {/* Link CTA */}
      {exp.link && (
        <div className="pt-2">
          <a
            href={exp.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center gap-1"
          >
            Visit {exp.company} Site ↗
          </a>
        </div>
      )}
    </motion.div>
  );
}
