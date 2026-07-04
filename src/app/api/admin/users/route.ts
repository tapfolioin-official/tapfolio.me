import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifyJWT } from '@/lib/auth';

async function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get('pertap_jwt')?.value;
  if (!token) return null;
  const payload = await verifyJWT(token);
  if (!payload || payload.email !== 'nibrasulhaqqamini@gmail.com') return null;
  return payload;
}

// GET /api/admin/users — List users with search & pagination
export async function GET(request: NextRequest) {
  const admin = await verifyAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const url = new URL(request.url);
  const search = url.searchParams.get('search') || '';
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '20');
  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { email: { contains: search, mode: 'insensitive' as const } },
          { profile: { username: { contains: search, mode: 'insensitive' as const } } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: {
        profile: {
          select: {
            username: true,
            avatar: true,
            isPremium: true,
            tapCount: true,
            location: true,
            isOnline: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return NextResponse.json({
    users: users.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email,
      username: u.profile?.username || null,
      avatar: u.profile?.avatar || null,
      isPremium: u.profile?.isPremium || false,
      tapCount: u.profile?.tapCount || 0,
      location: u.profile?.location || null,
      isOnline: u.profile?.isOnline || false,
      profileReady: u.profileReady,
      createdAt: u.createdAt,
    })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  });
}

// POST /api/admin/users — Perform moderation actions
export async function POST(request: NextRequest) {
  const admin = await verifyAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const body = await request.json();
  const { action, userId } = body;

  if (!action || !userId) {
    return NextResponse.json({ error: 'Missing action or userId' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: userId }, include: { profile: true } });
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  // Log the action
  await prisma.auditLog.create({
    data: {
      action,
      module: 'USER_MANAGEMENT',
      targetId: String(userId),
      targetType: 'USER',
      before: JSON.parse(JSON.stringify({ name: user.name, email: user.email })),
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    },
  });

  switch (action) {
    case 'DELETE':
      await prisma.user.delete({ where: { id: userId } });
      return NextResponse.json({ success: true, message: 'User deleted' });

    case 'RESET_PASSWORD':
      await prisma.user.update({
        where: { id: userId },
        data: { passwordHash: null },
      });
      return NextResponse.json({ success: true, message: 'Password cleared' });

    default:
      return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  }
}
