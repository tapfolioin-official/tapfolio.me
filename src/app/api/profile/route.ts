import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import prisma from '@/lib/db';
import { verifyJWT } from '@/lib/auth';
import { calculateProfileScore } from '@/lib/score';
import { submitToIndexNow } from '@/lib/indexnow';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userIdParam = searchParams.get('userId');
    const profileIdParam = searchParams.get('profileId');

    let profile;

    if (userIdParam) {
      profile = await prisma.profile.findUnique({
        where: { userId: parseInt(userIdParam) },
        include: {
          tags: true,
          socials: true,
          user: {
            select: {
              profileReady: true,
              sharingSettings: true,
              connectionCount: true,
              profileThemes: {
                orderBy: [{ isDefault: 'desc' }, { updatedAt: 'desc' }],
                take: 1
              }
            }
          }
        }
      });
    } else if (profileIdParam) {
      profile = await prisma.profile.findUnique({
        where: { id: parseInt(profileIdParam) },
        include: {
          tags: true,
          socials: true,
          user: {
            select: {
              email: true,
              profileReady: true,
              sharingSettings: true,
              connectionCount: true,
              profileThemes: {
                orderBy: [{ isDefault: 'desc' }, { updatedAt: 'desc' }],
                take: 1
              }
            }
          }
        }
      });
    } else {
      const cookieStore = await cookies();
      const token = cookieStore.get('pertap_jwt')?.value;
      if (!token) {
        return NextResponse.json({ error: 'Not authenticated and no userId/profileId provided.' }, { status: 400 });
      }
      const payload = await verifyJWT(token);
      if (!payload) {
        return NextResponse.json({ error: 'Invalid token.' }, { status: 401 });
      }
      profile = await prisma.profile.findUnique({
        where: { userId: payload.userId },
        include: {
          tags: true,
          socials: true,
          user: {
            select: {
              email: true,
              profileReady: true,
              sharingSettings: true,
              connectionCount: true,
              profileThemes: {
                orderBy: [{ isDefault: 'desc' }, { updatedAt: 'desc' }],
                take: 1
              }
            }
          }
        }
      });
    }

    if (!profile) {
      let userObj = null;
      if (userIdParam) {
        userObj = await prisma.user.findUnique({ where: { id: parseInt(userIdParam) } });
      } else {
        const cookieStore = await cookies();
        const token = cookieStore.get('pertap_jwt')?.value;
        if (token) {
          const payload = await verifyJWT(token);
          if (payload) {
            userObj = await prisma.user.findUnique({ where: { id: payload.userId } });
          }
        }
      }

      if (userObj) {
        console.warn(`[PROFILE] Profile record not found for user ${userObj.id}. Returning safe placeholder.`);
        return NextResponse.json({
          success: true,
          profile: {
            id: 0,
            userId: userObj.id,
            name: userObj.name,
            username: userObj.email.split('@')[0].toLowerCase().replace(/[^a-z0-9_-]/g, ''),
            tagline: "Let's connect!",
            avatar: '/profile_avatar.png',
            bio: "Initializing profile...",
            phone: null,
            whatsapp: null,
            location: null,
            resumeUrl: null,
            diamonds: '0',
            isPremium: false,
            tapCount: 0,
            tags: [],
            socials: [],
            theme: null,
            user: {
              email: userObj.email,
              profileReady: userObj.profileReady,
              sharingSettings: null
            }
          },
          score: 0,
          items: [],
          qualifiesForLeaderboard: false,
          connectionStatus: null,
          connectionId: null
        });
      }

      console.warn(`[PROFILE] Profile lookup failed: profile and user not found.`);
      return NextResponse.json({ error: 'Profile not found.' }, { status: 404 });
    }

    const scoreData = calculateProfileScore(profile);

    // Check connection status if caller is authenticated and we are querying someone else
    let connectionStatus: string | null = null;
    let connectionId: number | null = null;

    const cookieStore = await cookies();
    let token = cookieStore.get('pertap_jwt')?.value;
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
    if (!token) {
      token = request.headers.get('x-pertap-token') || undefined;
    }

    if (token) {
      const payload = await verifyJWT(token);
      if (payload && payload.userId !== profile.userId) {
        const conn = await prisma.connection.findFirst({
          where: {
            OR: [
              { requesterId: payload.userId, receiverId: profile.userId },
              { requesterId: profile.userId, receiverId: payload.userId },
            ],
          },
        });
        if (conn) {
          connectionStatus = conn.status;
          connectionId = conn.id;
        }
      }
    }

    return NextResponse.json({
      success: true,
      profile: {
        ...profile,
        theme: profile.user?.profileThemes?.[0]?.settings || null,
      },
      score: scoreData.score,
      items: scoreData.items,
      qualifiesForLeaderboard: scoreData.qualifiesForLeaderboard,
      connectionStatus,
      connectionId,
    });
  } catch (error: any) {
    console.error('Profile GET error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('pertap_jwt')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Not authenticated.' }, { status: 401 });
    }

    const payload = await verifyJWT(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token.' }, { status: 401 });
    }

    const {
  name,
  tagline,
  bio,
  avatar,
  isPremium,
  portfolioUrl,
  resumeUrl,
  tags,
  socials,
  phone,
  whatsapp,
  location,
  currentPassword,
  newPassword,
  confirmPassword
} = await request.json();

    const existingProfile = await prisma.profile.findUnique({
      where: { userId: payload.userId }
    });

    if (!existingProfile) {
      return NextResponse.json({ error: 'Profile not found.' }, { status: 404 });
    }

    // 🔐 Change password if requested
if (newPassword) {
  if (newPassword !== confirmPassword) {
    return NextResponse.json(
      { error: 'New passwords do not match.' },
      { status: 400 }
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      id: payload.userId,
    },
  });

  if (!user) {
    return NextResponse.json(
      { error: 'User not found.' },
      { status: 404 }
    );
  }

const passwordValid = await bcrypt.compare(
  currentPassword,
  user.passwordHash ?? ""
);

  if (!passwordValid) {
    return NextResponse.json(
      { error: 'Current password is incorrect.' },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

await prisma.user.update({
  where: {
    id: payload.userId,
  },
  data: {
    passwordHash: hashedPassword,
  },
});
}

const formatPhoneWithDefaultCountryCode = (val: any) => {
  if (val === null || val === undefined) return val;
  const str = String(val).trim();
  if (!str) return str;
  if (str.startsWith('+')) return str;
  const digitsOnly = str.replace(/\D/g, '');
  if (digitsOnly.length === 10) return `+91${digitsOnly}`;
  if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) return `+${digitsOnly}`;
  return str;
};

const formattedPhone = phone !== undefined ? formatPhoneWithDefaultCountryCode(phone) : undefined;
const formattedWhatsapp = whatsapp !== undefined ? formatPhoneWithDefaultCountryCode(whatsapp) : undefined;

    const finalProfile = await prisma.$transaction(async (tx) => {
      if (tags !== undefined) {
        await tx.tag.deleteMany({ where: { profileId: existingProfile.id } });
      }
      if (socials !== undefined) {
        await tx.socialLink.deleteMany({ where: { profileId: existingProfile.id } });
      }

      const updatedProfile = await tx.profile.update({
        where: { userId: payload.userId },
        data: {
          name: name !== undefined ? name : existingProfile.name,
          tagline: tagline !== undefined ? tagline : existingProfile.tagline,
          bio: bio !== undefined ? bio : existingProfile.bio,
          avatar: avatar !== undefined ? avatar : existingProfile.avatar,
          isPremium: isPremium !== undefined ? isPremium : existingProfile.isPremium,
          portfolioUrl: portfolioUrl !== undefined ? portfolioUrl : existingProfile.portfolioUrl,
          resumeUrl: resumeUrl !== undefined ? resumeUrl : existingProfile.resumeUrl,
          phone: formattedPhone !== undefined ? formattedPhone : existingProfile.phone,
          whatsapp: formattedWhatsapp !== undefined ? formattedWhatsapp : existingProfile.whatsapp,
          location: location !== undefined ? location : existingProfile.location,
          tags: tags ? {
            create: tags.map((t: any) => ({ text: t.text, type: t.type }))
          } : undefined,
          socials: socials ? {
            create: socials.map((s: any) => ({
              platform: s.platform,
              handle: s.handle,
              url: s.url,
              icon: s.icon,
              color: s.color
            }))
          } : undefined
        },
        include: {
          tags: true,
          socials: true,
          user: {
            select: {
              email: true,
              profileReady: true,
              sharingSettings: true,
              connectionCount: true
            }
          }
        }
      });

      const scoreData = calculateProfileScore(updatedProfile);

      return await tx.profile.update({
        where: { id: updatedProfile.id },
        data: {
          diamonds: String(scoreData.score)
        },
        include: {
          tags: true,
          socials: true,
          user: {
            select: {
              email: true,
              profileReady: true,
              sharingSettings: true,
              connectionCount: true
            }
          }
        }
      });
    }, {
      maxWait: 15000, // wait up to 15s to obtain a connection from the pool
      timeout: 30000  // give the serverless transaction up to 30s to fully execute
    });

    const scoreData = calculateProfileScore(finalProfile);

    // Trigger IndexNow submission in the background if the profile is active/online
    if (finalProfile.isOnline && finalProfile.user?.profileReady) {
      submitToIndexNow([`/portfolio/${finalProfile.username}`]).catch((err) => {
        console.error('[IndexNow] Background submission failed:', err);
      });
    }

    return NextResponse.json({
      success: true,
      profile: finalProfile,
      score: scoreData.score,
      items: scoreData.items,
      qualifiesForLeaderboard: scoreData.qualifiesForLeaderboard
    });
  } catch (error: any) {
    console.error('Profile PUT error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
