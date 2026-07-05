import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { verifyJWT } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('pertap_jwt')?.value;
    let name = '';
    let email = '';

    if (token) {
      const payload = await verifyJWT(token);
      if (payload) {
        const user = await prisma.user.findUnique({
          where: { id: payload.userId },
          select: { name: true, email: true }
        });
        if (user) {
          name = user.name || '';
          email = user.email || '';
        }
      }
    }

    const body = await request.json();
    const { subject, message, email: customEmail, name: customName } = body;

    const finalName = name || customName || 'Anonymous';
    const finalEmail = email || customEmail || 'anonymous@tapfolio.me';

    if (!message) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    }

    const ticket = await prisma.supportTicket.create({
      data: {
        name: finalName,
        email: finalEmail,
        subject: subject || 'Feedback/Complaint',
        message: message,
        status: 'OPEN',
      }
    });

    return NextResponse.json({ success: true, ticket });
  } catch (error: any) {
    console.error('Support ticket creation error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
