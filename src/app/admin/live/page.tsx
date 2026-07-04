'use client';

import { useEffect, useState } from 'react';
import styles from '../dashboard/dashboard.module.css';

interface LiveUser {
  id: string;
  name: string;
  country: string;
  city: string;
  page: string;
  device: string;
  browser: string;
  session: string;
}

interface LiveStats {
  onlineCount: number;
  countries: number;
  mobile: number;
  desktop: number;
}

export default function LiveUsersPage() {
  const [stats, setStats] = useState<LiveStats | null>(null);
  const [users, setUsers] = useState<LiveUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [timestamp, setTimestamp] = useState('');

  const fetchLiveData = async () => {
    try {
      const res = await fetch('/api/admin/live-users');
      if (res.ok) {
        const data = await res.json();
        setStats({
          onlineCount: data.onlineCount,
          countries: data.countries,
          mobile: data.mobile,
          desktop: data.desktop,
        });
        setUsers(data.users);
        setTimestamp(new Date().toLocaleTimeString());
      }
    } catch (e) {
      console.error('Failed to fetch live users', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveData();
    const interval = setInterval(fetchLiveData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Live Users</h1>
          <p className={styles.pageSub}>Real-time activity tracking · Updated {timestamp || '—'}</p>
        </div>
        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            color: '#22C55E',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#22C55E',
              display: 'inline-block',
              animation: 'pulse 2s infinite',
            }}
          />
          LIVE
        </span>
      </div>

      {/* Summary Cards */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>🟢 Online Now</span>
          <span className={styles.kpiValue}>
            {loading ? '—' : stats?.onlineCount ?? 0}
          </span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>🌍 Countries</span>
          <span className={styles.kpiValue}>
            {loading ? '—' : stats?.countries ?? 0}
          </span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>📱 Mobile</span>
          <span className={styles.kpiValue}>
            {loading ? '—' : stats?.mobile ?? 0}
          </span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>💻 Desktop</span>
          <span className={styles.kpiValue}>
            {loading ? '—' : stats?.desktop ?? 0}
          </span>
        </div>
      </div>

      {/* Live Users Table */}
      <div className={styles.panel}>
        <div className={styles.panelHeader}>
          <span className={styles.panelTitle}>
            👥 Active Sessions
            <span className={styles.panelBadge}>LIVE</span>
          </span>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                {['User', 'Country', 'City', 'Current Page', 'Device', 'Browser', 'Session'].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: 'left',
                      padding: '0.65rem 1rem',
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      color: '#94A3B8',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#94A3B8' }}>
                    Loading…
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: '#94A3B8' }}>
                    No active users at the moment
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                    <td style={{ padding: '0.65rem 1rem', fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>
                      {u.name}
                    </td>
                    <td style={{ padding: '0.65rem 1rem', fontSize: '0.85rem', color: '#334155' }}>{u.country}</td>
                    <td style={{ padding: '0.65rem 1rem', fontSize: '0.85rem', color: '#334155' }}>{u.city}</td>
                    <td style={{ padding: '0.65rem 1rem', fontSize: '0.8rem', fontWeight: 600, color: '#3B82F6' }}>
                      {u.page}
                    </td>
                    <td style={{ padding: '0.65rem 1rem', fontSize: '0.8rem', color: '#475569' }}>{u.device}</td>
                    <td style={{ padding: '0.65rem 1rem', fontSize: '0.8rem', color: '#475569' }}>{u.browser}</td>
                    <td style={{ padding: '0.65rem 1rem', fontSize: '0.8rem', fontWeight: 700, color: '#0F172A' }}>
                      {u.session}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}