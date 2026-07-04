import type { Metadata } from 'next';
import prisma from '@/lib/db';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{
    userId: string;
    projectSlug: string;
  }>;
}

export async function generateMetadata({ params }: { params: Promise<{ userId: string; projectSlug: string }> }): Promise<Metadata> {
  const { userId, projectSlug } = await params;
  const username = userId.replace('%40', '').replace('@', '').toLowerCase().trim();

  const profile = await prisma.profile.findUnique({
    where: { username }
  });

  if (!profile) return {};

  const project = await prisma.project.findFirst({
    where: {
      profileId: profile.id,
      slug: projectSlug.toLowerCase().trim()
    }
  });

  if (!project) {
    return {
      title: 'Project Not Found | Tapfolio'
    };
  }

  return {
    title: `${project.name} | Portfolio by ${profile.name}`,
    description: project.shortDesc,
    openGraph: {
      title: `${project.name} | ${profile.name}'s Portfolio`,
      description: project.shortDesc,
      type: 'article',
      url: `https://www.tapfolio.me/${profile.username}/projects/${project.slug}`,
      images: project.coverImage ? [project.coverImage] : [],
    }
  };
}

export default function ProjectLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
