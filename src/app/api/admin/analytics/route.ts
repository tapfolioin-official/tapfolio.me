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

// GET /api/admin/analytics — Aggregate analytics data
export async function GET(request: NextRequest) {
  const admin = await verifyAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    todayUsers,
    weekUsers,
    monthUsers,
    premiumUsers,
    totalProfiles,
    totalProjects,
    recentEvents,
    openTickets,
    pendingReports,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: todayStart } } }),
    prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.user.count({ where: { createdAt: { gte: monthAgo } } }),
    prisma.profile.count({ where: { isPremium: true } }),
    prisma.profile.count(),
    prisma.project.count(),
    prisma.analyticsEvent.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
    prisma.supportTicket.count({ where: { status: 'OPEN' } }),
    prisma.systemReport.count({ where: { status: 'PENDING' } }),
  ]);

  // Calculate growth percentage
  const previousWeekUsers = await prisma.user.count({
    where: {
      createdAt: {
        gte: new Date(weekAgo.getTime() - 7 * 24 * 60 * 60 * 1000),
        lt: weekAgo,
      },
    },
  });
  const growth = previousWeekUsers > 0
    ? ((weekUsers - previousWeekUsers) / previousWeekUsers * 100).toFixed(1)
    : '0';

  return NextResponse.json({
    kpis: {
      totalUsers,
      todayUsers,
      weekUsers,
      monthUsers,
      premiumUsers,
      totalProfiles,
      totalProjects,
      growth: parseFloat(growth as string),
      openTickets,
      pendingReports,
    },
    recentEvents,
  });
}
