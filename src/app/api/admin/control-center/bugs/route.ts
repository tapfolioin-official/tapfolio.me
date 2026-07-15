import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { verifyJWT } from '@/lib/auth';

async function verifyAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get('pertap_jwt')?.value;
  if (!token) return null;

  const payload = await verifyJWT(token);
  if (!payload) return null;

  const user = await prisma.user.findUnique({
    where: { id: payload.userId }
  });

  if (!user) {
    return null;
  }

  const isAdminEmail = 
    user.email === 'nibrasulhaqqamini@gmail.com' || 
    user.email === 'tapfolio.in@gmail.com' ||
    user.email === process.env.ADMIN_EMAIL;

  if (!isAdminEmail) {
    return null;
  }

  return user;
}

export async function GET() {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    let bugs = await prisma.controlBug.findMany({
      orderBy: { createdAt: 'desc' }
    });

    if (bugs.length === 0) {
      await prisma.controlBug.createMany({
        data: [
          { title: 'Verify server proxy routing configuration (proxy.ts is correct for Next.js 16)', severity: 'CRITICAL', module: 'Authentication', status: 'RESOLVED' },
          { title: 'Potential full-table database scans on profile queries due to missing foreign key indexes', severity: 'HIGH', module: 'Database', status: 'OPEN' },
          { title: 'Duplicated portfolio rendering clones for abhinand/nibras static layouts', severity: 'MEDIUM', module: 'Portfolio', status: 'OPEN' },
        ]
      });
      bugs = await prisma.controlBug.findMany({
        orderBy: { createdAt: 'desc' }
      });
    }

    return NextResponse.json({ success: true, bugs });
  } catch (error: any) {
    console.error('List bugs error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await request.json();
    const { id, title, severity, module, status } = body;

    if (id) {
      const bug = await prisma.controlBug.update({
        where: { id: parseInt(id) },
        data: {
          title: title !== undefined ? title : undefined,
          severity: severity !== undefined ? severity : undefined,
          module: module !== undefined ? module : undefined,
          status: status !== undefined ? status : undefined,
        }
      });
      return NextResponse.json({ success: true, bug });
    } else {
      if (!title) {
        return NextResponse.json({ error: 'Title is required.' }, { status: 400 });
      }

      const bug = await prisma.controlBug.create({
        data: {
          title,
          severity: severity || 'MEDIUM',
          module: module || 'General',
          status: status || 'OPEN'
        }
      });
      return NextResponse.json({ success: true, bug });
    }
  } catch (error: any) {
    console.error('Save bug error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const admin = await verifyAdmin();
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required.' }, { status: 400 });
    }

    await prisma.controlBug.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ success: true, message: 'Bug deleted successfully.' });
  } catch (error: any) {
    console.error('Delete bug error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
