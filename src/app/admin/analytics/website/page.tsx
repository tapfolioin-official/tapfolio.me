'use client';

import React from 'react';
import Link from 'next/link';
import {
  Globe,
  MousePointerClick,
  Users,
  Eye,
  TrendingUp,
  Clock,
  Laptop,
  Smartphone,
} from 'lucide-react';
import styles from '../../dashboard/dashboard.module.css';

export default function WebsiteAnalyticsPage() {
  const topSources = [
    { source: 'Direct / NFC Hardware Taps', visits: 48200, pct: '42.5%', conv: '18.4%' },
    { source: 'Google Organic Search', visits: 34100, pct: '30.1%', conv: '14.2%' },
    { source: 'LinkedIn Social Referral', visits: 18400, pct: '16.2%', conv: '22.8%' },
    { source: 'Instagram Link-in-Bio', visits: 8900, pct: '7.8%', conv: '11.5%' },
    { source: 'Direct QR Code Scans', visits: 3800, pct: '3.4%', conv: '26.1%' },
  ];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Website Traffic & Engagement Analytics</h1>
          <p className={styles.subtitle}>
            In-depth telemetry on web visitors, session duration, referral channels, and card configurator engagement
          </p>
        </div>
      </header>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Total Page Views (30D)</span>
          <span className={styles.kpiValue}>113,400</span>
          <div className={styles.kpiGrowth} style={{ color: '#059669' }}>
            <span>↑ 24.1% vs last month</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Unique Web Visitors</span>
          <span className={styles.kpiValue}>48,250</span>
          <div className={styles.kpiGrowth} style={{ color: '#0052ff' }}>
            <span>↑ 18.9% new visitors</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Average Session Duration</span>
          <span className={styles.kpiValue}>3m 42s</span>
          <div className={styles.kpiGrowth} style={{ color: '#059669' }}>
            <span>High engagement</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Bounce Rate</span>
          <span className={styles.kpiValue} style={{ color: '#059669' }}>28.4%</span>
          <div className={styles.kpiGrowth} style={{ color: '#059669' }}>
            <span>Low bounce profile</span>
          </div>
        </div>
      </div>

      {/* Referral Sources Table */}
      <div className={styles.tableCard}>
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Traffic Channel / Source</th>
                <th>Monthly Visits</th>
                <th>Share of Traffic</th>
                <th>Conversion Rate</th>
              </tr>
            </thead>
            <tbody>
              {topSources.map((s, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 800, color: '#0f172a' }}>{s.source}</td>
                  <td style={{ fontWeight: 800, color: '#0052ff' }}>
                    {s.visits.toLocaleString()}
                  </td>
                  <td style={{ fontSize: '0.82rem', color: '#64748b' }}>{s.pct}</td>
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
                      {s.conv}
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
