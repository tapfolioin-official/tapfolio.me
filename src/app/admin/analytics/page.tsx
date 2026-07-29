'use client';

import { useEffect, useState } from 'react';
import styles from '../dashboard/dashboard.module.css';

export default function AnalyticsPage() {
  const [kpis, setKpis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then((r) => r.json())
      .then((d) => { setKpis(d.kpis); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Analytics</h1>
          <p className={styles.pageSub}>Platform-wide metrics and insights</p>
        </div>
      </div>

      {/* KPIs */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>👥 Total Users</span>
          <span className={styles.kpiValue}>{loading ? '—' : kpis?.totalUsers.toLocaleString()}</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>📆 This Week</span>
          <span className={styles.kpiValue}>{loading ? '—' : `+${kpis?.weekUsers}`}</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>📅 This Month</span>
          <span className={styles.kpiValue}>{loading ? '—' : `+${kpis?.monthUsers}`}</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>📈 Growth</span>
          <span className={styles.kpiValue}>{loading ? '—' : `${kpis?.growth}%`}</span>
        </div>
      </div>

      {/* Panels */}
      <div className={styles.splitRow}>
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>🌍 Traffic Sources</span>
          </div>
          <div className={styles.panelBody}>
            {loading ? (
              <div style={{ padding: '1rem', color: '#64748B' }}>Loading...</div>
            ) : (
              (kpis?.trafficSources || []).map((s: any) => (
                <div key={s.source} className={styles.statRow}>
                  <span className={styles.statLabel}>{s.source}</span>
                  <span className={styles.statValue}>{s.pct}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>📱 Platform Distribution</span>
          </div>
          <div className={styles.panelBody}>
            {loading ? (
              <div style={{ padding: '1rem', color: '#64748B' }}>Loading...</div>
            ) : (
              (kpis?.platforms || []).map((p: any) => (
                <div key={p.platform} className={styles.statRow}>
                  <span className={styles.statLabel}>{p.platform}</span>
                  <span className={styles.statValue}>{p.pct}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className={styles.splitRow}>
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>🌐 Top Countries</span>
          </div>
          <div className={styles.panelBody}>
            {loading ? (
              <div style={{ padding: '1rem', color: '#64748B' }}>Loading...</div>
            ) : (
              (kpis?.countries || []).map((c: any) => (
                <div key={c.country} className={styles.statRow}>
                  <span className={styles.statLabel}>{c.country}</span>
                  <span className={styles.statValue}>{c.users}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>🔥 Top Features Used</span>
          </div>
          <div className={styles.panelBody}>
            {[
              { feature: 'Portfolio Views', count: '12,483' },
              { feature: 'Contact Saves', count: '3,287' },
              { feature: 'Social Link Clicks', count: '8,941' },
              { feature: 'Profile Shares', count: '2,156' },
              { feature: 'QR Scans', count: '1,847' },
              { feature: 'NFC Taps', count: '943' },
            ].map((f) => (
              <div key={f.feature} className={styles.statRow}>
                <span className={styles.statLabel}>{f.feature}</span>
                <span className={styles.statValue}>{f.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
