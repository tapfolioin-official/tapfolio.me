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

    let tasks = await prisma.controlTask.findMany({
      orderBy: { createdAt: 'desc' }
    });

    if (tasks.length === 0) {
      await prisma.controlTask.createMany({
        data: [
          { title: 'Rename proxy.ts to middleware.ts', description: 'Rename proxy.ts to middleware.ts in src/ directory to activate server-side route protections and handle /@username path rewrites.', category: 'Authentication', priority: 'CRITICAL', status: 'TODO' },
          { title: 'Add indexes to prisma/schema.prisma', description: 'Add indices to receiverId in Connection, and profileId in Tag, SocialLink, and HistoryEvent models to prevent full-table database scans.', category: 'Database', priority: 'HIGH', status: 'TODO' },
          { title: 'Uninstall jsonwebtoken library', description: 'The project currently includes jsonwebtoken but relies entirely on edge-compatible jose library. Run npm uninstall jsonwebtoken.', category: 'Architecture', priority: 'LOW', status: 'TODO' },
          { title: 'Implement DOM sanitization on profile inputs', description: 'Sanitize string inputs (e.g. name, bio) before saving to database to prevent potential XSS injection attacks.', category: 'Security', priority: 'HIGH', status: 'TODO' },
          { title: 'Migrate base64 images to S3 / Cloudinary', description: 'Currently profile photos are converted to base64 and written to database. Move media to an object storage provider.', category: 'Infrastructure', priority: 'LOW', status: 'BACKLOG' },
        ]
      });
      tasks = await prisma.controlTask.findMany({
        orderBy: { createdAt: 'desc' }
      });
    }

    return NextResponse.json({ success: true, tasks });
  } catch (error: any) {
    console.error('List tasks error:', error);
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
    const { id, title, description, category, priority, status } = body;

    if (id) {
      const task = await prisma.controlTask.update({
        where: { id: parseInt(id) },
        data: {
          title: title !== undefined ? title : undefined,
          description: description !== undefined ? description : undefined,
          category: category !== undefined ? category : undefined,
          priority: priority !== undefined ? priority : undefined,
          status: status !== undefined ? status : undefined,
        }
      });
      return NextResponse.json({ success: true, task });
    } else {
      if (!title) {
        return NextResponse.json({ error: 'Title is required.' }, { status: 400 });
      }

      const task = await prisma.controlTask.create({
        data: {
          title,
          description: description || null,
          category: category || 'General',
          priority: priority || 'MEDIUM',
          status: status || 'TODO'
        }
      });
      return NextResponse.json({ success: true, task });
    }
  } catch (error: any) {
    console.error('Save task error:', error);
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

    await prisma.controlTask.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ success: true, message: 'Task deleted successfully.' });
  } catch (error: any) {
    console.error('Delete task error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
