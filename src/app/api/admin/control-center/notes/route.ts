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

  if (!user || user.email !== process.env.ADMIN_EMAIL) {
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

    let notes = await prisma.devNote.findMany({
      orderBy: { createdAt: 'desc' }
    });

    if (notes.length === 0) {
      await prisma.devNote.create({
        data: {
          title: 'Initial Security & Architecture Audit Decisions',
          content: 'Audit completed on June 30, 2026. Primary targets selected for the current sprint include activating middleware protection and cleaning up unused jsonwebtoken dependencies. The team also determined to index the receiverId column in connection queries to keep analytics scaling fast.'
        }
      });
      notes = await prisma.devNote.findMany({
        orderBy: { createdAt: 'desc' }
      });
    }

    return NextResponse.json({ success: true, notes });
  } catch (error: any) {
    console.error('List notes error:', error);
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
    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required.' }, { status: 400 });
    }

    const note = await prisma.devNote.create({
      data: {
        title,
        content
      }
    });

    return NextResponse.json({ success: true, note });
  } catch (error: any) {
    console.error('Save note error:', error);
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

    await prisma.devNote.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ success: true, message: 'Note deleted successfully.' });
  } catch (error: any) {
    console.error('Delete note error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
