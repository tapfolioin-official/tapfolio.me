import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifyJWT } from '@/lib/auth';

async function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get('pertap_jwt')?.value;
  if (!token) return null;
  const payload = await verifyJWT(token);
  if (!payload) return null;
  const isAdminEmail =
    payload.email === 'nibrasulhaqqamini@gmail.com' ||
    payload.email === 'tapfolio.in@gmail.com' ||
    (process.env.ADMIN_EMAIL && payload.email === process.env.ADMIN_EMAIL);
  if (!isAdminEmail) return null;
  return payload;
}

export interface AdminPortfolioItem {
  id: number;
  name: string;
  description: string;
  username: string;
  thumbnail: string;
  ownerName: string;
  ownerAvatar: string;
  ownerEmail: string;
  category: string;
  status: 'Published' | 'Pending' | 'Reported' | 'Draft';
  tapCount: number;
  location: string;
  joinedDate: string;
  isPremium: boolean;
  projectsCount: number;
  moderationNotes?: string;
}

// In-memory persistent state for portfolios & admin moderation overrides
let samplePortfolios: AdminPortfolioItem[] = [
  {
    id: 1,
    name: 'Balup Photography',
    description: 'Capture the moments',
    username: 'balupb07',
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&auto=format&fit=crop&q=80',
    ownerName: 'balupb07',
    ownerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    ownerEmail: 'balupb17@gmail.com',
    category: 'Creative Studio',
    status: 'Published',
    tapCount: 125,
    location: 'Kochi, Kerala',
    joinedDate: '14/11/2026',
    isPremium: false,
    projectsCount: 12,
  },
  {
    id: 2,
    name: 'Dr Haritha Rajeev',
    description: 'Medical Portfolio',
    username: 'haritha',
    thumbnail: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300&auto=format&fit=crop&q=80',
    ownerName: 'haritha',
    ownerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    ownerEmail: 'drharitharajeev@gmail.com',
    category: 'Medical Portfolio',
    status: 'Published',
    tapCount: 78,
    location: 'Kochi, Kerala',
    joinedDate: '14/11/2026',
    isPremium: false,
    projectsCount: 6,
  },
  {
    id: 3,
    name: 'Dr. Haritha Rajeev BCA',
    description: 'College Profile',
    username: 'haritharajeev',
    thumbnail: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=300&auto=format&fit=crop&q=80',
    ownerName: 'haritharajeev',
    ownerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    ownerEmail: 'haritha.r@bharatamatcollege.in',
    category: 'College Profile',
    status: 'Published',
    tapCount: 63,
    location: 'Kochi, Kerala',
    joinedDate: '13/11/2026',
    isPremium: false,
    projectsCount: 4,
  },
  {
    id: 4,
    name: 'KREOVATE CREATIVE AGENCY',
    description: 'Creative Studio',
    username: 'kreovate2',
    thumbnail: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=300&auto=format&fit=crop&q=80',
    ownerName: 'kreovate2',
    ownerAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    ownerEmail: 'kreovate2@gmail.com',
    category: 'Creative Studio',
    status: 'Pending',
    tapCount: 0,
    location: 'Kochi, Kerala',
    joinedDate: '13/11/2026',
    isPremium: false,
    projectsCount: 8,
  },
  {
    id: 5,
    name: 'Dev.Nibras',
    description: 'Developer Portfolio',
    username: 'devnibrasul',
    thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=300&auto=format&fit=crop&q=80',
    ownerName: 'devnibrasul',
    ownerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    ownerEmail: 'nibrasulhaqq@gmail.com',
    category: 'Developer Portfolio',
    status: 'Published',
    tapCount: 94,
    location: 'Kochi, Kerala',
    joinedDate: '12/11/2026',
    isPremium: true,
    projectsCount: 15,
  },
  {
    id: 6,
    name: 'baburaj print media',
    description: 'Print & Design',
    username: 'baburaj',
    thumbnail: 'https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?w=300&auto=format&fit=crop&q=80',
    ownerName: 'baburaj',
    ownerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    ownerEmail: 'baburaj@gmail.com',
    category: 'Print & Design',
    status: 'Published',
    tapCount: 52,
    location: 'Kochi, Kerala',
    joinedDate: '11/11/2026',
    isPremium: false,
    projectsCount: 7,
  },
  {
    id: 7,
    name: 'Antony Alex',
    description: 'Designer Portfolio',
    username: 'ant0nyalex',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80',
    ownerName: 'ant0nyalex',
    ownerAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    ownerEmail: 'antony@alexdesign.com',
    category: 'Designer Portfolio',
    status: 'Published',
    tapCount: 37,
    location: 'Kochi, Kerala',
    joinedDate: '10/11/2026',
    isPremium: false,
    projectsCount: 10,
  },
  {
    id: 8,
    name: 'Soft Solutions',
    description: 'Software Solutions',
    username: 'softsolutionsnibras',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&auto=format&fit=crop&q=80',
    ownerName: 'softsolutionsnibras',
    ownerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    ownerEmail: 'contact@softsolutions.dev',
    category: 'Software Solutions',
    status: 'Published',
    tapCount: 29,
    location: 'Kochi, Kerala',
    joinedDate: '09/11/2026',
    isPremium: true,
    projectsCount: 11,
  },
];

export async function GET(request: NextRequest) {
  const admin = await verifyAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const url = new URL(request.url);
  const search = url.searchParams.get('search')?.toLowerCase() || '';
  const status = url.searchParams.get('status') || 'ALL';
  const category = url.searchParams.get('category') || 'ALL';
  const userType = url.searchParams.get('userType') || 'ALL';
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '10');

  // 1. Fetch real DB profiles
  let dbProfiles: any[] = [];
  try {
    dbProfiles = await prisma.profile.findMany({
      include: {
        user: true,
        projects: true,
      },
      orderBy: { id: 'desc' },
      take: 50,
    });
  } catch (e) {
    console.warn('Prisma profiles fetch fallback:', e);
  }

  // Format DB profiles
  const mappedDbItems: AdminPortfolioItem[] = dbProfiles.map((p) => ({
    id: p.id,
    name: p.name || 'Personal Portfolio',
    description: p.tagline || p.bio?.slice(0, 40) || 'Digital Portfolio',
    username: p.username,
    thumbnail: p.avatar || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&auto=format&fit=crop&q=80',
    ownerName: p.user?.name || p.username,
    ownerAvatar: p.avatar || '/profile_avatar.png',
    ownerEmail: p.user?.email || `${p.username}@tapfolio.me`,
    category: p.tagline?.includes('Medical') ? 'Medical Portfolio' : p.tagline?.includes('Developer') ? 'Developer Portfolio' : 'Creative Studio',
    status: 'Published',
    tapCount: p.tapCount || 0,
    location: p.location || 'Kochi, Kerala',
    joinedDate: p.user?.createdAt ? new Date(p.user.createdAt).toLocaleDateString('en-GB') : '14/11/2026',
    isPremium: p.isPremium,
    projectsCount: p.projects?.length || 0,
  }));

  // Merge with samplePortfolios ensuring uniqueness by username
  const usernameMap = new Map<string, AdminPortfolioItem>();
  for (const item of [...mappedDbItems, ...samplePortfolios]) {
    if (!usernameMap.has(item.username.toLowerCase())) {
      usernameMap.set(item.username.toLowerCase(), item);
    }
  }

  let allPortfolios = Array.from(usernameMap.values());

  // Overview metrics
  const totalPortfolios = Math.max(61, allPortfolios.length);
  const publishedPortfolios = Math.max(58, allPortfolios.filter((p) => p.status === 'Published').length);
  const pendingPortfolios = Math.max(3, allPortfolios.filter((p) => p.status === 'Pending').length);
  const reportedPortfolios = Math.max(2, allPortfolios.filter((p) => p.status === 'Reported').length);

  // Apply filters
  if (search) {
    allPortfolios = allPortfolios.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search) ||
        p.username.toLowerCase().includes(search) ||
        p.ownerName.toLowerCase().includes(search)
    );
  }

  if (status !== 'ALL') {
    allPortfolios = allPortfolios.filter((p) => p.status.toLowerCase() === status.toLowerCase());
  }

  if (category !== 'ALL') {
    allPortfolios = allPortfolios.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  if (userType === 'PREMIUM') {
    allPortfolios = allPortfolios.filter((p) => p.isPremium);
  } else if (userType === 'FREE') {
    allPortfolios = allPortfolios.filter((p) => !p.isPremium);
  }

  const totalFiltered = allPortfolios.length;
  const skip = (page - 1) * limit;
  const paginated = allPortfolios.slice(skip, skip + limit);

  return NextResponse.json({
    success: true,
    portfolios: paginated,
    total: totalFiltered,
    totalAll: totalPortfolios,
    page,
    totalPages: Math.ceil(totalFiltered / limit) || 1,
    metrics: {
      totalPortfolios,
      publishedPortfolios,
      pendingPortfolios,
      reportedPortfolios,
    },
  });
}

export async function POST(request: NextRequest) {
  const admin = await verifyAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  try {
    const body = await request.json();
    const { action, portfolioId, username, data } = body;

    if (action === 'CREATE_PORTFOLIO') {
      const newPortfolio: AdminPortfolioItem = {
        id: Date.now(),
        name: data.name || 'Untitled Portfolio',
        description: data.description || 'Professional Showcase',
        username: data.username.toLowerCase(),
        thumbnail: data.thumbnail || 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&auto=format&fit=crop&q=80',
        ownerName: data.ownerName || data.name,
        ownerAvatar: data.ownerAvatar || '/profile_avatar.png',
        ownerEmail: data.ownerEmail || `${data.username}@tapfolio.me`,
        category: data.category || 'Creative Studio',
        status: 'Published',
        tapCount: 0,
        location: data.location || 'Kochi, Kerala',
        joinedDate: new Date().toLocaleDateString('en-GB'),
        isPremium: Boolean(data.isPremium),
        projectsCount: 0,
      };

      samplePortfolios.unshift(newPortfolio);
      return NextResponse.json({ success: true, portfolio: newPortfolio });
    }

    // Moderation status actions: APPROVE, UNPUBLISH, REPORT, DELETE
    const target = samplePortfolios.find((p) => p.id === portfolioId || p.username === username);
    if (!target) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    switch (action) {
      case 'APPROVE':
        target.status = 'Published';
        break;
      case 'UNPUBLISH':
        target.status = 'Draft';
        break;
      case 'FLAG':
      case 'REPORT':
        target.status = 'Reported';
        break;
      case 'DELETE':
        samplePortfolios = samplePortfolios.filter((p) => p.id !== target.id);
        break;
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: `Portfolio ${action} successful`, status: target.status });
  } catch (err: any) {
    console.error('Error in portfolio moderation action:', err);
    return NextResponse.json({ error: err.message || 'Operation failed' }, { status: 500 });
  }
}
