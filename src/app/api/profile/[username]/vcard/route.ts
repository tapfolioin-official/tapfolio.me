import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    if (!username) {
      return NextResponse.json({ error: 'Username is required.' }, { status: 400 });
    }

    const slug = username.toLowerCase().trim();
    const profile = await prisma.profile.findUnique({
      where: { username: slug },
      include: {
        tags: true,
        socials: true,
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found.' }, { status: 404 });
    }

    const roleText = profile.tags
      ?.filter((t: any) => t.type === 'role')
      .map((t: any) => t.text)
      .join(', ') || 'Creator';

    const locText = profile.location || profile.tags
      ?.find((t: any) => t.type === 'location')
      ?.text || '';

    const emailLink = profile.socials?.find((s: any) => s.platform.toLowerCase().includes('email'))?.url || '';
    const emailVal = profile.user?.email || emailLink.replace('mailto:', '');

    const phoneLink = profile.socials?.find((s: any) =>
      s.platform.toLowerCase().includes('phone') ||
      s.platform.toLowerCase().includes('whatsapp') ||
      s.platform.toLowerCase().includes('tel')
    )?.url || '';
    const phoneVal = profile.phone || phoneLink.replace('tel:', '').replace('https://wa.me/', '').split('?')[0];

    const urlObj = new URL(request.url);
    const origin = urlObj.origin;

    const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${profile.name}
TITLE:${roleText}
ADR;TYPE=WORK:;;;${locText};;;
EMAIL;TYPE=PREF,INTERNET:${emailVal}
TEL;TYPE=CELL:${phoneVal}
NOTE:Profile: ${origin}/${profile.username}
END:VCARD`;

    return new Response(vcard, {
      headers: {
        'Content-Type': 'text/x-vcard; charset=utf-8',
        'Content-Disposition': `attachment; filename="${profile.name.replace(/\s+/g, '_')}_contact.vcf"`,
        'Cache-Control': 'no-store, must-revalidate',
      },
    });
  } catch (error: any) {
    console.error('vCard generation error:', error);
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 });
  }
}
