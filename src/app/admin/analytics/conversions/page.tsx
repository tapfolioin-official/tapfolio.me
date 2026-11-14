'use client';

import React from 'react';
import Link from 'next/link';
import {
  Percent,
  TrendingUp,
  Filter,
  CheckCircle2,
  ArrowRight,
  Layers,
  Sparkles,
} from 'lucide-react';
import styles from '../../dashboard/dashboard.module.css';

export default function ConversionAnalyticsPage() {
  const funnelSteps = [
    { step: '1. Landing Page Visit', visitors: 113400, conv: '100%', drop: '0%' },
    { step: '2. 3D Card Configurator Interaction', visitors: 58200, conv: '51.3%', drop: '-48.7%' },
    { step: '3. Free Portfolio Account Registration', visitors: 28400, conv: '25.0%', drop: '-26.3%' },
    { step: '4. Physical NFC Card Checkout', visitors: 14200, conv: '12.5%', drop: '-12.5%' },
    { step: '5. Tapfolio Pro / Enterprise Subscription', visitors: 7842, conv: '6.9%', drop: '-5.6%' },
  ];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Conversion Funnel & LTV Analytics</h1>
          <p className={styles.subtitle}>
            End-to-end customer journey tracking from visitor acquisition to physical NFC hardware checkout & SaaS renewals
          </p>
        </div>
      </header>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Overall Conversion Rate</span>
          <span className={styles.kpiValue} style={{ color: '#059669' }}>6.9%</span>
          <div className={styles.kpiGrowth} style={{ color: '#059669' }}>
            <span>Visitor to paid customer</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Configurator to Signup</span>
          <span className={styles.kpiValue}>48.8%</span>
          <div className={styles.kpiGrowth} style={{ color: '#0052ff' }}>
            <span>Interactive 3D preview drive</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Hardware to Pro Upsell</span>
          <span className={styles.kpiValue}>55.2%</span>
          <div className={styles.kpiGrowth} style={{ color: '#059669' }}>
            <span>NFC card owners upgrade</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Customer Lifetime Value</span>
          <span className={styles.kpiValue}>$184</span>
          <div className={styles.kpiGrowth} style={{ color: '#059669' }}>
            <span>↑ $28 vs last year</span>
          </div>
        </div>
      </div>

      {/* Funnel Table */}
      <div className={styles.tableCard}>
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Funnel Stage</th>
                <th>Users Completed</th>
                <th>Cumulative Conversion</th>
                <th>Stage Drop-off</th>
              </tr>
            </thead>
            <tbody>
              {funnelSteps.map((f, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 800, color: '#0f172a' }}>{f.step}</td>
                  <td style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0052ff' }}>
                    {f.visitors.toLocaleString()} users
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: 80, height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: f.conv, height: '100%', background: '#059669' }} />
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#059669' }}>{f.conv}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: f.drop === '0%' ? '#64748b' : '#ef4444', fontWeight: 700 }}>
                    {f.drop}
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
