"use client";

import { motion } from "framer-motion";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar?: string;
}

const testimonials: Testimonial[] = [
  {
    quote: "Nibras possesses rare technical breadth—from low-level NFC hardware NDEF payloads to high-throughput Next.js web platforms. His ability to architect and ship scalable products with extreme speed was essential in launching Tapfolio.",
    author: "Abhinand",
    role: "Co-Founder & CEO",
    company: "Tapfolio"
  },
  {
    quote: "Working with Nibras on our e-commerce platform was seamless. He delivered an elegant, high-performing website that perfectly captured our brand's artisanal story and significantly boosted customer engagement.",
    author: "Client Partner",
    role: "Brand & Operations Lead",
    company: "Old School Tea"
  },
  {
    quote: "Nibras is a exceptionally talented full-stack systems engineer. His approach to software design combines clean component architecture with deep attention to database integrity and edge performance.",
    author: "Engineering Collaborator",
    role: "Senior Full-Stack Architect",
    company: "Bespoke Consulting"
  }
];

export default function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="relative w-full bg-[#0A0A0A] py-28 md:py-36 px-6 md:px-16 border-t border-white/10"
    >
      <div className="max-w-[1200px] w-full mx-auto flex flex-col gap-16">
        
        {/* Header */}
        <div className="flex flex-col gap-4">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Social Proof & Trust</span>
          <h2 className="text-4xl md:text-6xl font-black font-space-grotesk text-white tracking-tight">
            Testimonials & Recommendations
          </h2>
          <p className="text-gray-400 max-w-2xl text-base md:text-lg">
            Endorsements from startup co-founders, enterprise client partners, and senior software engineering collaborators.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-[#111625]/60 border border-white/10 rounded-3xl p-8 flex flex-col justify-between gap-6 hover:border-blue-500/30 transition-all shadow-xl"
            >
              <div className="flex flex-col gap-4">
                <span className="text-4xl text-blue-400 font-serif leading-none select-none">❝</span>
                <p className="text-sm text-gray-300 italic leading-relaxed">
                  &quot;{t.quote}&quot;
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white font-space-grotesk">{t.author}</h4>
                  <span className="text-xs text-blue-400 font-semibold">{t.role} • {t.company}</span>
                </div>
                <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
                  Verified
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
