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

// GET /api/admin/reports — List moderation reports
export async function GET(request: NextRequest) {
  const admin = await verifyAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const url = new URL(request.url);
  const status = url.searchParams.get('status');
  const where = status ? { status: status as any } : {};

  const reports = await prisma.systemReport.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 100,
  });

  const counts = {
    pending: await prisma.systemReport.count({ where: { status: 'PENDING' } }),
    actioned: await prisma.systemReport.count({ where: { status: 'ACTIONED' } }),
    rejected: await prisma.systemReport.count({ where: { status: 'REJECTED' } }),
  };

  return NextResponse.json({ reports, counts });
}

// POST /api/admin/reports — Action on a report
export async function POST(request: NextRequest) {
  const admin = await verifyAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  const { reportId, status } = await request.json();
  if (!reportId || !status) {
    return NextResponse.json({ error: 'Missing reportId or status' }, { status: 400 });
  }

  const report = await prisma.systemReport.update({
    where: { id: reportId },
    data: { status },
  });

  await prisma.auditLog.create({
    data: {
      action: `REPORT_${status}`,
      module: 'MODERATION',
      targetId: String(reportId),
      targetType: 'REPORT',
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    },
  });

  return NextResponse.json({ report });
}
