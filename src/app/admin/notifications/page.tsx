'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  Send,
  Smartphone,
  Globe,
  CheckCircle2,
  AlertCircle,
  Clock,
  Plus,
} from 'lucide-react';
import styles from '../dashboard/dashboard.module.css';

interface PushNotification {
  id: string;
  title: string;
  body: string;
  target: 'ALL' | 'IOS' | 'ANDROID' | 'WEB';
  sentAt: string;
  delivered: number;
  openRate: string;
}

const NOTIFICATIONS: PushNotification[] = [
  {
    id: 'notif-1',
    title: 'New Feature: Apple Wallet Pass Sync',
    body: 'You can now add your Tapfolio NFC profile directly to Apple Wallet for one-tap sharing without opening the app.',
    target: 'IOS',
    sentAt: '2026-11-14 18:30',
    delivered: 8420,
    openRate: '64.2%',
  },
  {
    id: 'notif-2',
    title: 'App Update: Version 2.4.0 Available',
    body: 'Improved NFC chip read responsiveness, new 4K portfolio accent themes, and instant vCard downloads.',
    target: 'ALL',
    sentAt: '2026-11-12 10:00',
    delivered: 18900,
    openRate: '52.8%',
  },
  {
    id: 'notif-3',
    title: 'Your Tapfolio Card reached 100 taps!',
    body: 'Congratulations! Your profile has been tapped by 100 professionals. View your analytics dashboard now.',
    target: 'ALL',
    sentAt: '2026-11-10 14:15',
    delivered: 340,
    openRate: '88.4%',
  },
];

export default function NotificationsPage() {
  const [list, setList] = useState<PushNotification[]>(NOTIFICATIONS);
  const [showSendModal, setShowSendModal] = useState(false);
  const [form, setForm] = useState({
    title: '',
    body: '',
    target: 'ALL' as 'ALL' | 'IOS' | 'ANDROID' | 'WEB',
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.body) return;

    const newN: PushNotification = {
      id: `notif-${Date.now()}`,
      title: form.title,
      body: form.body,
      target: form.target,
      sentAt: 'Just now',
      delivered: form.target === 'ALL' ? 18900 : 8420,
      openRate: '—',
    };

    setList([newN, ...list]);
    setShowSendModal(false);
    setForm({ title: '', body: '', target: 'ALL' });
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Push Notifications & System Alerts</h1>
          <p className={styles.subtitle}>
            Dispatch real-time FCM mobile push notifications, transaction triggers, and in-app banner announcements
          </p>
        </div>
        <div className={styles.headerRight}>
          <button
            type="button"
            onClick={() => setShowSendModal(true)}
            className={styles.primaryBtn}
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <Send size={15} /> Dispatch Push Alert
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Active FCM Tokens</span>
          <span className={styles.kpiValue}>18,920</span>
          <div className={styles.kpiGrowth} style={{ color: '#059669' }}>
            <span>↑ 99.2% reachable</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Delivery Success Rate</span>
          <span className={styles.kpiValue} style={{ color: '#059669' }}>99.8%</span>
          <div className={styles.kpiGrowth} style={{ color: '#059669' }}>
            <span>Google FCM & Apple APNs</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Average Open Rate</span>
          <span className={styles.kpiValue}>62.4%</span>
          <div className={styles.kpiGrowth} style={{ color: '#0052ff' }}>
            <span>High user engagement</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Dispatched This Month</span>
          <span className={styles.kpiValue}>14 Alerts</span>
          <div className={styles.kpiGrowth} style={{ color: '#059669' }}>
            <span>0 spam complaints</span>
          </div>
        </div>
      </div>

      {/* Notifications Table */}
      <div className={styles.tableCard}>
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Notification Title & Content</th>
                <th>Target Audience</th>
                <th>Delivered Devices</th>
                <th>Open Rate</th>
                <th>Dispatched At</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {list.map((n) => (
                <tr key={n.id}>
                  <td>
                    <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>{n.title}</div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.2rem', maxWidth: 450, lineHeight: 1.4 }}>
                      {n.body}
                    </div>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '0.2rem 0.55rem',
                        borderRadius: 6,
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        background: '#edf3ff',
                        color: '#0052ff',
                      }}
                    >
                      {n.target}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.85rem', fontWeight: 750, color: '#0f172a' }}>
                    {n.delivered.toLocaleString()} devices
                  </td>
                  <td style={{ fontSize: '0.85rem', fontWeight: 750, color: '#059669' }}>
                    {n.openRate}
                  </td>
                  <td style={{ fontSize: '0.78rem', color: '#64748b' }}>{n.sentAt}</td>
                  <td>
                    <span
                      style={{
                        padding: '0.2rem 0.55rem',
                        borderRadius: 6,
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        background: '#ecfdf5',
                        color: '#059669',
                      }}
                    >
                      DELIVERED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Send Modal */}
      {showSendModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
          onClick={() => setShowSendModal(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 16,
              width: '100%',
              maxWidth: 480,
              padding: '1.75rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 20px 40px rgba(0, 82, 255, 0.12)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '1.15rem', fontWeight: 850, margin: '0 0 1rem 0' }}>
              Broadcast Live Push Alert
            </h2>
            <form onSubmit={handleSend} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                  Notification Headline
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tapfolio v2.4.0 Live"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 8, border: '1px solid #e2e8f0', marginTop: '0.25rem', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                  Message Body
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Short, actionable message..."
                  value={form.body}
                  onChange={(e) => setForm({ ...form, body: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 8, border: '1px solid #e2e8f0', marginTop: '0.25rem', fontSize: '0.85rem', fontFamily: 'inherit' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                  Target Platform
                </label>
                <select
                  value={form.target}
                  onChange={(e) => setForm({ ...form, target: e.target.value as any })}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 8, border: '1px solid #e2e8f0', marginTop: '0.25rem', fontSize: '0.85rem', background: '#fff' }}
                >
                  <option value="ALL">All Platforms (iOS, Android, Web)</option>
                  <option value="IOS">Apple iOS Only</option>
                  <option value="ANDROID">Google Android Only</option>
                  <option value="WEB">Web App Only</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowSendModal(false)}
                  className={styles.secondaryBtn}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.primaryBtn}>
                  Send Push Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
