import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { signJWT } from '@/lib/auth';
import { ensureUserSetup } from '@/lib/user-setup';
import { rateLimit } from '@/lib/rate-limit';
import * as jose from 'jose';

// Cache helper to convert Google profile picture to base64 Data URL
async function cacheImageAsBase64(imageUrl: string): Promise<string | null> {
  if (!imageUrl || imageUrl.startsWith('/') || imageUrl.startsWith('data:')) {
    return imageUrl;
  }
  try {
    const res = await fetch(imageUrl);
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = res.headers.get('content-type') || 'image/jpeg';
    return `data:${contentType};base64,${buffer.toString('base64')}`;
  } catch (err) {
    console.error('[AUTH] Failed to fetch Google avatar for caching:', err);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    if (!rateLimit(`google-auth:${ip}`, 15, 60000)) {
      return NextResponse.json({ error: 'Too many login attempts. Please try again later.' }, { status: 429 });
    }

    const body = await request.json();
    const { idToken, email: bodyEmail, name: bodyName } = body;

    let email = bodyEmail;
    let name = bodyName || 'Google User';
    let googleId = '';
    let profileImage = null;

    if (idToken && idToken.startsWith('mock_')) {
      email = idToken.replace('mock_', '') + '@gmail.com';
      googleId = 'mock_google_id_' + idToken.replace('mock_', '');
      profileImage = '/profile_avatar.png';
      console.log(`[AUTH] Google Sign-In Simulator (Mock Token): email=${email}, name=${name}`);
    } else if (idToken) {
      try {
        const JWKS = jose.createRemoteJWKSet(new URL('https://www.googleapis.com/oauth2/v3/certs'));
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        const webClientId = '533947683458-3tn9eggu70uob8pv4g1kj7kj4j3rjilk.apps.googleusercontent.com';
        const iosClientId = '533947683458-f16dl0kle0is987gqoqum4255pqerhta.apps.googleusercontent.com';
        
        // Allow verification using the environment client ID, explicit Web client ID, or explicit iOS client ID
        const allowedAudiences = clientId 
          ? [clientId, webClientId, iosClientId] 
          : [webClientId, iosClientId];

        const { payload } = await jose.jwtVerify(idToken, JWKS, {
          issuer: ['accounts.google.com', 'https://accounts.google.com'],
          audience: allowedAudiences,
        });

        if (payload.email_verified !== true) {
          console.warn(`[AUTH] Google authentication rejected: email not verified for token sub=${payload.sub}`);
          return NextResponse.json({ error: 'Google email address is not verified.' }, { status: 400 });
        }

        email = payload.email as string;
        name = (payload.name as string) || (payload.email as string)?.split('@')[0] || 'Google User';
        googleId = payload.sub as string;
        profileImage = payload.picture as string || null;
      } catch (err: any) {
        console.error('[AUTH] Google ID token verification failed:', err);
        return NextResponse.json({ error: 'Google ID token verification failed.' }, { status: 401 });
      }
    }

    if (!email) {
      console.warn(`[AUTH] Google authentication failed: email payload missing in token`);
      return NextResponse.json({ error: 'Invalid Google authentication payload.' }, { status: 400 });
    }

    email = email.toLowerCase().trim();

    // Cache the avatar image to prevent link expiration issues
    const cachedAvatar = await cacheImageAsBase64(profileImage || '');

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
        accounts: true,
      }
    });

    if (user) {
      // Account Linking Flow
      let googleAccount = user.accounts.find((acc: any) => acc.provider === 'GOOGLE');
      if (!googleAccount) {
        googleAccount = await prisma.account.create({
          data: {
            userId: user.id,
            provider: 'GOOGLE',
            providerId: googleId,
            profileImage: cachedAvatar,
          }
        });
        console.log(`[AUTH] Google Sign-In: Automatically linked Google account to existing user email=${email}, userId=${user.id}`);
      } else {
        console.log(`[AUTH] Google Sign-In: Authenticated existing linked Google account for email=${email}, userId=${user.id}`);
      }
    } else {
      // New Google User Signup Flow
      user = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash: null,
          accounts: {
            create: {
              provider: 'GOOGLE',
              providerId: googleId,
              profileImage: cachedAvatar,
            }
          }
        },
        include: {
          profile: true,
          accounts: true,
        }
      });
      console.log(`[AUTH] Google Sign-up: Created new user account with linked Google credentials: email=${email}, userId=${user.id}`);
    }

    // Set up the Profile and Sharing Settings records
    const profile = await ensureUserSetup(user.id, user.email, user.name, undefined, true);

    // Bind Google profile picture if profile uses default avatar
    if (cachedAvatar && (!profile.avatar || profile.avatar === '/profile_avatar.png')) {
      await prisma.profile.update({
        where: { id: profile.id },
        data: { avatar: cachedAvatar }
      });
    }

    // Fetch latest user status to read the latest profileReady value
    const latestUser = await prisma.user.findUnique({
      where: { id: user.id }
    });

    const profileReady = latestUser?.profileReady || false;
    console.log(`[AUTH] User session status: email=${email}, profileReady=${profileReady}`);

    const token = await signJWT({ userId: user.id, email: user.email });

    const response = NextResponse.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: profile.username,
        profileReady
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
    console.error('Google Auth Route Error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
