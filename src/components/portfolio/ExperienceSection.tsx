"use client";

import { motion } from "framer-motion";

interface Experience {
  id: string;
  year: string;
  company: string;
  role: string;
  location: string;
  description: string;
  bullets: string[];
}

const experiences: Experience[] = [
  {
    id: "exp-1",
    year: "2024 – Present",
    company: "Tapfolio",
    role: "Co-Founder & CTO",
    location: "Bangalore, India",
    description:
      "Co-founded and engineered Tapfolio, a professional networking platform combining physical NFC hardware with real-time digital profiles.",
    bullets: [
      "Architected Next.js App Router platform, PostgreSQL schemas, and Supabase integration scaling to thousands of daily contacts.",
      "Engineered multi-device NFC provisioning algorithms, custom domain routing, and instant lead capture analytics.",
      "Established CI/CD pipeline on Vercel & AWS, delivering sub-second page loads and 99.9% uptime."
    ]
  },
  {
    id: "exp-2",
    year: "2025",
    company: "JARVIS AI Initiative",
    role: "AI Systems Architect",
    location: "Remote",
    description:
      "Engineered an event-driven AI agent orchestration system that automates local and cloud developer workflows.",
    bullets: [
      "Built custom CLI & voice shell assistant utilizing OpenAI APIs and Node.js/Python microservices.",
      "Automated complex database backups, environment setups, and deployment triggers, cutting manual maintenance by 80%."
    ]
  },
  {
    id: "exp-3",
    year: "2025",
    company: "Spatial Intelligence Lab",
    role: "Machine Learning Engineer",
    location: "Remote",
    description:
      "Designed a predictive spatial intelligence platform leveraging machine learning for regional risk forecasting.",
    bullets: [
      "Developed data processing pipelines using TensorFlow & Pandas, processing large temporal datasets.",
      "Constructed interactive geospatial visualizations using React and D3.js to map high-risk density clusters."
    ]
  },
  {
    id: "exp-4",
    year: "2025",
    company: "Smart Fleet Transit",
    role: "Systems Architect",
    location: "Bangalore, India",
    description:
      "Built a high-frequency real-time transit telemetry platform for enterprise fleet management.",
    bullets: [
      "Architected WebSocket backend with Node.js and Socket.io to process high-frequency GPS coordinate streams.",
      "Rendered dynamic vehicle map layers with sub-second latency on a React frontend."
    ]
  },
  {
    id: "exp-5",
    year: "2024",
    company: "LocalConnect",
    role: "Founder & Mobile Lead",
    location: "Kerala, India",
    description:
      "Conceived and launched a location-aware service marketplace connecting customers with local labor.",
    bullets: [
      "Designed double-sided transaction routing and automated job assignment using React Native and Firebase Firestore.",
      "Integrated secure in-app messaging and simplified billing workflows for service workers."
    ]
  },
  {
    id: "exp-6",
    year: "2023 – 2024",
    company: "Bespoke Engineering Consulting",
    role: "Contract Full-Stack Engineer",
    location: "Remote",
    description:
      "Consulted for high-growth startups and agencies to build enterprise web applications and analytics dashboards.",
    bullets: [
      "Refactored legacy codebases into modern Next.js component-driven architectures.",
      "Optimized Core Web Vitals, achieving top Lighthouse performance scores and mobile responsiveness."
    ]
  }
];

export default function ExperienceSection() {
  return (
    <section
      id="experience"
      className="relative w-full bg-[#0A0A0A] py-28 md:py-36 px-6 md:px-16 border-t border-white/10"
    >
      <div className="max-w-[1200px] w-full mx-auto flex flex-col gap-16">
        
        {/* Header */}
        <div className="flex flex-col gap-4">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Career History</span>
          <h2 className="text-4xl md:text-6xl font-black font-space-grotesk text-white tracking-tight">
            Professional Experience
          </h2>
          <p className="text-gray-400 max-w-2xl text-base md:text-lg">
            Proven track record of co-founding startups, building cloud architectures, and delivering enterprise software solutions.
          </p>
        </div>

        {/* Timeline List */}
        <div className="flex flex-col gap-8">
          {experiences.map((exp, idx) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#111625]/40 border border-white/10 rounded-3xl p-8 flex flex-col md:flex-row gap-6 md:gap-12 hover:border-blue-500/30 transition-all"
            >
              {/* Left Column: Period & Company */}
              <div className="md:w-1/3 flex flex-col gap-2">
                <span className="text-xs font-extrabold text-blue-400 uppercase tracking-widest bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 w-fit">
                  {exp.year}
                </span>
                <h3 className="text-2xl font-bold font-space-grotesk text-white mt-1">
                  {exp.company}
                </h3>
                <span className="text-sm font-semibold text-gray-300">{exp.role}</span>
                <span className="text-xs text-gray-500">{exp.location}</span>
              </div>

              {/* Right Column: Narrative & Key Achievements */}
              <div className="md:w-2/3 flex flex-col gap-4">
                <p className="text-gray-300 text-sm md:text-base leading-relaxed font-medium">
                  {exp.description}
                </p>
                
                <ul className="space-y-2 text-sm text-gray-400">
                  {exp.bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2.5">
                      <span className="text-blue-400 font-bold text-base leading-none">•</span>
                      <span className="leading-relaxed">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}