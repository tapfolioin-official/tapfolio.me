import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { deriveHandshakeKey } from '@/lib/security';

export async function GET() {
  const handshakeToken = `hs_${Date.now()}_${crypto.randomBytes(16).toString('hex')}`;
  const transactionKey = deriveHandshakeKey(handshakeToken);

  return NextResponse.json({
    success: true,
    handshakeToken,
    transactionKey,
    expiresIn: 86400, // 24 hours
  });
}

