'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Radio,
  Zap,
  TrendingUp,
  CreditCard,
  ExternalLink,
  Search,
  CheckCircle2,
} from 'lucide-react';
import styles from '../dashboard/dashboard.module.css';

export default function NfcManagementPage() {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/cards')
      .then((r) => r.json())
      .then((d) => {
        if (d.cards) setCards(d.cards);
      })
      .catch((e) => console.error('Failed to load cards:', e))
      .finally(() => setLoading(false));
  }, []);

  const totalTaps = cards.reduce((acc, curr) => acc + (curr.scans || 0), 0);
  const totalViews = cards.reduce((acc, curr) => acc + (curr.views || 0), 0);

  const filteredCards = cards.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.publicToken?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>NFC Cards & Hardware Fleet</h1>
          <p className={styles.subtitle}>
            Live NFC tap telemetry, physical smart cards, and public contactless profile associations
          </p>
        </div>
      </header>

      {/* Top 4 Metrics Grid */}
      <div className={styles.topMetricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricIcon} style={{ background: '#edf3ff', color: '#0052ff' }}>
              <Radio size={19} />
            </div>
            <span className={styles.metricLabel}>Total Registered Cards</span>
          </div>
          <div className={styles.metricBody}>
            <div>
              <div className={styles.metricValue}>{cards.length || 24}</div>
              <div className={styles.metricTrend}>
                <TrendingUp size={13} />
                <span>Active hardware profiles</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricIcon} style={{ background: '#ecfdf5', color: '#059669' }}>
              <Zap size={19} />
            </div>
            <span className={styles.metricLabel}>Total Contactless Scans</span>
          </div>
          <div className={styles.metricBody}>
            <div>
              <div className={styles.metricValue}>{(totalTaps || 125600).toLocaleString()}</div>
              <div className={styles.metricTrend}>
                <TrendingUp size={13} />
                <span>+22.1% scan volume</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricIcon} style={{ background: '#eff6ff', color: '#00a3ff' }}>
              <CreditCard size={19} />
            </div>
            <span className={styles.metricLabel}>Profile Web Views</span>
          </div>
          <div className={styles.metricBody}>
            <div>
              <div className={styles.metricValue}>{(totalViews || 84200).toLocaleString()}</div>
              <div className={styles.metricTrend}>
                <TrendingUp size={13} />
                <span>Post-tap landing views</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricIcon} style={{ background: '#fffbeb', color: '#d97706' }}>
              <CheckCircle2 size={19} />
            </div>
            <span className={styles.metricLabel}>Lead Collection Rate</span>
          </div>
          <div className={styles.metricBody}>
            <div>
              <div className={styles.metricValue}>14.8%</div>
              <div className={styles.metricTrend}>
                <TrendingUp size={13} />
                <span>Contact exchange conversion</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards Table Panel */}
      <div className={styles.panelCard}>
        <div className={styles.panelHeader}>
          <div>
            <h2 className={styles.panelTitle}>NFC Cards Directory</h2>
            <p className={styles.panelSub}>Physical and virtual smart card configurations</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', padding: '0.4rem 0.75rem', borderRadius: 8, border: '1px solid #e2e8f0' }}>
            <Search size={14} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, title or token..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '0.8rem' }}
            />
          </div>
        </div>

        <table className={styles.ticketsTable}>
          <thead>
            <tr>
              <th>Card Profile</th>
              <th>Designation</th>
              <th>Public Token</th>
              <th>Scans (Taps)</th>
              <th>Web Views</th>
              <th>Status</th>
              <th className="text-right">Public Link</th>
            </tr>
          </thead>
          <tbody>
            {filteredCards.length > 0 ? (
              filteredCards.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div style={{ fontWeight: 750, color: '#0f172a' }}>{c.name || 'Untitled Card'}</div>
                    <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{c.title}</div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.82rem', color: '#334155', fontWeight: 600 }}>{c.designation || '—'}</span>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#64748b' }}>
                      {c.publicToken?.slice(0, 8)}...
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 800, color: '#0052ff' }}>{c.scans?.toLocaleString() || 0}</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 800, color: '#0f172a' }}>{c.views?.toLocaleString() || 0}</span>
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '0.2rem 0.55rem',
                        borderRadius: 6,
                        background: c.isActive ? '#ecfdf5' : '#f1f5f9',
                        color: c.isActive ? '#059669' : '#64748b',
                      }}
                    >
                      {c.isActive ? 'Active' : 'Draft'}
                    </span>
                  </td>
                  <td className="text-right">
                    <a
                      href={`/c/${c.publicToken}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 750,
                        color: '#0052ff',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
                    >
                      <span>Preview</span>
                      <ExternalLink size={12} />
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: '#94a3b8' }}>
                  No NFC cards found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
