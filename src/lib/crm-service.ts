import prisma from '@/lib/db';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  source: 'website' | 'mobile_app' | 'nfc_card' | 'contact_form' | 'referral';
  status: 'NEW_LEAD' | 'CONTACTED' | 'INTERESTED' | 'QUALIFIED' | 'CONVERTED' | 'LOST';
  value: number;
  assignedTo: string;
  notes?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CrmTask {
  id: string;
  leadId?: string;
  leadName?: string;
  title: string;
  dueDate: string;
  assignedTo: string;
  status: 'PENDING' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: string;
}

// In-memory persistent fallback store if custom CRM tables are not yet migrated
let inMemoryLeads: Lead[] = [
  {
    id: 'lead-101',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@acmecorp.io',
    phone: '+1 (555) 234-8901',
    company: 'Acme Technologies',
    source: 'website',
    status: 'QUALIFIED',
    value: 1200,
    assignedTo: 'Nibrasul Haqq',
    notes: 'Interested in team NFC card deployment for 25 executives.',
    tags: ['Enterprise', 'NFC Hardware', 'Priority'],
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'lead-102',
    name: 'David Chen',
    email: 'david@venturepulse.com',
    phone: '+1 (555) 872-3411',
    company: 'Venture Pulse Capital',
    source: 'mobile_app',
    status: 'INTERESTED',
    value: 650,
    assignedTo: 'Support Desk',
    notes: 'Downloaded mobile app, scanned NFC badge at Web Summit.',
    tags: ['Mobile Lead', 'Fintech'],
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: 'lead-103',
    name: 'Elena Rostova',
    email: 'elena.rostova@nordicdesign.se',
    phone: '+46 8 123 4567',
    company: 'Nordic Design Studio',
    source: 'nfc_card',
    status: 'CONTACTED',
    value: 400,
    assignedTo: 'Nibrasul Haqq',
    notes: 'Inquired about custom card engraving and custom domain linking.',
    tags: ['Design', 'Custom Domain'],
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    id: 'lead-104',
    name: 'Marcus Brody',
    email: 'm.brody@apexlogistics.com',
    phone: '+1 (555) 901-2244',
    company: 'Apex Logistics Global',
    source: 'website',
    status: 'NEW_LEAD',
    value: 2500,
    assignedTo: 'Unassigned',
    notes: 'Submitted contact form requesting bulk pricing for 100+ cards.',
    tags: ['Bulk Order', 'Corporate'],
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
  {
    id: 'lead-105',
    name: 'Priya Sharma',
    email: 'priya.sharma@hyperloop.in',
    phone: '+91 98765 43210',
    company: 'Hyperloop Innovations',
    source: 'contact_form',
    status: 'CONVERTED',
    value: 1800,
    assignedTo: 'Nibrasul Haqq',
    notes: 'Successfully upgraded to Tapfolio Enterprise with 40 NFC cards.',
    tags: ['Customer', 'Enterprise'],
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
];

let inMemoryTasks: CrmTask[] = [
  {
    id: 'task-1',
    leadId: 'lead-101',
    leadName: 'Sarah Jenkins',
    title: 'Send enterprise volume discount proposal & spec sheet',
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    assignedTo: 'Nibrasul Haqq',
    status: 'PENDING',
    priority: 'HIGH',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    leadId: 'lead-102',
    leadName: 'David Chen',
    title: 'Follow up on mobile app NFC pairing walkthrough',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    assignedTo: 'Support Desk',
    status: 'PENDING',
    priority: 'MEDIUM',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    leadId: 'lead-104',
    leadName: 'Marcus Brody',
    title: 'Schedule introductory product discovery call',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    assignedTo: 'Nibrasul Haqq',
    status: 'PENDING',
    priority: 'HIGH',
    createdAt: new Date().toISOString(),
  },
];

export async function getCrmMetrics() {
  const totalLeads = inMemoryLeads.length;
  const newLeads = inMemoryLeads.filter((l) => l.status === 'NEW_LEAD').length;
  const qualifiedLeads = inMemoryLeads.filter((l) => l.status === 'QUALIFIED').length;
  const convertedLeads = inMemoryLeads.filter((l) => l.status === 'CONVERTED').length;
  const totalPipelineValue = inMemoryLeads.reduce((acc, curr) => acc + curr.value, 0);
  const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : '0';

  return {
    totalLeads,
    newLeads,
    qualifiedLeads,
    convertedLeads,
    totalPipelineValue,
    conversionRate: `${conversionRate}%`,
  };
}

export async function getAllLeads(filters?: { status?: string; source?: string; search?: string }) {
  let leads = [...inMemoryLeads];

  if (filters?.status && filters.status !== 'ALL') {
    leads = leads.filter((l) => l.status === filters.status);
  }

  if (filters?.source && filters.source !== 'ALL') {
    leads = leads.filter((l) => l.source === filters.source);
  }

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    leads = leads.filter(
      (l) =>
        l.name.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q) ||
        l.company?.toLowerCase().includes(q) ||
        l.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  return leads;
}

export async function createLead(data: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) {
  const newLead: Lead = {
    id: `lead-${Date.now()}`,
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  inMemoryLeads.unshift(newLead);
  return newLead;
}

export async function updateLeadStatus(id: string, status: Lead['status']) {
  const lead = inMemoryLeads.find((l) => l.id === id);
  if (!lead) return null;
  lead.status = status;
  lead.updatedAt = new Date().toISOString();
  return lead;
}

export async function getAllCrmTasks() {
  return inMemoryTasks;
}

export async function createCrmTask(task: Omit<CrmTask, 'id' | 'createdAt'>) {
  const newTask: CrmTask = {
    id: `task-${Date.now()}`,
    ...task,
    createdAt: new Date().toISOString(),
  };
  inMemoryTasks.unshift(newTask);
  return newTask;
}

export async function toggleCrmTaskStatus(id: string) {
  const task = inMemoryTasks.find((t) => t.id === id);
  if (!task) return null;
  task.status = task.status === 'PENDING' ? 'COMPLETED' : 'PENDING';
  return task;
}
