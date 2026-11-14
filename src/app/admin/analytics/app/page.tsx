'use client';

import React from 'react';
import Link from 'next/link';
import {
  Smartphone,
  TabletSmartphone,
  Users,
  Activity,
  Radio,
  Star,
  CheckCircle2,
} from 'lucide-react';
import styles from '../../dashboard/dashboard.module.css';

export default function MobileAppAnalyticsPage() {
  const versions = [
    { build: 'v2.4.0 (Latest)', os: 'iOS 18 / Android 15', activeDevices: 14200, adoption: '75.1%', crashRate: '0.01%' },
    { build: 'v2.3.8', os: 'iOS 17 / Android 14', activeDevices: 3400, adoption: '18.0%', crashRate: '0.02%' },
    { build: 'v2.3.0', os: 'Legacy', activeDevices: 1300, adoption: '6.9%', crashRate: '0.04%' },
  ];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Mobile App Usage & Retention Analytics</h1>
          <p className={styles.subtitle}>
            Active mobile device telemetry, Daily Active Users (DAU), build adoption rates, and hardware pairing events
          </p>
        </div>
        <div className={styles.headerRight}>
          <Link
            href="/admin/mobile-app"
            className={styles.primaryBtn}
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <Smartphone size={15} /> Manage Mobile Fleet
          </Link>
        </div>
      </header>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Monthly Active Users (MAU)</span>
          <span className={styles.kpiValue}>18,900</span>
          <div className={styles.kpiGrowth} style={{ color: '#059669' }}>
            <span>↑ 31.2% MoM</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Daily Active Users (DAU)</span>
          <span className={styles.kpiValue}>6,420</span>
          <div className={styles.kpiGrowth} style={{ color: '#0052ff' }}>
            <span>34% DAU / MAU ratio</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Day 30 Retention</span>
          <span className={styles.kpiValue} style={{ color: '#059669' }}>48.6%</span>
          <div className={styles.kpiGrowth} style={{ color: '#059669' }}>
            <span>Top tier SaaS retention</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Crash-Free Sessions</span>
          <span className={styles.kpiValue} style={{ color: '#059669' }}>99.98%</span>
          <div className={styles.kpiGrowth} style={{ color: '#059669' }}>
            <span>Production stable</span>
          </div>
        </div>
      </div>

      {/* App Build Adoption Table */}
      <div className={styles.tableCard}>
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>App Version & Release</th>
                <th>Target Operating System</th>
                <th>Active Devices</th>
                <th>Fleet Adoption Share</th>
                <th>Crash Free Rate</th>
              </tr>
            </thead>
            <tbody>
              {versions.map((v, idx) => (
                <tr key={idx}>
                  <td>
                    <span style={{ fontWeight: 800, color: '#0f172a' }}>{v.build}</span>
                  </td>
                  <td style={{ fontSize: '0.82rem', color: '#64748b' }}>{v.os}</td>
                  <td style={{ fontWeight: 750, color: '#0052ff' }}>
                    {v.activeDevices.toLocaleString()}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: 60, height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: v.adoption, height: '100%', background: '#0052ff' }} />
                      </div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 750, color: '#0f172a' }}>{v.adoption}</span>
                    </div>
                  </td>
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
                      {v.crashRate}
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
