import { notFound } from "next/navigation";
import Link from "next/link";
import { projectsData, ProjectCaseStudy } from "@/data/projects";
import Navigation from "@/components/portfolio/Navigation";
import FooterSection from "@/components/portfolio/FooterSection";

export async function generateStaticParams() {
  return projectsData.map((project) => ({
    username: "nibras",
    slug: project.slug,
  }));
}

export default async function ProjectCaseStudyPage({
  params,
}: {
  params: Promise<{ username: string; slug: string }>;
}) {
  const { username, slug } = await params;

  // Search case study in centralized data layer
  const project: ProjectCaseStudy | undefined = projectsData.find(
    (p) => p.slug.toLowerCase() === slug.toLowerCase()
  );

  if (!project) {
    return notFound();
  }

  // Construct Google JSON-LD SoftwareApplication Schema
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": project.name,
    "applicationCategory": project.category,
    "operatingSystem": "Web, iOS, Android",
    "author": {
      "@type": "Person",
      "name": "Mohammed Nibrasul Haqq",
      "jobTitle": "Co-Founder & CTO",
      "url": "https://www.tapfolio.me/founders/mohammed-nibrasul-haqq"
    },
    "description": project.solution,
    "url": project.url || `https://www.tapfolio.me/portfolio/nibras/projects/${project.slug}`
  };

  return (
    <main className="relative w-full bg-[#0A0A0A] text-white min-h-screen selection:bg-blue-600 selection:text-white">
      {/* Schema Injection */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Navigation />

      <article className="max-w-[1000px] w-full mx-auto px-6 md:px-12 pt-32 pb-24 flex flex-col gap-12">
        
        {/* Top Back Navigation */}
        <div className="flex items-center justify-between border-b border-white/10 pb-6">
          <Link
            href={`/portfolio/${username}#projects`}
            className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2"
          >
            ← Back to All Case Studies
          </Link>
          <span className="text-xs text-gray-500 font-space-grotesk font-semibold">
            {project.year} • {project.category}
          </span>
        </div>

        {/* Header Title & Role */}
        <div className="flex flex-col gap-4">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full w-fit">
            <span className="text-xs font-bold text-blue-300 uppercase tracking-wider">{project.role}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black font-space-grotesk text-white tracking-tight">
            {project.name}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 italic font-inter leading-relaxed">
            &quot;{project.tagline}&quot;
          </p>
        </div>

        {/* Cover Image Banner */}
        <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden border-2 border-white/10 shadow-2xl bg-[#111625]">
          <img
            src={project.image}
            alt={project.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Quick Spec Matrix */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#111625]/60 border border-white/10 rounded-2xl p-6 text-xs">
          <div>
            <span className="text-gray-500 uppercase font-bold tracking-wider block mb-1">Role</span>
            <span className="font-semibold text-white">{project.role}</span>
          </div>
          <div>
            <span className="text-gray-500 uppercase font-bold tracking-wider block mb-1">Timeline</span>
            <span className="font-semibold text-white">{project.duration}</span>
          </div>
          <div>
            <span className="text-gray-500 uppercase font-bold tracking-wider block mb-1">Domain</span>
            <span className="font-semibold text-white">{project.category}</span>
          </div>
          <div>
            <span className="text-gray-500 uppercase font-bold tracking-wider block mb-1">Lead Author</span>
            <span className="font-semibold text-blue-400">Mohammed Nibrasul Haqq</span>
          </div>
        </div>

        {/* Section 1: The Challenge */}
        <section className="flex flex-col gap-4 border-t border-white/10 pt-10">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">01. The Challenge</span>
          <h2 className="text-2xl md:text-3xl font-bold font-space-grotesk text-white">Problem Statement</h2>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed">
            {project.problem}
          </p>
        </section>

        {/* Section 2: Technical Solution & Architecture */}
        <section className="flex flex-col gap-4 border-t border-white/10 pt-10">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">02. Engineering & Architecture</span>
          <h2 className="text-2xl md:text-3xl font-bold font-space-grotesk text-white">Technical Solution</h2>
          <p className="text-gray-300 text-base md:text-lg leading-relaxed">
            {project.solution}
          </p>

          <div className="bg-[#111625]/80 border border-blue-500/30 rounded-2xl p-6 mt-4 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-300 block">System Data Flow & Architecture</span>
            <p className="text-sm font-mono text-gray-200 leading-relaxed bg-black/40 p-4 rounded-xl border border-white/10">
              {project.architectureOverview}
            </p>
          </div>
        </section>

        {/* Section 3: My Contributions & Stack */}
        <section className="flex flex-col gap-6 border-t border-white/10 pt-10">
          <span className="text-xs font-bold uppercase tracking-widest text-blue-400">03. Execution & Tech Stack</span>
          <h2 className="text-2xl md:text-3xl font-bold font-space-grotesk text-white">My Engineering Responsibilities</h2>
          
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-300">
            {project.responsibilities.map((resp, rIdx) => (
              <li key={rIdx} className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-center gap-3">
                <span className="text-blue-400 font-bold text-base">✓</span>
                <span>{resp}</span>
              </li>
            ))}
          </ul>

          <div className="pt-4 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block">Technologies Used</span>
            <div className="flex flex-wrap gap-2">
              {project.stack.map((tech, tIdx) => (
                <span key={tIdx} className="bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold px-3 py-1.5 rounded-lg">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Section 4: Key Impact & Outcome */}
        <section className="flex flex-col gap-4 border-t border-white/10 pt-10">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">04. Outcome & Impact</span>
          <h2 className="text-2xl md:text-3xl font-bold font-space-grotesk text-white">Results Delivered</h2>
          <div className="bg-emerald-500/10 border-l-4 border-emerald-500 rounded-r-2xl p-6">
            <p className="text-base md:text-lg text-emerald-200 font-medium leading-relaxed">
              {project.impact}
            </p>
          </div>
        </section>

        {/* Section 5: Lessons Learned */}
        {project.lessonsLearned && project.lessonsLearned.length > 0 && (
          <section className="flex flex-col gap-4 border-t border-white/10 pt-10">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">05. Engineering Reflection</span>
            <h2 className="text-2xl md:text-3xl font-bold font-space-grotesk text-white">Lessons Learned</h2>
            <div className="space-y-3">
              {project.lessonsLearned.map((lesson, lIdx) => (
                <div key={lIdx} className="bg-white/5 border border-white/10 p-5 rounded-2xl flex items-start gap-3">
                  <span className="text-blue-400 font-serif text-2xl leading-none">💡</span>
                  <p className="text-sm md:text-base text-gray-200 leading-relaxed font-medium">
                    {lesson}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Action Bar Footer */}
        <div className="flex flex-wrap items-center gap-4 pt-10 border-t border-white/10">
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-space-grotesk font-bold rounded-full text-xs uppercase tracking-widest transition-all shadow-lg shadow-blue-600/25"
            >
              Visit Live Project ↗
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-space-grotesk font-semibold rounded-full text-xs uppercase tracking-widest transition-all border border-white/15"
            >
              View Source Code ↗
            </a>
          )}
          <Link
            href={`/portfolio/${username}#projects`}
            className="px-6 py-4 text-xs font-semibold text-gray-400 hover:text-white transition-colors"
          >
            ← Back to Showcase
          </Link>
        </div>

      </article>

      <FooterSection />
    </main>
  );
}
