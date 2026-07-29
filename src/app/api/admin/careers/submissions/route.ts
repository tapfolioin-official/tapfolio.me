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

// GET /api/admin/careers/submissions — List all job submissions
export async function GET(request: NextRequest) {
  const admin = await verifyAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  try {
    const submissions = await prisma.jobApplication.findMany({
      orderBy: { createdAt: 'desc' },
      take: 200, // Safety cap
    });

    return NextResponse.json({ success: true, submissions });
  } catch (error) {
    console.error('Failed to fetch job submissions:', error);
    return NextResponse.json({ error: 'Database query failed' }, { status: 500 });
  }
}

// DELETE /api/admin/careers/submissions — Remove an application submission
export async function DELETE(request: NextRequest) {
  const admin = await verifyAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  try {
    const url = new URL(request.url);
    const idStr = url.searchParams.get('id');

    if (!idStr) {
      return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
    }

    const id = parseInt(idStr, 10);
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid id format' }, { status: 400 });
    }

    const deletedApp = await prisma.jobApplication.delete({
      where: { id },
    });

    // Log administrative action
    await prisma.auditLog.create({
      data: {
        action: 'CAREER_APPLICATION_DELETE',
        module: 'CAREERS',
        targetId: String(id),
        targetType: 'JOB_APPLICATION',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    });

    return NextResponse.json({ success: true, application: deletedApp });
  } catch (error) {
    console.error('Failed to delete application submission:', error);
    return NextResponse.json({ error: 'Failed to delete application' }, { status: 500 });
  }
}
