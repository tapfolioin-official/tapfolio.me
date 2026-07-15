import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { verifyJWT } from '@/lib/auth';
import ConnectClientPage from './ConnectClientPage';

type PageProps = {
  params: Promise<{
    username: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { username } = await params;

  const profile = await prisma.profile.findUnique({
    where: {
      username: username.toLowerCase().trim(),
    },
    select: {
      name: true,
      tagline: true,
    },
  });

  if (!profile) {
    return {
      title: 'Profile Not Found — Tapfolio',
      description: 'The requested profile could not be found.',
    };
  }

  return {
    title: `Connect with ${profile.name} — Tapfolio`,
    description: `Connect with ${profile.name}${profile.tagline ? `: ${profile.tagline}` : ''
      }`,
  };
}

export default async function ConnectRedirectPage({
  params,
}: PageProps) {
  const { username } = await params;

  const slug = username.toLowerCase().trim();

  const profile = await prisma.profile.findUnique({
    where: {
      username: slug,
    },
    select: {
      id: true,
      userId: true,
      name: true,
      avatar: true,
      tagline: true,
      isPremium: true,
      portfolioUrl: true,
    },
  });

  if (!profile) {
    notFound();
  }

  const cookieStore = await cookies();
  const token = cookieStore.get('pertap_jwt')?.value;

  let isLoggedIn = false;

  if (token) {
    const user = await verifyJWT(token);
    isLoggedIn = user !== null;
  }

  return (
    <ConnectClientPage
      username={slug}
      profile={{
        id: profile.id,
        userId: profile.userId,
        name: profile.name,
        avatar: profile.avatar,
        tagline: profile.tagline ?? '',
        isPremium: profile.isPremium ?? false,
        portfolioUrl: profile.portfolioUrl ?? '',
      }}
      isLoggedIn={isLoggedIn}
    />
  );
}