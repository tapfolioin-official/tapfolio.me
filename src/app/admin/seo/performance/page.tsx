'use client';

import React from 'react';
import Link from 'next/link';
import {
  Gauge,
  Zap,
  Activity,
  CheckCircle2,
  Smartphone,
  Laptop,
} from 'lucide-react';
import styles from '../../dashboard/dashboard.module.css';

export default function PerformanceMonitoringPage() {
  const vitals = [
    { metric: 'Largest Contentful Paint (LCP)', value: '1.4 s', target: '< 2.5 s', status: 'GOOD', score: 98 },
    { metric: 'Interaction to Next Paint (INP)', value: '82 ms', target: '< 200 ms', status: 'GOOD', score: 95 },
    { metric: 'Cumulative Layout Shift (CLS)', value: '0.02', target: '< 0.1', status: 'GOOD', score: 99 },
    { metric: 'First Contentful Paint (FCP)', value: '0.9 s', target: '< 1.8 s', status: 'GOOD', score: 96 },
    { metric: 'Time to First Byte (TTFB)', value: '180 ms', target: '< 800 ms', status: 'GOOD', score: 94 },
  ];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Core Web Vitals & Speed Monitoring</h1>
          <p className={styles.subtitle}>
            Field data and Lighthouse synthetic benchmarks measuring mobile & desktop load responsiveness
          </p>
        </div>
      </header>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Mobile Performance</span>
          <span className={styles.kpiValue} style={{ color: '#059669' }}>94 / 100</span>
          <div className={styles.kpiGrowth} style={{ color: '#059669' }}>
            <span>Fast mobile experience</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Desktop Performance</span>
          <span className={styles.kpiValue} style={{ color: '#059669' }}>99 / 100</span>
          <div className={styles.kpiGrowth} style={{ color: '#059669' }}>
            <span>Near-perfect score</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Global CDN Cache Hit</span>
          <span className={styles.kpiValue}>96.4%</span>
          <div className={styles.kpiGrowth} style={{ color: '#0052ff' }}>
            <span>Vercel Edge Network</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Avg Server Response</span>
          <span className={styles.kpiValue}>180 ms</span>
          <div className={styles.kpiGrowth} style={{ color: '#059669' }}>
            <span>Ultra low latency</span>
          </div>
        </div>
      </div>

      {/* Web Vitals Table */}
      <div className={styles.tableCard}>
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Core Web Vital Metric</th>
                <th>Observed 75th Percentile</th>
                <th>Google Recommended Target</th>
                <th>Assessment Status</th>
                <th>Performance Score</th>
              </tr>
            </thead>
            <tbody>
              {vitals.map((v, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 800, color: '#0f172a' }}>{v.metric}</td>
                  <td style={{ fontSize: '0.95rem', fontWeight: 850, color: '#0052ff' }}>
                    {v.value}
                  </td>
                  <td style={{ fontSize: '0.82rem', color: '#64748b' }}>{v.target}</td>
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
                      {v.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: 60, height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${v.score}%`, height: '100%', background: '#059669' }} />
                      </div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#059669' }}>{v.score}/100</span>
                    </div>
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
