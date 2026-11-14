'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Activity,
  Globe,
  Smartphone,
  Laptop,
  Users,
  Radio,
  ExternalLink,
  RefreshCw,
  Compass,
} from 'lucide-react';
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
  const [stats, setStats] = useState<LiveStats>({
    onlineCount: 6,
    countries: 5,
    mobile: 4,
    desktop: 2,
  });
  const [users, setUsers] = useState<LiveUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [timestamp, setTimestamp] = useState('');

  const fetchLiveData = async () => {
    try {
      const res = await fetch('/api/admin/live-users');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setStats({
            onlineCount: data.onlineCount,
            countries: data.countries,
            mobile: data.mobile,
            desktop: data.desktop,
          });
          setUsers(data.users || []);
          setTimestamp(new Date().toLocaleTimeString());
        }
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
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Live Activity Telemetry</h1>
          <p className={styles.pageSub}>
            Real-time visitor sessions across web portfolios & mobile app · Updated {timestamp || 'Just now'}
          </p>
        </div>

        <div className={styles.headerRight}>
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              color: '#059669',
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              padding: '0.4rem 0.85rem',
              borderRadius: 20,
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: '#10b981',
                display: 'inline-block',
                boxShadow: '0 0 0 3px rgba(16, 185, 129, 0.25)',
              }}
            />
            LIVE TELEMETRY STREAM
          </div>

          <button
            type="button"
            onClick={fetchLiveData}
            className={styles.refreshBtn}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* Top 4 Metric Cards (Matching reference design system) */}
      <div className={styles.topMetricsGrid}>
        {/* Card 1: Online Now */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricIcon} style={{ background: '#ecfdf5', color: '#059669' }}>
              <Activity size={20} />
            </div>
            <span className={styles.metricLabel}>Visitors Online Now</span>
          </div>
          <div className={styles.metricBody}>
            <div>
              <div className={styles.metricValue}>
                {loading && !stats.onlineCount ? '—' : stats.onlineCount}
              </div>
              <div className={styles.metricTrend} style={{ color: '#059669' }}>
                <span>↑ +25%</span>
                <span style={{ color: '#94a3b8', fontWeight: 500 }}>active concurrent</span>
              </div>
            </div>
            <svg className={styles.metricChart} viewBox="0 0 85 38" fill="none">
              <path
                d="M 0 32 Q 20 28, 40 18 T 85 8"
                stroke="#059669"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M 0 32 Q 20 28, 40 18 T 85 8 L 85 38 L 0 38 Z"
                fill="#ecfdf5"
                opacity="0.8"
              />
            </svg>
          </div>
        </div>

        {/* Card 2: Countries */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricIcon} style={{ background: '#edf3ff', color: '#0052ff' }}>
              <Globe size={20} />
            </div>
            <span className={styles.metricLabel}>Active Countries</span>
          </div>
          <div className={styles.metricBody}>
            <div>
              <div className={styles.metricValue}>
                {loading && !stats.countries ? '—' : stats.countries}
              </div>
              <div className={styles.metricTrend} style={{ color: '#0052ff' }}>
                <span>Global reach</span>
              </div>
            </div>
            <svg className={styles.metricChart} viewBox="0 0 85 38" fill="none">
              <path
                d="M 0 28 Q 25 32, 50 15 T 85 10"
                stroke="#0052ff"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M 0 28 Q 25 32, 50 15 T 85 10 L 85 38 L 0 38 Z"
                fill="#edf3ff"
                opacity="0.8"
              />
            </svg>
          </div>
        </div>

        {/* Card 3: Mobile Devices */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricIcon} style={{ background: '#eff6ff', color: '#0284c7' }}>
              <Smartphone size={20} />
            </div>
            <span className={styles.metricLabel}>Mobile Visitors</span>
          </div>
          <div className={styles.metricBody}>
            <div>
              <div className={styles.metricValue}>
                {loading && !stats.mobile ? '—' : stats.mobile}
              </div>
              <div className={styles.metricTrend} style={{ color: '#0284c7' }}>
                <span>67% of traffic</span>
              </div>
            </div>
            <svg className={styles.metricChart} viewBox="0 0 85 38" fill="none">
              <path
                d="M 0 34 Q 30 20, 55 24 T 85 12"
                stroke="#0284c7"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M 0 34 Q 30 20, 55 24 T 85 12 L 85 38 L 0 38 Z"
                fill="#eff6ff"
                opacity="0.8"
              />
            </svg>
          </div>
        </div>

        {/* Card 4: Desktop Devices */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricIcon} style={{ background: '#fdf4ff', color: '#a855f7' }}>
              <Laptop size={20} />
            </div>
            <span className={styles.metricLabel}>Desktop Visitors</span>
          </div>
          <div className={styles.metricBody}>
            <div>
              <div className={styles.metricValue}>
                {loading && !stats.desktop ? '—' : stats.desktop}
              </div>
              <div className={styles.metricTrend} style={{ color: '#a855f7' }}>
                <span>33% workstation</span>
              </div>
            </div>
            <svg className={styles.metricChart} viewBox="0 0 85 38" fill="none">
              <path
                d="M 0 30 Q 20 22, 45 28 T 85 14"
                stroke="#a855f7"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M 0 30 Q 20 22, 45 28 T 85 14 L 85 38 L 0 38 Z"
                fill="#fdf4ff"
                opacity="0.8"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Live Users Table */}
      <div className={styles.tableCard}>
        <div
          style={{
            padding: '1.25rem 1.4rem',
            borderBottom: '1px solid #e8eefa',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={18} color="#0052ff" /> Active Concurrent Sessions
            </h2>
            <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0.2rem 0 0 0' }}>
              Real-time route navigation, device specifications, geographic city, and active session duration
            </p>
          </div>
          <span
            style={{
              padding: '0.25rem 0.65rem',
              borderRadius: 6,
              fontSize: '0.72rem',
              fontWeight: 800,
              background: '#ecfdf5',
              color: '#059669',
            }}
          >
            {users.length} ACTIVE SESSIONS
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Active Visitor</th>
                <th>Country & City</th>
                <th>Current Route / Screen</th>
                <th>Device Hardware</th>
                <th>Web Browser</th>
                <th>Session Duration</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  {/* Visitor Name & Initial */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: '50%',
                          background: '#edf3ff',
                          color: '#0052ff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.8rem',
                          flexShrink: 0,
                        }}
                      >
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 750, color: '#0f172a' }}>{u.name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Session ID: {u.id}</div>
                      </div>
                    </div>
                  </td>

                  {/* Country & City */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Globe size={14} color="#64748b" />
                      <span style={{ fontWeight: 650, color: '#334155' }}>{u.country}</span>
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8', paddingLeft: '1.25rem' }}>
                      {u.city}
                    </div>
                  </td>

                  {/* Route */}
                  <td>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.25rem 0.65rem',
                        borderRadius: 6,
                        fontSize: '0.78rem',
                        fontWeight: 750,
                        background: '#edf3ff',
                        color: '#0052ff',
                      }}
                    >
                      <Compass size={13} /> {u.page}
                    </span>
                  </td>

                  {/* Device */}
                  <td>
                    <div style={{ fontSize: '0.82rem', fontWeight: 650, color: '#334155', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      {u.device.includes('iPhone') || u.device.includes('Galaxy') || u.device.includes('OnePlus') ? (
                        <Smartphone size={14} color="#0052ff" />
                      ) : (
                        <Laptop size={14} color="#64748b" />
                      )}
                      {u.device}
                    </div>
                  </td>

                  {/* Browser */}
                  <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{u.browser}</td>

                  {/* Session Duration */}
                  <td>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#059669' }}>
                      {u.session}
                    </span>
                  </td>

                  {/* Actions */}
                  <td style={{ textAlign: 'right' }}>
                    <a
                      href={u.page.startsWith('/') ? u.page : `/${u.page}`}
                      target="_blank"
                      rel="noreferrer"
                      className={styles.secondaryBtn}
                      style={{ padding: '0.3rem 0.65rem', fontSize: '0.74rem' }}
                    >
                      Inspect Route <ExternalLink size={12} />
                    </a>
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
