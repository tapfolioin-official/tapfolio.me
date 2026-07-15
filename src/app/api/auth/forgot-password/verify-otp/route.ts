import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { hashOTP } from '@/lib/otp';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    // Basic IP rate limiting: 20 verification attempts per minute per IP
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    if (!rateLimit(`forgot-password-verify-otp-ip:${ip}`, 20, 60000)) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const body = await request.json();
    const { email: rawEmail, otp } = body;

    if (!rawEmail || !otp) {
      return NextResponse.json({ error: 'Email and verification code are required.' }, { status: 400 });
    }

    const email = rawEmail.toLowerCase().trim();

    // 1. Retrieve the verification record
    const record = await prisma.emailVerification.findUnique({
      where: { email }
    });

    if (!record) {
      return NextResponse.json({ error: 'No verification request found for this email. Please request a code.' }, { status: 400 });
    }

    // 2. If already verified, succeed immediately
    if (record.verified) {
      return NextResponse.json({ success: true, message: 'Email verified successfully.' });
    }

    // 3. Rule: Check attempt limits
    if (record.attempts >= 5) {
      return NextResponse.json({
        error: 'Too many incorrect attempts. Verification blocked. Please request a new code.'
      }, { status: 429 });
    }

    // 4. Rule: Check expiration (10 minutes)
    if (new Date() > record.expiresAt) {
      return NextResponse.json({ error: 'Verification code has expired. Please request a new one.' }, { status: 400 });
    }

    // 5. Compare Hashed OTPs
    const inputHash = hashOTP(otp.trim());
    if (inputHash === record.otpHash) {
      // Success: Mark verified, reset attempts
      await prisma.emailVerification.update({
        where: { email },
        data: {
          verified: true,
          attempts: 0
        }
      });

      console.log(`[Forgot Password OTP] Email verified successfully: email=${email}`);

      return NextResponse.json({
        success: true,
        message: 'Email verified successfully.'
      });
    } else {
      // Failure: Increment attempts counter
      const newAttempts = record.attempts + 1;
      await prisma.emailVerification.update({
        where: { email },
        data: {
          attempts: newAttempts
        }
      });

      console.warn(`[Forgot Password OTP] Failed verification attempt (${newAttempts}/5) for email=${email}`);

      if (newAttempts >= 5) {
        return NextResponse.json({
          error: 'Too many incorrect attempts. Verification blocked. Please request a new code.'
        }, { status: 429 });
      }

      return NextResponse.json({
        error: `Invalid verification code. You have ${5 - newAttempts} attempts remaining.`
      }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Verify forgot password OTP error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
