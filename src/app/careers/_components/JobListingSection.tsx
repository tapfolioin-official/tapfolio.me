"use client";

import React from "react";

interface Job {
  title: string;
  dept: string;
  loc: string;
  type: string;
}

interface JobListingSectionProps {
  jobs: Job[];
}

export default function JobListingSection({ jobs }: JobListingSectionProps) {
  const openApplyWindow = (job: Job) => {
    if (typeof window !== "undefined") {
      const url = `/careers/apply?title=${encodeURIComponent(job.title)}&dept=${encodeURIComponent(job.dept)}&loc=${encodeURIComponent(job.loc)}`;
      
      // Open in a new pop-up window
      const width = 720;
      const height = 850;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      
      window.open(
        url,
        "_blank",
        `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
      );
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {jobs.map((j, idx) => (
        <div
          key={idx}
          className="border border-slate-800/80 bg-slate-900/20 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-blue-500/50 transition-all"
        >
          <div className="flex flex-col gap-1.5">
            <h3 className="font-bold text-white text-lg">{j.title}</h3>
            <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold">
              <span>🏢 {j.dept}</span>
              <span>•</span>
              <span>📍 {j.loc}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
            <span className="bg-slate-800 text-slate-300 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-slate-700">
              {j.type}
            </span>
            <button
              onClick={() => openApplyWindow(j)}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-2.5 rounded-xl cursor-pointer transition-all"
            >
              Apply Now
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
