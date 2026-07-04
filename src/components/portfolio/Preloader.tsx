"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const hasLoaded = sessionStorage.getItem("portfolio-preloader-loaded");
    if (hasLoaded) {
      setIsLoading(false);
      return;
    }

    const duration = 2200;
    const interval = 20;
    const steps = duration / interval;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      // Eased progress curve
      const t = step / steps;
      const eased = t < 0.5
        ? 4 * t * t * t
        : 1 - Math.pow(-2 * t + 2, 3) / 2;
      setProgress(Math.min(Math.round(eased * 100), 100));

      if (step >= steps) {
        clearInterval(timer);
        sessionStorage.setItem("portfolio-preloader-loaded", "true");
        setTimeout(() => setIsLoading(false), 400);
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const nameLetters = "MOHAMMED NIBRASUL HAQQ".split("");

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="preloader"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9999] bg-white flex flex-col items-center justify-center"
        >
          {/* Name reveal */}
          <div className="flex items-center gap-[2px] mb-8">
            {nameLetters.map((letter, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.3 + i * 0.05,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="text-2xl md:text-4xl font-space-grotesk font-bold tracking-[0.1em] text-slate-900"
              >
                {letter === " " ? "\u00A0" : letter}
              </motion.span>
            ))}
          </div>

          {/* Progress bar */}
          <div className="w-[280px] md:w-[480px] relative">
            <div className="h-[2px] w-full bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-slate-900"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.05 }}
              />
            </div>
            <div className="mt-3 flex justify-between items-center">
              <span className="text-[9px] font-inter tracking-[0.2em] text-slate-400 uppercase">
                Loading
              </span>
              <span className="text-[10px] font-inter tracking-widest text-slate-500 tabular-nums">
                {progress}%
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
