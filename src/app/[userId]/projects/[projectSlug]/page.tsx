import { notFound } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/db';

interface PageProps {
  params: Promise<{
    userId: string;
    projectSlug: string;
  }>;
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { userId, projectSlug } = await params;
  const username = userId.replace('%40', '').replace('@', '').toLowerCase().trim();

  // Load the profile details
  const profile = await prisma.profile.findUnique({
    where: { username },
    include: {
      user: true,
    }
  });

  if (!profile) return notFound();

  // Load the specific project
  const project = await prisma.project.findFirst({
    where: {
      profileId: profile.id,
      slug: projectSlug.toLowerCase().trim(),
      isPublic: true,
    }
  });

  if (!project) return notFound();

  const formattedStartDate = project.startDate
    ? new Date(project.startDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })
    : '';
  const formattedEndDate = project.endDate
    ? new Date(project.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })
    : 'Present';

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-900 flex flex-col justify-between">
      {/* Header Back Button */}
      <header className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href={`/@${profile.username}`} className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-blue-600 transition-colors">
            <span>←</span> Back to {profile.name}
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-full font-bold text-blue-600 uppercase tracking-wider">{project.category}</span>
            <span className="text-xs px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-full font-bold text-gray-500 uppercase tracking-wider">{project.status}</span>
          </div>
        </div>
      </header>

      {/* Content Container */}
      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full">
        {project.showCover && project.coverImage && (
          <div className="w-full h-80 rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-8 bg-white">
            <img src={project.coverImage} alt={project.name} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 leading-none">{project.name}</h1>
            {project.showDates && project.startDate && (
              <p className="text-sm text-gray-400 mt-2 font-medium">
                {formattedStartDate} — {formattedEndDate}
              </p>
            )}
          </div>

          {/* Links Grid */}
          <div className="flex flex-wrap gap-3">
            {project.liveDemo && (
              <a href={project.liveDemo} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl text-sm hover:bg-blue-700 shadow-sm transition-all flex items-center gap-2">
                <span>🌐</span> Visit Live Demo
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl text-sm hover:bg-gray-50 shadow-sm transition-all flex items-center gap-2">
                <span>💻</span> View Source
              </a>
            )}
            {project.appStore && (
              <a href={project.appStore} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl text-sm hover:bg-gray-50 shadow-sm transition-all flex items-center gap-2">
                <span>🍎</span> App Store
              </a>
            )}
            {project.playStore && (
              <a href={project.playStore} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl text-sm hover:bg-gray-50 shadow-sm transition-all flex items-center gap-2">
                <span>🤖</span> Google Play
              </a>
            )}
            {project.documentation && (
              <a href={project.documentation} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl text-sm hover:bg-gray-50 shadow-sm transition-all flex items-center gap-2">
                <span>📝</span> Docs
              </a>
            )}
            {project.caseStudy && (
              <a href={project.caseStudy} target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl text-sm hover:bg-gray-50 shadow-sm transition-all flex items-center gap-2">
                <span>📊</span> Case Study
              </a>
            )}
          </div>

          <hr className="border-gray-100 my-2" />

          {/* Tech stack */}
          {project.showTechnologies && project.techStack.length > 0 && (
            <div className="flex flex-col gap-2">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Technologies / Stack</h3>
              <div className="flex flex-wrap gap-2">
                {project.techStack.map((tech, idx) => (
                  <span key={idx} className="px-3 py-1 bg-white border border-gray-100 rounded-lg text-sm font-semibold text-gray-600 shadow-sm">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Full description */}
          <div className="mt-4 flex flex-col gap-3">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Project Details</h3>
            <div className="text-gray-700 text-base leading-relaxed whitespace-pre-wrap bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
              {project.fullDesc || project.shortDesc}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 text-center text-xs text-gray-400 font-medium">
          Powered by <Link href="/" className="font-bold text-blue-600 hover:underline">Tapfolio</Link> Digital Cards
        </div>
      </footer>
    </div>
  );
}
