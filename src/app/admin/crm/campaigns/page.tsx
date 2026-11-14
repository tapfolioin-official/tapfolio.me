'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Megaphone,
  Mail,
  Send,
  Users,
  MousePointerClick,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import styles from '../../dashboard/dashboard.module.css';

interface Campaign {
  id: string;
  name: string;
  channel: 'EMAIL' | 'PUSH' | 'SMS' | 'IN_APP';
  status: 'ACTIVE' | 'SCHEDULED' | 'COMPLETED' | 'DRAFT';
  targetAudience: string;
  recipientCount: number;
  openRate: string;
  clickRate: string;
  conversions: number;
  date: string;
}

const CAMPAIGNS_DATA: Campaign[] = [
  {
    id: 'camp-1',
    name: 'Q4 Executive Enterprise NFC Deployment Drive',
    channel: 'EMAIL',
    status: 'ACTIVE',
    targetAudience: 'Enterprise IT & HR Leaders',
    recipientCount: 4820,
    openRate: '42.1%',
    clickRate: '18.4%',
    conversions: 184,
    date: '2026-11-10',
  },
  {
    id: 'camp-2',
    name: 'Mobile App 2.4.0 Universal Deep Link Rollout',
    channel: 'PUSH',
    status: 'ACTIVE',
    targetAudience: 'iOS & Android Registered Users',
    recipientCount: 12400,
    openRate: '56.4%',
    clickRate: '27.9%',
    conversions: 890,
    date: '2026-11-13',
  },
  {
    id: 'camp-3',
    name: 'Black Friday 3D Engraved NFC Card Special Bundle',
    channel: 'EMAIL',
    status: 'SCHEDULED',
    targetAudience: 'Free Tier Creators & Portfolios',
    recipientCount: 18900,
    openRate: '—',
    clickRate: '—',
    conversions: 0,
    date: '2026-11-27',
  },
  {
    id: 'camp-4',
    name: 'Web Summit Contactless Lead Exchange Follow-up',
    channel: 'EMAIL',
    status: 'COMPLETED',
    targetAudience: 'Event Scans & Tap Recipients',
    recipientCount: 2450,
    openRate: '68.2%',
    clickRate: '34.1%',
    conversions: 342,
    date: '2026-11-05',
  },
];

export default function CrmCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(CAMPAIGNS_DATA);
  const [filter, setFilter] = useState('ALL');

  const filtered = campaigns.filter((c) => filter === 'ALL' || c.status === filter);

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Marketing & Outbound Campaigns</h1>
          <p className={styles.subtitle}>
            Deliver segmented email campaigns, mobile app push notifications, and NFC promo initiatives
          </p>
        </div>
        <div className={styles.headerRight}>
          <button
            type="button"
            onClick={() => alert('New campaign composer modal.')}
            className={styles.primaryBtn}
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <Plus size={16} /> Create Campaign
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Total Audience Reached</span>
          <span className={styles.kpiValue}>38,570</span>
          <div className={styles.kpiGrowth} style={{ color: '#059669' }}>
            <span>↑ 22.4%</span>
            <span style={{ color: '#94a3b8', fontWeight: 500 }}>subscribers</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Average Open Rate</span>
          <span className={styles.kpiValue}>55.6%</span>
          <div className={styles.kpiGrowth} style={{ color: '#0052ff' }}>
            <span>2.8x industry avg</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Average Click-Through</span>
          <span className={styles.kpiValue}>26.8%</span>
          <div className={styles.kpiGrowth} style={{ color: '#059669' }}>
            <span>high engagement</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Campaign Conversions</span>
          <span className={styles.kpiValue}>1,416</span>
          <div className={styles.kpiGrowth} style={{ color: '#059669' }}>
            <span>↑ $48.2K attributed</span>
          </div>
        </div>
      </div>

      {/* Filter Strip */}
      <div className={styles.panelCard} style={{ padding: '0.85rem 1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['ALL', 'ACTIVE', 'SCHEDULED', 'COMPLETED'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setFilter(st)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: 8,
                fontSize: '0.78rem',
                fontWeight: 750,
                border: filter === st ? '1px solid #0052ff' : '1px solid #e2e8f0',
                background: filter === st ? '#0052ff' : '#ffffff',
                color: filter === st ? '#ffffff' : '#475569',
                cursor: 'pointer',
              }}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Campaigns Table */}
      <div className={styles.tableCard}>
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Campaign Title</th>
                <th>Channel</th>
                <th>Target Segment</th>
                <th>Audience Size</th>
                <th>Open Rate</th>
                <th>Click Rate</th>
                <th>Conversions</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div style={{ fontWeight: 750, color: '#0f172a' }}>{c.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Scheduled on {c.date}</div>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '0.2rem 0.55rem',
                        borderRadius: 6,
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        background: c.channel === 'EMAIL' ? '#edf3ff' : '#f0fdf4',
                        color: c.channel === 'EMAIL' ? '#0052ff' : '#16a34a',
                      }}
                    >
                      {c.channel}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.82rem', color: '#334155' }}>{c.targetAudience}</td>
                  <td style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                    {c.recipientCount.toLocaleString()}
                  </td>
                  <td style={{ fontSize: '0.82rem', fontWeight: 700, color: '#059669' }}>
                    {c.openRate}
                  </td>
                  <td style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0052ff' }}>
                    {c.clickRate}
                  </td>
                  <td>
                    <span style={{ fontWeight: 800, color: '#0f172a' }}>
                      {c.conversions > 0 ? `${c.conversions} orders` : '—'}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '0.2rem 0.55rem',
                        borderRadius: 6,
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        background:
                          c.status === 'ACTIVE'
                            ? '#ecfdf5'
                            : c.status === 'SCHEDULED'
                            ? '#fef3c7'
                            : '#f1f5f9',
                        color:
                          c.status === 'ACTIVE'
                            ? '#059669'
                            : c.status === 'SCHEDULED'
                            ? '#b45309'
                            : '#64748b',
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
