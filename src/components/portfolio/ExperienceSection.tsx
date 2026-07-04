"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Experience {
  id: string;
  year: string;
  company: string;
  role: string;
  description: string;
}

const experiences: Experience[] = [
  {
    id: "exp-1",
    year: "2026",
    company: "Tapfolio",
    role: "Co-Founder & Lead Developer",
    description:
      "Co-founded and engineered Tapfolio, a professional networking ecosystem combining physical NFC hardware with real-time digital profiles. Architected the platform with Next.js and Supabase, scaling to support thousands of instant transactions. Designed and implemented secure routing for contact sharing, integrated hardware provisioning pipelines, and established an analytics engine tracking profile conversion rates.",
  },
  {
    id: "exp-old-school-tea",
    year: "2025",
    company: "Old School Tea",
    role: "Full-Stack Developer (Client Project)",
    description:
      "Engineered a premium, storytelling-driven e-commerce presence tailored to a traditional tea brand. Built with Next.js, optimizing load performance, visual asset delivery, and conversion pathways. Established a clean product showcase architecture and responsive layouts to scale digital customer acquisitions and brand positioning.",
  },
  {
    id: "exp-2",
    year: "2025",
    company: "JARVIS Initiative",
    role: "AI Systems Architect",
    description:
      "Engineered an event-driven AI agent orchestration system that automates local and cloud developer workflows. Designed a custom natural language shell processor using OpenAI's API and Node.js/Python, enabling secure execution of complex database operations and system tasks. Built a speech-to-intent engine that reduced manual environment provisioning and routine server tasks by 80%.",
  },
  {
    id: "exp-3",
    year: "2025",
    company: "Crime Prediction",
    role: "Machine Learning Engineer",
    description:
      "Designed a spatial intelligence platform leveraging machine learning to predict high-risk temporal hotspots. Developed statistical modeling pipelines using TensorFlow and Pandas, processing massive regional datasets. Designed a web interface using React and D3.js to render interactive geospatial density visualizations, translating complex prediction layers into actionable resource planning tools.",
  },
  {
    id: "exp-4",
    year: "2025",
    company: "Smart Transit System",
    role: "Systems Architect",
    description:
      "Built a real-time fleet transit mapping platform for enterprise distribution and school systems. Architected an event-driven websocket backend using Node.js and Socket.io to process high-frequency GPS coordinate streams, visualizing them on a custom React frontend with Google Maps API. Scaled telemetry pipelines to handle concurrent driver broadcasts with sub-second latency.",
  },
  {
    id: "exp-5",
    year: "2025",
    company: "PG & Hostel Finder",
    role: "Founder & Engineer",
    description:
      "Founded and built a specialized accommodation discovery engine for university students. Engineered custom property search queries and geo-spatial indices using MongoDB and Prisma, reducing user discovery latency. Built responsive management dashboards allowing property managers to list housing options and handle inbound tenant inquiries.",
  },
  {
    id: "exp-6",
    year: "2024",
    company: "LocalConnect",
    role: "Founder",
    description:
      "Conceived and launched a location-aware service marketplace platform connecting customers with vetted local labor. Designed double-sided transaction routing, automatic worker assignment algorithms, and real-time request tracking using React Native and Firebase Firestore. Integrated secure end-to-end messaging and simplified billing workflows.",
  },
  {
    id: "exp-7",
    year: "2024",
    company: "Secure Share",
    role: "Security & Infrastructure",
    description:
      "Developed a zero-knowledge text and file sharing application optimized for team security. Implemented client-side cryptographic hashing, short-lived signed URLs, and automated self-destruct mechanisms to protect sensitive data transfers. Engineered role-based access validation and route security wrappers in React and Node.js.",
  },
  {
    id: "exp-8",
    year: "2024",
    company: "Academic ERP",
    role: "Full-Stack Engineer",
    description:
      "Architected an academic administration ERP system centralizing university operations. Designed scalable database schemas using PostgreSQL and Laravel to enforce strict relational integrity. Developed role-based access controls (RBAC) and high-throughput dashboards for student registration, grades processing, and resources distribution.",
  },
  {
    id: "exp-9",
    year: "2023 – Present",
    company: "Interactive Games",
    role: "Creative Technologist",
    description:
      "Designed and published independent interactive games focusing on custom physics engines, states synchronization, and responsive rendering. Experimented with structural programming, animation loops, and performance optimization techniques, mastering memory management and advanced algorithms in performance-critical environments.",
  },
  {
    id: "exp-10",
    year: "2023 – Present",
    company: "Interactive Web",
    role: "Creative Developer",
    description:
      "Designed and engineered award-caliber digital experiences combining WebGL, 3D typography, and timeline-driven motion design. Leveraged GSAP, Framer Motion, and Three.js to construct high-performance, fluid, and hardware-accelerated user interfaces, prioritizing web performance metrics (Core Web Vitals) and sub-second page loads.",
  },
  {
    id: "exp-11",
    year: "2023",
    company: "Bespoke Consulting",
    role: "Contract Software Engineer",
    description:
      "Consulted for companies and agencies to build bespoke enterprise software, analytics dashboards, and interactive marketing platforms. Optimized page load speeds, refactored legacy codebases into modern component-driven architectures, and established CI/CD deployment pipelines on AWS and Vercel.",
  },
];

export default function ExperienceSection() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <section
      id="experience"
      className="relative w-full bg-[#0A0A0A] py-32 md:py-40 px-6 md:px-16"
    >
      <div className="max-w-[1200px] w-full mx-auto">
        <div className="flex flex-col">
          {experiences.map((exp, index) => {
            const isHovered = hoveredId === exp.id;

            return (
              <motion.div
                key={exp.id}
                onMouseEnter={() => setHoveredId(exp.id)}
                onMouseLeave={() => setHoveredId(null)}
                className="group relative border-b border-[#F5F5F5]/10 py-12 md:py-20 cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 1.2, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex flex-col md:flex-row md:items-baseline gap-6 md:gap-16">

                  {/* Year */}
                  <div className="w-32 flex-shrink-0">
                    <span className="text-xl md:text-2xl font-inter text-[#8A8A8A] font-normal">
                      {exp.year}
                    </span>
                  </div>

                  {/* Company & Details */}
                  <div className="flex-grow">
                    <motion.h3
                      className="text-4xl md:text-6xl lg:text-8xl font-space-grotesk font-bold text-[#F5F5F5] tracking-tighter"
                      animate={{
                        x: isHovered ? 20 : 0,
                        color: isHovered ? "#FFFFFF" : "#8A8A8A"
                      }}
                      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {exp.company}
                    </motion.h3>

                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, filter: "blur(4px)" }}
                          animate={{ opacity: 1, height: "auto", filter: "blur(0px)" }}
                          exit={{ opacity: 0, height: 0, filter: "blur(4px)" }}
                          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="pt-8 pb-4 space-y-4 max-w-2xl">
                            <span className="inline-block px-4 py-2 rounded-full border border-[#F5F5F5]/20 text-[#F5F5F5] text-xs uppercase tracking-widest">
                              {exp.role}
                            </span>
                            <p className="text-lg md:text-xl font-inter text-[#8A8A8A] leading-relaxed">
                              {exp.description}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}