import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/db';
import { signJWT } from '@/lib/auth';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    if (!rateLimit(`forgot-password-reset-ip:${ip}`, 5, 60000)) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const { email: rawEmail, password } = await request.json();

    if (!rawEmail || !password) {
      return NextResponse.json({ error: 'Email and new password are required.' }, { status: 400 });
    }

    const email = rawEmail.toLowerCase().trim();

    // 1. Verify email verification record is verified
    const verification = await prisma.emailVerification.findUnique({
      where: { email }
    });

    if (!verification || !verification.verified) {
      return NextResponse.json({ error: 'Email verification has not been completed. Please verify the code first.' }, { status: 400 });
    }

    // 2. Fetch the user
    const user = await prisma.user.findUnique({
      where: { email },
      include: { profile: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'No account found with this email address.' }, { status: 404 });
    }

    // 3. Hash password and update user record
    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash }
    });

    // 4. Delete the verification record to prevent reuse
    await prisma.emailVerification.delete({
      where: { email }
    }).catch(() => {});

    console.log(`[Forgot Password] Successfully reset password for email=${email}, userId=${user.id}`);

    // 5. Generate session JWT token
    const token = await signJWT({ userId: user.id, email: user.email });

    const response = NextResponse.json({
      success: true,
      message: 'Password reset successfully!',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.profile?.username || email.split('@')[0]
      }
    });

    response.cookies.set('pertap_jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    });

    return response;
  } catch (error: any) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
