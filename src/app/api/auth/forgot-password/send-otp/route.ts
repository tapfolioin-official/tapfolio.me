import { NextResponse, after } from 'next/server';
import prisma from '@/lib/db';
import { generateOTP, hashOTP } from '@/lib/otp';
import { sendVerificationEmail } from '@/lib/email';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    // Basic IP rate limiting: 10 OTP send attempts per minute per IP
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    if (!rateLimit(`forgot-password-send-otp-ip:${ip}`, 10, 60000)) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const body = await request.json();
    const { email: rawEmail } = body;

    if (!rawEmail) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    const email = rawEmail.toLowerCase().trim();

    // 1. Check if user exists
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({ error: 'No account found with this email address.' }, { status: 404 });
    }

    // 2. Rate limiting checks on this specific email
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const existingRecord = await prisma.emailVerification.findUnique({
      where: { email }
    });

    if (existingRecord) {
      // Rule: Minimum 60 seconds between requests
      const timeSinceLastRequest = Date.now() - existingRecord.updatedAt.getTime();
      if (timeSinceLastRequest < 60 * 1000) {
        const secondsRemaining = Math.ceil((60 * 1000 - timeSinceLastRequest) / 1000);
        return NextResponse.json({
          error: `Please wait ${secondsRemaining} seconds before requesting another code.`
        }, { status: 429 });
      }

      // Rule: Maximum 5 resends per hour
      const withinHour = existingRecord.updatedAt >= oneHourAgo;
      if (withinHour && existingRecord.requestCount >= 5) {
        return NextResponse.json({
          error: 'Too many verification code requests. Please try again in an hour.'
        }, { status: 429 });
      }
    }

    // 3. Generate secure 6-digit OTP
    const otp = generateOTP();
    const hashed = hashOTP(otp);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // 4. Save/Update record in database
    if (existingRecord) {
      const isWithinHour = existingRecord.updatedAt >= oneHourAgo;
      await prisma.emailVerification.update({
        where: { email },
        data: {
          otpHash: hashed,
          expiresAt,
          attempts: 0,
          verified: false,
          requestCount: isWithinHour ? existingRecord.requestCount + 1 : 1
        }
      });
    } else {
      await prisma.emailVerification.create({
        data: {
          email,
          otpHash: hashed,
          expiresAt,
          attempts: 0,
          requestCount: 1,
          verified: false
        }
      });
    }

    // Log the request
    console.log(`[Forgot Password OTP] Verification code requested for email=${email}`);

    // 5. Send the email after response finishes
    after(async () => {
      const emailSent = await sendVerificationEmail(email, otp);
      if (!emailSent) {
        console.error(`Background SMTP forgot-password email delivery failed for ${email}`);
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Verification code sent successfully.'
    });
  } catch (error: any) {
    console.error('Send forgot password OTP error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
