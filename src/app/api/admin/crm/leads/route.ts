import { NextRequest, NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';
import { getAllLeads, createLead, updateLeadStatus, getCrmMetrics } from '@/lib/crm-service';

async function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get('pertap_jwt')?.value;
  if (!token) return null;
  const payload = await verifyJWT(token);
  if (!payload) return null;
  const isAdminEmail =
    payload.email === 'nibrasulhaqqamini@gmail.com' ||
    payload.email === 'tapfolio.in@gmail.com' ||
    (process.env.ADMIN_EMAIL && payload.email === process.env.ADMIN_EMAIL);
  if (!isAdminEmail) return null;
  return payload;
}

export async function GET(request: NextRequest) {
  const admin = await verifyAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  try {
    const url = new URL(request.url);
    const status = url.searchParams.get('status') || undefined;
    const source = url.searchParams.get('source') || undefined;
    const search = url.searchParams.get('search') || undefined;

    const [leads, metrics] = await Promise.all([
      getAllLeads({ status, source, search }),
      getCrmMetrics(),
    ]);

    return NextResponse.json({ success: true, leads, metrics });
  } catch (error) {
    console.error('Failed to get CRM leads:', error);
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const admin = await verifyAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  try {
    const body = await request.json();
    if (!body.name || !body.email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 });
    }

    const lead = await createLead({
      name: body.name,
      email: body.email,
      phone: body.phone,
      company: body.company,
      source: body.source || 'website',
      status: body.status || 'NEW_LEAD',
      value: Number(body.value) || 0,
      assignedTo: body.assignedTo || 'Unassigned',
      notes: body.notes || '',
      tags: body.tags || ['Inbound'],
    });

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error('Failed to create CRM lead:', error);
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const admin = await verifyAdmin(request);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  try {
    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'id and status are required' }, { status: 400 });
    }

    const updated = await updateLeadStatus(id, status);
    if (!updated) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, lead: updated });
  } catch (error) {
    console.error('Failed to update lead status:', error);
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}
