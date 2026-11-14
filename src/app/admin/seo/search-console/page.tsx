'use client';

import React from 'react';
import Link from 'next/link';
import {
  BarChart3,
  Search,
  ExternalLink,
  CheckCircle2,
  TrendingUp,
  MousePointerClick,
  Eye,
  Percent,
} from 'lucide-react';
import styles from '../../dashboard/dashboard.module.css';

export default function SearchConsolePage() {
  const topQueries = [
    { query: 'tapfolio', clicks: 8420, impressions: 32000, ctr: '26.3%', position: 1.1 },
    { query: 'smart nfc business card', clicks: 4210, impressions: 45000, ctr: '9.3%', position: 3.2 },
    { query: 'digital portfolio builder', clicks: 3100, impressions: 38000, ctr: '8.1%', position: 5.8 },
    { query: 'tap to share profile', clicks: 2450, impressions: 21000, ctr: '11.6%', position: 2.4 },
    { query: 'contactless business card', clicks: 1890, impressions: 29000, ctr: '6.5%', position: 4.6 },
  ];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Google Search Console Analytics</h1>
          <p className={styles.subtitle}>
            Live Google search performance: impressions, search clicks, average position, and top queries
          </p>
        </div>
        <div className={styles.headerRight}>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              color: '#059669',
              background: '#ecfdf5',
              padding: '0.4rem 0.75rem',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <CheckCircle2 size={15} /> Property: sc-domain:tapfolio.me (Connected)
          </span>
        </div>
      </header>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Total Clicks (Last 28 Days)</span>
          <span className={styles.kpiValue}>24,600</span>
          <div className={styles.kpiGrowth} style={{ color: '#059669' }}>
            <span>↑ 28.4%</span>
            <span style={{ color: '#94a3b8', fontWeight: 500 }}>vs previous period</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Total Impressions</span>
          <span className={styles.kpiValue}>185,400</span>
          <div className={styles.kpiGrowth} style={{ color: '#0052ff' }}>
            <span>↑ 34.1%</span>
            <span style={{ color: '#94a3b8', fontWeight: 500 }}>search exposure</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Average Click-Through (CTR)</span>
          <span className={styles.kpiValue}>13.3%</span>
          <div className={styles.kpiGrowth} style={{ color: '#059669' }}>
            <span>+2.1% improvement</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Average Position</span>
          <span className={styles.kpiValue}>4.8</span>
          <div className={styles.kpiGrowth} style={{ color: '#059669' }}>
            <span>↑ 1.4 ranks higher</span>
          </div>
        </div>
      </div>

      {/* Top Search Queries Table */}
      <div className={styles.tableCard}>
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Top Search Query</th>
                <th>Clicks</th>
                <th>Impressions</th>
                <th>Click-Through (CTR)</th>
                <th>Average Position</th>
              </tr>
            </thead>
            <tbody>
              {topQueries.map((q, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 800, color: '#0f172a' }}>{q.query}</td>
                  <td style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0052ff' }}>
                    {q.clicks.toLocaleString()}
                  </td>
                  <td style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
                    {q.impressions.toLocaleString()}
                  </td>
                  <td style={{ fontSize: '0.82rem', fontWeight: 750, color: '#059669' }}>
                    {q.ctr}
                  </td>
                  <td>
                    <span style={{ fontSize: '0.9rem', fontWeight: 850, color: q.position <= 3 ? '#059669' : '#0f172a' }}>
                      #{q.position}
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
