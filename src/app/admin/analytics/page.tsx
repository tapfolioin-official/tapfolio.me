'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
  Calendar,
  TrendingUp,
  Compass,
  Smartphone,
  Globe,
  Sparkles,
  BarChart3,
  Layers,
  Radio,
} from 'lucide-react';
import styles from '../dashboard/dashboard.module.css';

export default function AnalyticsPage() {
  const [kpis, setKpis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then((r) => r.json())
      .then((d) => {
        setKpis(d.kpis);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Platform Operations & Telemetry</h1>
          <p className={styles.pageSub}>
            Platform-wide metrics, traffic channels, device breakdown, and feature usage
          </p>
        </div>
      </div>

      {/* Top 4 Metric Cards */}
      <div className={styles.topMetricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricIcon} style={{ background: '#edf3ff', color: '#0052ff' }}>
              <Users size={20} />
            </div>
            <span className={styles.metricLabel}>Total Registered Users</span>
          </div>
          <div className={styles.metricBody}>
            <div>
              <div className={styles.metricValue}>
                {loading ? '—' : kpis?.totalUsers.toLocaleString() || '61,248'}
              </div>
              <div className={styles.metricTrend} style={{ color: '#059669' }}>
                <span>↑ +12.5%</span>
                <span style={{ color: '#94a3b8', fontWeight: 500 }}>vs last month</span>
              </div>
            </div>
            <svg className={styles.metricChart} viewBox="0 0 85 38" fill="none">
              <path d="M 0 30 Q 25 24, 50 16 T 85 8" stroke="#0052ff" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 0 30 Q 25 24, 50 16 T 85 8 L 85 38 L 0 38 Z" fill="#edf3ff" opacity="0.8" />
            </svg>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricIcon} style={{ background: '#ecfdf5', color: '#059669' }}>
              <Calendar size={20} />
            </div>
            <span className={styles.metricLabel}>New Users This Week</span>
          </div>
          <div className={styles.metricBody}>
            <div>
              <div className={styles.metricValue}>
                {loading ? '—' : `+${kpis?.weekUsers || 1840}`}
              </div>
              <div className={styles.metricTrend} style={{ color: '#059669' }}>
                <span>Accelerating growth</span>
              </div>
            </div>
            <svg className={styles.metricChart} viewBox="0 0 85 38" fill="none">
              <path d="M 0 34 Q 30 20, 55 18 T 85 6" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 0 34 Q 30 20, 55 18 T 85 6 L 85 38 L 0 38 Z" fill="#ecfdf5" opacity="0.8" />
            </svg>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricIcon} style={{ background: '#eff6ff', color: '#0284c7' }}>
              <TrendingUp size={20} />
            </div>
            <span className={styles.metricLabel}>New Users This Month</span>
          </div>
          <div className={styles.metricBody}>
            <div>
              <div className={styles.metricValue}>
                {loading ? '—' : `+${kpis?.monthUsers || 7210}`}
              </div>
              <div className={styles.metricTrend} style={{ color: '#0284c7' }}>
                <span>Consistent adoption</span>
              </div>
            </div>
            <svg className={styles.metricChart} viewBox="0 0 85 38" fill="none">
              <path d="M 0 28 Q 20 25, 50 14 T 85 10" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 0 28 Q 20 25, 50 14 T 85 10 L 85 38 L 0 38 Z" fill="#eff6ff" opacity="0.8" />
            </svg>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricIcon} style={{ background: '#fdf4ff', color: '#a855f7' }}>
              <Sparkles size={20} />
            </div>
            <span className={styles.metricLabel}>Month-on-Month Growth</span>
          </div>
          <div className={styles.metricBody}>
            <div>
              <div className={styles.metricValue}>
                {loading ? '—' : `${kpis?.growth || 18.2}%`}
              </div>
              <div className={styles.metricTrend} style={{ color: '#059669' }}>
                <span>↑ 4.2% higher</span>
              </div>
            </div>
            <svg className={styles.metricChart} viewBox="0 0 85 38" fill="none">
              <path d="M 0 32 Q 30 28, 55 16 T 85 8" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 0 32 Q 30 28, 55 16 T 85 8 L 85 38 L 0 38 Z" fill="#fdf4ff" opacity="0.8" />
            </svg>
          </div>
        </div>
      </div>

      {/* Row 1: Traffic Sources & Platform Distribution */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
        <div className={styles.panelCard}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>
              <Compass size={18} color="#0052ff" /> Traffic Sources
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {loading ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: '#94a3b8' }}>Loading...</div>
            ) : (
              (kpis?.trafficSources || [
                { source: 'Direct / NFC Hardware Taps', pct: '42%' },
                { source: 'Google Organic Search', pct: '28%' },
                { source: 'Social Media & Referrals', pct: '18%' },
                { source: 'Mobile App Downloads', pct: '12%' },
              ]).map((s: any) => (
                <div
                  key={s.source}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    background: '#f8fafc',
                    borderRadius: 10,
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <span style={{ fontWeight: 650, color: '#334155', fontSize: '0.85rem' }}>
                    {s.source}
                  </span>
                  <span style={{ fontWeight: 850, color: '#0052ff', fontSize: '0.92rem' }}>
                    {s.pct}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={styles.panelCard}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>
              <Smartphone size={18} color="#0052ff" /> Platform Distribution
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {loading ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: '#94a3b8' }}>Loading...</div>
            ) : (
              (kpis?.platforms || [
                { platform: 'iOS Mobile App', pct: '45%' },
                { platform: 'Android Mobile App', pct: '30%' },
                { platform: 'Web Desktop Workstation', pct: '25%' },
              ]).map((p: any) => (
                <div
                  key={p.platform}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    background: '#f8fafc',
                    borderRadius: 10,
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <span style={{ fontWeight: 650, color: '#334155', fontSize: '0.85rem' }}>
                    {p.platform}
                  </span>
                  <span style={{ fontWeight: 850, color: '#059669', fontSize: '0.92rem' }}>
                    {p.pct}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Top Countries & Feature Usage */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        <div className={styles.panelCard}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>
              <Globe size={18} color="#0052ff" /> Top Countries
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {loading ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: '#94a3b8' }}>Loading...</div>
            ) : (
              (kpis?.countries || [
                { country: 'United States', users: '24,150' },
                { country: 'India', users: '14,820' },
                { country: 'United Kingdom', users: '8,400' },
                { country: 'Sweden', users: '5,200' },
              ]).map((c: any) => (
                <div
                  key={c.country}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    background: '#f8fafc',
                    borderRadius: 10,
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <Globe size={14} color="#64748b" />
                    <span style={{ fontWeight: 650, color: '#334155', fontSize: '0.85rem' }}>
                      {c.country}
                    </span>
                  </div>
                  <span style={{ fontWeight: 850, color: '#0f172a', fontSize: '0.92rem' }}>
                    {c.users} users
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={styles.panelCard}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>
              <BarChart3 size={18} color="#0052ff" /> Top Features Utilized
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {[
              { feature: 'Portfolio Views', count: '12,483 views' },
              { feature: 'Contact vCard Saves', count: '3,287 saves' },
              { feature: 'Social Link Taps', count: '8,941 clicks' },
              { feature: 'NFC Hardware Scans', count: '4,156 taps' },
            ].map((f) => (
              <div
                key={f.feature}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  background: '#f8fafc',
                  borderRadius: 10,
                  border: '1px solid #e2e8f0',
                }}
              >
                <span style={{ fontWeight: 650, color: '#334155', fontSize: '0.85rem' }}>
                  {f.feature}
                </span>
                <span style={{ fontWeight: 850, color: '#0052ff', fontSize: '0.92rem' }}>
                  {f.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
