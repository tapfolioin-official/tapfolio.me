"use client";

import { motion } from "framer-motion";

interface Project {
  id: string;
  name: string;
  role: string;
  problem: string;
  solution: string;
  impact: string;
  tags: string[];
  url?: string;
  github?: string;
}

const projects: Project[] = [
  {
    id: "01",
    name: "Tapfolio",
    role: "Co-Founder & CTO",
    problem: "Traditional paper business cards are static, easily lost, costly to print, and quickly out of date.",
    solution: "Built a smart NFC networking platform that connects physical smart cards to dynamic live digital identity profiles.",
    impact: "Created a modern networking solution with real-time lead capture, custom card provisioning, and profile analytics.",
    tags: ["Next.js", "TypeScript", "TailwindCSS", "PostgreSQL", "NFC / NDEF"],
    url: "https://www.tapfolio.me",
    github: "https://github.com/nibrasul/Add-1",
  },
  {
    id: "02",
    name: "Invoice Printer Suite",
    role: "Lead Architect",
    problem: "Enterprise agencies struggle with clunky, manual invoice creation and inconsistent PDF print layouts.",
    solution: "Engineered a high-performance web invoice editor featuring dynamic line items, auto-calculated totals, and instant vector PDF printing.",
    impact: "Streamlined billing workflows for client services with reliable print formatting.",
    tags: ["React", "TypeScript", "TailwindCSS", "PDF Engine"],
    url: "https://www.tapfolio.me/invoice-printer",
  },
  {
    id: "03",
    name: "JARVIS AI Assistant",
    role: "AI Systems Architect",
    problem: "Developers lose hours daily executing repetitive terminal commands, cloud deployments, and environment setups.",
    solution: "Architected a natural language CLI & shell assistant powered by OpenAI's API to automate developer operations.",
    impact: "Automated deployment workflows that significantly reduced repetitive manual server maintenance work.",
    tags: ["Voice AI", "OpenAI API", "Node.js", "Python", "CLI Tooling"],
    github: "https://github.com/nibrasul",
  },
  {
    id: "04",
    name: "Old School Tea",
    role: "Full-Stack Engineer (Client Project)",
    problem: "Traditional tea brand needed a premium digital storefront to scale direct-to-consumer sales.",
    solution: "Designed and built an immersive storytelling e-commerce platform with fast asset loading and responsive checkout.",
    impact: "Elevated digital brand presence and expanded online customer discoverability.",
    tags: ["Next.js", "TailwindCSS", "Brand Strategy", "Stripe Integration"],
    url: "https://www.tapfolio.me",
  },
  {
    id: "05",
    name: "Spatial Crime Analytics Platform",
    role: "Machine Learning Engineer",
    problem: "Municipal planners lacked temporal spatial tools to identify regional density patterns.",
    solution: "Developed predictive modeling pipelines using TensorFlow & Pandas, rendered via interactive React & D3.js geospatial visualizations.",
    impact: "Transformed spatial data layers into actionable resource allocation maps.",
    tags: ["Python", "TensorFlow", "React", "D3.js", "Geospatial Data"],
    github: "https://github.com/nibrasul",
  },
  {
    id: "06",
    name: "Smart Transit System",
    role: "Systems Architect",
    problem: "School bus & transport fleets needed real-time telemetry tracking.",
    solution: "Built a high-frequency WebSocket mapping service streaming live GPS telemetry to React dashboards.",
    impact: "Delivered real-time vehicle coordinate mapping across concurrent fleet routes.",
    tags: ["Node.js", "Socket.io", "React", "Google Maps API", "WebSockets"],
    github: "https://github.com/nibrasul",
  },
];

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
            Selected Works & Products
          </h2>
          <p className="text-gray-400 max-w-2xl text-base md:text-lg">
            A showcase of production software, enterprise SaaS platforms, and technical hardware projects engineered for scale and impact.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#111625]/60 border border-white/10 rounded-3xl p-8 flex flex-col justify-between gap-8 hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-500/5 transition-all group"
            >
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                    {project.role}
                  </span>
                  <span className="text-xs text-gray-400 font-space-grotesk font-semibold">{project.id}</span>
                </div>

                <h3 className="text-3xl font-bold text-white font-space-grotesk group-hover:text-blue-300 transition-colors">
                  {project.name}
                </h3>

                <div className="space-y-4 text-sm">
                  <div>
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-1">Challenge</span>
                    <p className="text-gray-300 leading-relaxed">{project.problem}</p>
                  </div>
                  <div>
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wider block mb-1">Solution & Architecture</span>
                    <p className="text-gray-300 leading-relaxed">{project.solution}</p>
                  </div>
                  <div>
                    <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider block mb-1">Key Impact</span>
                    <p className="text-emerald-300 font-medium leading-relaxed">{project.impact}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-6 pt-4 border-t border-white/10">
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="bg-white/5 border border-white/10 text-gray-300 text-xs font-medium px-3 py-1 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-4">
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 px-5 py-2.5 rounded-full transition-all flex items-center gap-1 shadow-md shadow-blue-600/20"
                    >
                      Live Project ↗
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-gray-300 bg-white/10 hover:bg-white/20 border border-white/15 px-5 py-2.5 rounded-full transition-all flex items-center gap-1"
                    >
                      Source Code ↗
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}