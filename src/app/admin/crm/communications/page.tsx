'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  History,
  Mail,
  Phone,
  MessageSquare,
  Smartphone,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  User,
  ArrowRight,
} from 'lucide-react';
import styles from '../../dashboard/dashboard.module.css';

interface CommEvent {
  id: string;
  contactName: string;
  contactEmail: string;
  type: 'EMAIL' | 'CALL' | 'CHAT' | 'PUSH';
  subject: string;
  summary: string;
  agent: string;
  timestamp: string;
  status: 'SENT' | 'DELIVERED' | 'REPLIED' | 'MISSED';
}

const LOGS: CommEvent[] = [
  {
    id: 'comm-1',
    contactName: 'Sarah Jenkins',
    contactEmail: 'sarah.jenkins@acmecorp.io',
    type: 'EMAIL',
    subject: 'Enterprise Proposal — 45 Tapfolio Smart NFC Cards & Team Admin',
    summary: 'Sent detailed tier pricing and mockups of custom-branded metal cards with NFC chip spec sheet.',
    agent: 'Nibrasul Haqq',
    timestamp: '25 minutes ago',
    status: 'REPLIED',
  },
  {
    id: 'comm-2',
    contactName: 'David Chen',
    contactEmail: 'david@venturepulse.com',
    type: 'CALL',
    subject: 'Product Demo & Mobile App Walkthrough',
    summary: 'Completed 20-minute Google Meet call demoing dynamic link switching and instant contact saving.',
    agent: 'Support Desk',
    timestamp: '2 hours ago',
    status: 'DELIVERED',
  },
  {
    id: 'comm-3',
    contactName: 'Marcus Brody',
    contactEmail: 'm.brody@apexlogistics.com',
    type: 'EMAIL',
    subject: 'Inquiry response: Bulk volume packaging for 85 drivers',
    summary: 'Answered inquiry regarding NFC durability, water resistance, and offline vCard export capability.',
    agent: 'Nibrasul Haqq',
    timestamp: '4 hours ago',
    status: 'DELIVERED',
  },
  {
    id: 'comm-4',
    contactName: 'Elena Rostova',
    contactEmail: 'elena.rostova@nordicdesign.se',
    type: 'CHAT',
    subject: 'Custom Domain SSL setup for portfolio',
    summary: 'Assisted Elena with configuring CNAME records on Cloudflare to point her custom domain to Tapfolio.',
    agent: 'Support Desk',
    timestamp: '1 day ago',
    status: 'REPLIED',
  },
  {
    id: 'comm-5',
    contactName: 'Priya Sharma',
    contactEmail: 'priya.sharma@hyperloop.in',
    type: 'PUSH',
    subject: 'Hardware Shipped: Tracking #TPF-98214',
    summary: 'Automated push alert triggered upon dispatch of 30 NFC cards via DHL Express.',
    agent: 'System Automation',
    timestamp: '2 days ago',
    status: 'DELIVERED',
  },
];

export default function CommunicationHistoryPage() {
  const [events, setEvents] = useState<CommEvent[]>(LOGS);
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const filtered = events.filter((e) => {
    const matchesType = typeFilter === 'ALL' || e.type === typeFilter;
    const matchesSearch =
      e.contactName.toLowerCase().includes(search.toLowerCase()) ||
      e.subject.toLowerCase().includes(search.toLowerCase()) ||
      e.summary.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Omnichannel Communication History</h1>
          <p className={styles.subtitle}>
            Audit log of all outbound emails, follow-up calls, support chats, and automated push notifications
          </p>
        </div>
      </header>

      {/* Filter Strip */}
      <div className={styles.panelCard} style={{ padding: '0.85rem 1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: 340 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: 11, color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search contact, subject, or message text..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.85rem 0.55rem 2.3rem',
                borderRadius: 10,
                border: '1px solid #e2e8f0',
                fontSize: '0.85rem',
              }}
            />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['ALL', 'EMAIL', 'CALL', 'CHAT', 'PUSH'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTypeFilter(t)}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: 8,
                  fontSize: '0.78rem',
                  fontWeight: 750,
                  border: typeFilter === t ? '1px solid #0052ff' : '1px solid #e2e8f0',
                  background: typeFilter === t ? '#0052ff' : '#ffffff',
                  color: typeFilter === t ? '#ffffff' : '#475569',
                  cursor: 'pointer',
                }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Communications Feed */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {filtered.map((item) => (
          <div
            key={item.id}
            className={styles.panelCard}
            style={{
              padding: '1.25rem',
              display: 'flex',
              gap: '1.25rem',
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background:
                  item.type === 'EMAIL'
                    ? '#edf3ff'
                    : item.type === 'CALL'
                    ? '#ecfdf5'
                    : item.type === 'CHAT'
                    ? '#fdf4ff'
                    : '#fef3c7',
                color:
                  item.type === 'EMAIL'
                    ? '#0052ff'
                    : item.type === 'CALL'
                    ? '#059669'
                    : item.type === 'CHAT'
                    ? '#a855f7'
                    : '#b45309',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {item.type === 'EMAIL' ? (
                <Mail size={20} />
              ) : item.type === 'CALL' ? (
                <Phone size={20} />
              ) : item.type === 'CHAT' ? (
                <MessageSquare size={20} />
              ) : (
                <Smartphone size={20} />
              )}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.92rem' }}>
                    {item.contactName}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>({item.contactEmail})</span>
                  <span
                    style={{
                      padding: '0.15rem 0.5rem',
                      borderRadius: 4,
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      background: '#f1f5f9',
                      color: '#475569',
                    }}
                  >
                    {item.type}
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>
                  {item.timestamp}
                </span>
              </div>

              <div style={{ fontWeight: 700, color: '#1e293b', fontSize: '0.85rem', marginTop: '0.35rem' }}>
                {item.subject}
              </div>

              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.3rem', lineHeight: 1.5 }}>
                {item.summary}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.65rem' }}>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                  Handled by: <strong style={{ color: '#334155' }}>{item.agent}</strong>
                </span>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 750,
                    color: item.status === 'REPLIED' ? '#059669' : '#0052ff',
                  }}
                >
                  ● {item.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
