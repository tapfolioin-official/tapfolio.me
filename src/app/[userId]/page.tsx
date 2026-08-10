import { notFound } from 'next/navigation';
import prisma from '@/lib/db';
import ConnectClientPage from '../connect/[username]/ConnectClientPage';

export default async function PublicProfile({ params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params;

  let profile = null;

  // 1. Try finding by numeric userId first
  const parsedUserId = parseInt(userId, 10);
  if (!isNaN(parsedUserId)) {
    profile = await prisma.profile.findUnique({
      where: { userId: parsedUserId },
      include: { 
        tags: true, 
        socials: true, 
        user: true,
        projects: {
          where: { isPublic: true },
          orderBy: { displayOrder: 'asc' }
        }
      }
    });
  }

  // 2. Try finding by username field directly
  if (!profile) {
    profile = await prisma.profile.findUnique({
      where: { username: userId.toLowerCase().trim() },
      include: { 
        tags: true, 
        socials: true, 
        user: true,
        projects: {
          where: { isPublic: true },
          orderBy: { displayOrder: 'asc' }
        }
      }
    });
  }

  // 3. Fallback to finding by slugified name
  if (!profile) {
    const slugify = (text: string) =>
      text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const normalizedParam = userId.toLowerCase().trim();
    const spaceSeparated = normalizedParam.replace(/-/g, ' ');
    
    profile = await prisma.profile.findFirst({
      where: {
        name: {
          equals: spaceSeparated,
          mode: 'insensitive'
        }
      },
      include: { 
        tags: true, 
        socials: true, 
        user: true,
        projects: {
          where: { isPublic: true },
          orderBy: { displayOrder: 'asc' }
        }
      }
    });

    if (!profile) {
      const allProfiles = await prisma.profile.findMany({
        include: { 
          tags: true, 
          socials: true, 
          user: true,
          projects: {
            where: { isPublic: true },
            orderBy: { displayOrder: 'asc' }
          }
        }
      });
      profile = allProfiles.find(p => slugify(p.name) === normalizedParam) || null;
    }
  }

  if (!profile) {
    return notFound();
  }

  return (
    <ConnectClientPage
      username={profile.username}
      profile={{
        id: profile.id,
        userId: profile.userId,
        name: profile.name,
        avatar: profile.avatar,
        tagline: profile.tagline ?? '',
        isPremium: profile.isPremium ?? false,
        portfolioUrl: profile.portfolioUrl ?? '',
        resumeUrl: profile.resumeUrl ?? '',
        whatsapp: profile.whatsapp ?? '',
      }}
      isLoggedIn={false}
    />
  );
}
