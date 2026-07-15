import crypto from 'crypto';

/**
 * Generates a crypto-secure 6-digit numeric OTP code.
 */
export function generateOTP(): string {
  let otp = '';
  const digits = '0123456789';
  for (let i = 0; i < 6; i++) {
    const randomIndex = crypto.randomInt(0, 10);
    otp += digits[randomIndex];
  }
  return otp;
}

/**
 * Computes the SHA-256 hash of the OTP for secure DB storage.
 */
export function hashOTP(otp: string): string {
  return crypto.createHash('sha256').update(otp).digest('hex');
}
