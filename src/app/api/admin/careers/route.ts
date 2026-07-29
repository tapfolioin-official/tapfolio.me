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

// POST /api/admin/careers — Add a new job requirement
export async function POST(request: NextRequest) {
  const admin = await verifyAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  try {
    const { title, dept, loc, type } = await request.json();

    if (!title || !dept || !loc) {
      return NextResponse.json({ error: 'Missing title, department, or location' }, { status: 400 });
    }

    const job = await prisma.jobRequirement.create({
      data: {
        title,
        dept,
        loc,
        type: type || 'Full-time',
      },
    });

    // Log the administrative action
    await prisma.auditLog.create({
      data: {
        action: 'CAREER_ADD',
        module: 'CAREERS',
        targetId: String(job.id),
        targetType: 'JOB_REQUIREMENT',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    });

    return NextResponse.json({ success: true, job });
  } catch (error) {
    console.error('Failed to create job requirement:', error);
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}

// DELETE /api/admin/careers — Delete a job requirement
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

    const deletedJob = await prisma.jobRequirement.delete({
      where: { id },
    });

    // Log the administrative action
    await prisma.auditLog.create({
      data: {
        action: 'CAREER_DELETE',
        module: 'CAREERS',
        targetId: String(id),
        targetType: 'JOB_REQUIREMENT',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown',
      },
    });

    return NextResponse.json({ success: true, job: deletedJob });
  } catch (error) {
    console.error('Failed to delete job requirement:', error);
    return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
  }
}
