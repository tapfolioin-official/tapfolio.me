'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Smartphone,
  Download,
  Bell,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Send,
  Zap,
  TrendingUp,
} from 'lucide-react';
import styles from '../dashboard/dashboard.module.css';

export default function MobileAppManagementPage() {
  const [forceUpdate, setForceUpdate] = useState(false);
  const [notifTitle, setNotifTitle] = useState('');
  const [notifBody, setNotifBody] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setSendSuccess(false);

    try {
      const res = await fetch('/api/admin/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: notifTitle,
          body: notifBody,
          channel: 'PUSH',
          target: 'EVERYONE',
        }),
      });
      if (res.ok) {
        setSendSuccess(true);
        setNotifTitle('');
        setNotifBody('');
        setTimeout(() => setSendSuccess(false), 3000);
      }
    } catch (e) {
      console.error('Failed to broadcast push notification:', e);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Tapfolio Mobile App Control</h1>
          <p className={styles.subtitle}>
            Flutter Android & iOS release telemetry, force-update controls, and push notification management
          </p>
        </div>
        <div className={styles.headerRight}>
          <Link
            href="/admin/releases"
            className={styles.refreshBtn}
            style={{ textDecoration: 'none' }}
          >
            <Download size={15} />
            <span>Manage Release APKs</span>
          </Link>
        </div>
      </header>

      {/* Top Metrics Grid */}
      <div className={styles.topMetricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricIcon} style={{ background: '#edf3ff', color: '#0052ff' }}>
              <Smartphone size={19} />
            </div>
            <span className={styles.metricLabel}>Active Mobile Devices</span>
          </div>
          <div className={styles.metricBody}>
            <div>
              <div className={styles.metricValue}>14,280</div>
              <div className={styles.metricTrend}>
                <TrendingUp size={13} />
                <span>+24.1% vs last month</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricIcon} style={{ background: '#ecfdf5', color: '#059669' }}>
              <CheckCircle2 size={19} />
            </div>
            <span className={styles.metricLabel}>Platform Distribution</span>
          </div>
          <div className={styles.metricBody}>
            <div>
              <div className={styles.metricValue}>78% Android</div>
              <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '0.2rem' }}>
                22% iOS / iPadOS
              </div>
            </div>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricIcon} style={{ background: '#eff6ff', color: '#00a3ff' }}>
              <Download size={19} />
            </div>
            <span className={styles.metricLabel}>Current Production Build</span>
          </div>
          <div className={styles.metricBody}>
            <div>
              <div className={styles.metricValue}>v0.2.0 (Build 5)</div>
              <div style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700, marginTop: '0.2rem' }}>
                ● 94% on latest release
              </div>
            </div>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricIcon} style={{ background: '#fffbeb', color: '#d97706' }}>
              <Zap size={19} />
            </div>
            <span className={styles.metricLabel}>NFC Tap Frequency</span>
          </div>
          <div className={styles.metricBody}>
            <div>
              <div className={styles.metricValue}>4,120 / day</div>
              <div className={styles.metricTrend}>
                <TrendingUp size={13} />
                <span>+18.5% daily volume</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Push Dispatcher + Version Control */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
        {/* Mobile Push Notification Dispatcher */}
        <div className={styles.panelCard}>
          <div className={styles.panelHeader}>
            <div>
              <h2 className={styles.panelTitle}>Broadcast Mobile Push Notification</h2>
              <p className={styles.panelSub}>Send real-time alerts to registered Firebase Cloud Messaging tokens</p>
            </div>
          </div>

          <form onSubmit={handleSendNotification} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {sendSuccess && (
              <div style={{ padding: '0.75rem', borderRadius: 8, background: '#ecfdf5', color: '#059669', fontSize: '0.82rem', fontWeight: 700 }}>
                ✔ Push notification dispatched to mobile fleet!
              </div>
            )}

            <div>
              <label style={{ fontSize: '0.74rem', fontWeight: 750, color: '#475569', textTransform: 'uppercase' }}>
                Notification Title *
              </label>
              <input
                type="text"
                required
                value={notifTitle}
                onChange={(e) => setNotifTitle(e.target.value)}
                placeholder="e.g. New NFC Card Themes Available!"
                style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 8, border: '1px solid #e2e8f0', marginTop: '0.25rem', fontSize: '0.85rem' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.74rem', fontWeight: 750, color: '#475569', textTransform: 'uppercase' }}>
                Message Body *
              </label>
              <textarea
                required
                value={notifBody}
                onChange={(e) => setNotifBody(e.target.value)}
                placeholder="Explore the latest custom themes and analytics on your Tapfolio mobile app..."
                rows={3}
                style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 8, border: '1px solid #e2e8f0', marginTop: '0.25rem', fontSize: '0.85rem', fontFamily: 'inherit' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button
                type="submit"
                disabled={isSending}
                className={styles.refreshBtn}
              >
                <Send size={14} />
                <span>{isSending ? 'Transmitting...' : 'Dispatch Push Alert'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Remote Force-Update Controls */}
        <div className={styles.panelCard}>
          <div className={styles.panelHeader}>
            <div>
              <h2 className={styles.panelTitle}>Remote App Configuration</h2>
              <p className={styles.panelSub}>Client-side version gate enforcement</p>
            </div>
          </div>

          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e8eefa',
              borderRadius: 12,
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
                  Force Update Flag
                </div>
                <div style={{ fontSize: '0.76rem', color: '#64748b', marginTop: '0.15rem' }}>
                  Prompts users on v0.1.9 or earlier to update immediately
                </div>
              </div>
              <button
                type="button"
                onClick={() => setForceUpdate(!forceUpdate)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: 20,
                  border: forceUpdate ? '1px solid #059669' : '1px solid #cbd5e1',
                  background: forceUpdate ? '#ecfdf5' : '#ffffff',
                  color: forceUpdate ? '#059669' : '#64748b',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                {forceUpdate ? 'ACTIVE (ENFORCED)' : 'OPTIONAL'}
              </button>
            </div>

            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem', fontSize: '0.78rem', color: '#475569' }}>
              <div>• <strong>Minimum Allowed Build:</strong> 4</div>
              <div style={{ marginTop: '0.2rem' }}>• <strong>Target Production Build:</strong> 5</div>
              <div style={{ marginTop: '0.2rem' }}>• <strong>HMAC Signature Verification:</strong> Active</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
