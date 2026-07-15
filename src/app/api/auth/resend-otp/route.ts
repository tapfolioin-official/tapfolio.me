import { NextResponse, after } from 'next/server';
import prisma from '@/lib/db';
import { generateOTP, hashOTP } from '@/lib/otp';
import { sendVerificationEmail } from '@/lib/email';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    if (!rateLimit(`resend-otp-ip:${ip}`, 10, 60000)) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const body = await request.json();
    const { email: rawEmail } = body;

    if (!rawEmail) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const email = rawEmail.toLowerCase().trim();

    // 1. Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'A user with this email address already exists.' }, { status: 400 });
    }

    // 2. Fetch the existing verification request
    const record = await prisma.emailVerification.findUnique({
      where: { email }
    });

    if (!record) {
      return NextResponse.json({ error: 'No verification request found. Please start sign up again.' }, { status: 400 });
    }

    // 3. Check Resend Interval (60 seconds)
    const timeSinceLastRequest = Date.now() - record.updatedAt.getTime();
    if (timeSinceLastRequest < 60 * 1000) {
      const secondsRemaining = Math.ceil((60 * 1000 - timeSinceLastRequest) / 1000);
      return NextResponse.json({
        error: `Please wait ${secondsRemaining} seconds before requesting another code.`
      }, { status: 429 });
    }

    // 4. Check Resend Limit (5 resends/hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const withinHour = record.updatedAt >= oneHourAgo;
    if (withinHour && record.requestCount >= 5) {
      return NextResponse.json({
        error: 'Too many code requests. Please try again in an hour.'
      }, { status: 429 });
    }

    // 5. Generate and hash new OTP
    const otp = generateOTP();
    const hashed = hashOTP(otp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // 6. Update database record
    await prisma.emailVerification.update({
      where: { email },
      data: {
        otpHash: hashed,
        expiresAt,
        attempts: 0,
        verified: false,
        requestCount: withinHour ? record.requestCount + 1 : 1
      }
    });

    console.log(`[OTP] Verification code resent for email=${email}`);

    // 7. Send the email in the background
    after(async () => {
      const emailSent = await sendVerificationEmail(email, otp);
      if (!emailSent) {
        console.error(`Background SMTP email delivery failed for ${email}`);
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Verification code resent successfully.'
    });
  } catch (error: any) {
    console.error('Resend OTP error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
