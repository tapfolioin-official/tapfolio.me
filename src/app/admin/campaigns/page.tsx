'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  Send,
  Users,
  Plus,
  Search,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import styles from '../dashboard/dashboard.module.css';

interface EmailCampaign {
  id: string;
  subject: string;
  audience: string;
  sentDate: string;
  recipients: number;
  openRate: string;
  clickRate: string;
  status: 'SENT' | 'SCHEDULED' | 'DRAFT';
}

const EMAIL_CAMPAIGNS: EmailCampaign[] = [
  {
    id: 'em-1',
    subject: 'Welcome to Tapfolio — Setup your 4K Digital Portfolio in 60s',
    audience: 'New Registrations (Automated Drip)',
    sentDate: 'Ongoing Trigger',
    recipients: 12450,
    openRate: '72.4%',
    clickRate: '38.1%',
    status: 'SENT',
  },
  {
    id: 'em-2',
    subject: 'Introducing Apple Wallet Pass & Dynamic Contact Sharing',
    audience: 'All Active Cardholders',
    sentDate: '2026-11-12',
    recipients: 18900,
    openRate: '58.2%',
    clickRate: '24.5%',
    status: 'SENT',
  },
  {
    id: 'em-3',
    subject: 'Black Friday VIP Access: 50% Off Custom Laser Engraved Metal Cards',
    audience: 'Free Tier Creators',
    sentDate: '2026-11-26 (Scheduled)',
    recipients: 24500,
    openRate: '—',
    clickRate: '—',
    status: 'SCHEDULED',
  },
];

export default function EmailCampaignsPage() {
  const [campaigns, setCampaigns] = useState<EmailCampaign[]>(EMAIL_CAMPAIGNS);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Email Campaigns & Newsletter Dispatch</h1>
          <p className={styles.subtitle}>
            Compose transactional email drip campaigns, monthly product updates, and personalized customer offers
          </p>
        </div>
        <div className={styles.headerRight}>
          <button
            type="button"
            onClick={() => alert('Email campaign builder active.')}
            className={styles.primaryBtn}
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <Plus size={15} /> Compose Email Blast
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Subscribed Email Contacts</span>
          <span className={styles.kpiValue}>61,248</span>
          <div className={styles.kpiGrowth} style={{ color: '#059669' }}>
            <span>↑ 99.4% deliverability</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Average Open Rate</span>
          <span className={styles.kpiValue}>65.3%</span>
          <div className={styles.kpiGrowth} style={{ color: '#0052ff' }}>
            <span>Resend & SendGrid connected</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Average Click Rate</span>
          <span className={styles.kpiValue}>31.3%</span>
          <div className={styles.kpiGrowth} style={{ color: '#059669' }}>
            <span>High engagement</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Spam / Unsubscribe Rate</span>
          <span className={styles.kpiValue} style={{ color: '#059669' }}>0.04%</span>
          <div className={styles.kpiGrowth} style={{ color: '#059669' }}>
            <span>Healthy sender reputation</span>
          </div>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className={styles.tableCard}>
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Email Subject Line</th>
                <th>Target Audience Segment</th>
                <th>Recipients</th>
                <th>Open Rate</th>
                <th>Click-Through</th>
                <th>Send Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>{c.subject}</div>
                  </td>
                  <td style={{ fontSize: '0.82rem', color: '#64748b' }}>{c.audience}</td>
                  <td style={{ fontSize: '0.85rem', fontWeight: 750, color: '#0052ff' }}>
                    {c.recipients.toLocaleString()}
                  </td>
                  <td style={{ fontSize: '0.82rem', fontWeight: 750, color: '#059669' }}>
                    {c.openRate}
                  </td>
                  <td style={{ fontSize: '0.82rem', fontWeight: 750, color: '#0052ff' }}>
                    {c.clickRate}
                  </td>
                  <td style={{ fontSize: '0.78rem', color: '#64748b' }}>{c.sentDate}</td>
                  <td>
                    <span
                      style={{
                        padding: '0.2rem 0.55rem',
                        borderRadius: 6,
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        background: c.status === 'SENT' ? '#ecfdf5' : '#fef3c7',
                        color: c.status === 'SENT' ? '#059669' : '#b45309',
                      }}
                    >
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
