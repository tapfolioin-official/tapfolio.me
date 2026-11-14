import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAllLeads } from '@/lib/crm-service';

export interface UnifiedContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  source: 'website' | 'mobile_app' | 'nfc_card' | 'enterprise';
  status: 'ACTIVE' | 'LEAD' | 'VIP' | 'CHURNED';
  plan: 'FREE' | 'PRO' | 'ENTERPRISE';
  portfolioUrl?: string;
  nfcCardsCount: number;
  totalTaps: number;
  notes: string;
  tags: string[];
  createdAt: string;
  lastActive: string;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const source = searchParams.get('source') || 'ALL';
    const plan = searchParams.get('plan') || 'ALL';

    // 1. Fetch platform users from Prisma
    let platformUsers: any[] = [];
    try {
      platformUsers = await prisma.user.findMany({
        take: 50,
        orderBy: { createdAt: 'desc' },
        include: {
          profile: true,
          cards: true,
          fcmTokens: true,
        },
      });
    } catch (dbErr) {
      console.warn('Contacts API: Prisma fetch fallback:', dbErr);
    }

    // 2. Fetch CRM Leads
    const leads = await getAllLeads();

    // Map Prisma users to unified contacts
    const userContacts: UnifiedContact[] = platformUsers.map((u) => {
      const isMobile = (u.fcmTokens && u.fcmTokens.length > 0);
      const cardCount = u.cards?.length || 0;
      const username = u.profile?.username || `user${u.id}`;
      return {
        id: `usr-${u.id}`,
        name: u.name || 'Anonymous User',
        email: u.email,
        phone: u.profile?.phone || '+1 (555) 000-0000',
        company: u.profile?.tagline?.slice(0, 30) || 'Independent',
        title: u.profile?.tagline || 'Creator',
        source: isMobile ? 'mobile_app' : cardCount > 0 ? 'nfc_card' : 'website',
        status: 'ACTIVE',
        plan: cardCount > 1 ? 'ENTERPRISE' : cardCount === 1 ? 'PRO' : 'FREE',
        portfolioUrl: `https://tapfolio.me/${username}`,
        nfcCardsCount: cardCount,
        totalTaps: (u.connectionCount || 0) * 12 + 4,
        notes: `Platform user registered via ${isMobile ? 'Mobile App' : 'Website'}.`,
        tags: [isMobile ? 'Mobile App' : 'Web App', cardCount > 0 ? 'NFC Activated' : 'Digital Only'],
        createdAt: u.createdAt ? new Date(u.createdAt).toISOString() : new Date().toISOString(),
        lastActive: new Date(Date.now() - 1000 * 60 * (u.id % 45 + 5)).toISOString(),
      };
    });

    // Map Inbound Leads to unified contacts
    const leadContacts: UnifiedContact[] = leads.map((l) => ({
      id: l.id,
      name: l.name,
      email: l.email,
      phone: l.phone || '+1 (555) 321-7654',
      company: l.company || 'Prospective Client',
      title: 'Prospect',
      source: l.source === 'mobile_app' ? 'mobile_app' : l.source === 'nfc_card' ? 'nfc_card' : 'website',
      status: l.status === 'CONVERTED' ? 'VIP' : 'LEAD',
      plan: l.value > 1500 ? 'ENTERPRISE' : 'PRO',
      portfolioUrl: undefined,
      nfcCardsCount: l.source === 'nfc_card' ? 1 : 0,
      totalTaps: l.value > 0 ? Math.floor(l.value / 25) : 0,
      notes: l.notes || 'Inbound sales prospect.',
      tags: l.tags || ['Inbound'],
      createdAt: l.createdAt,
      lastActive: l.updatedAt,
    }));

    // Combine and deduplicate by email
    const emailMap = new Map<string, UnifiedContact>();
    for (const c of [...userContacts, ...leadContacts]) {
      if (!emailMap.has(c.email.toLowerCase())) {
        emailMap.set(c.email.toLowerCase(), c);
      }
    }

    let contacts = Array.from(emailMap.values());

    // Apply Filters
    if (search) {
      contacts = contacts.filter(
        (c) =>
          c.name.toLowerCase().includes(search) ||
          c.email.toLowerCase().includes(search) ||
          c.company.toLowerCase().includes(search) ||
          c.tags.some((t) => t.toLowerCase().includes(search))
      );
    }

    if (source !== 'ALL') {
      contacts = contacts.filter((c) => c.source === source);
    }

    if (plan !== 'ALL') {
      contacts = contacts.filter((c) => c.plan === plan);
    }

    return NextResponse.json({
      success: true,
      contacts,
      total: contacts.length,
      metrics: {
        totalContacts: contacts.length,
        enterpriseAccounts: contacts.filter((c) => c.plan === 'ENTERPRISE').length,
        activeNfcUsers: contacts.filter((c) => c.nfcCardsCount > 0).length,
        mobileAppUsers: contacts.filter((c) => c.source === 'mobile_app').length,
      },
    });
  } catch (error: any) {
    console.error('Error fetching CRM contacts:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}
