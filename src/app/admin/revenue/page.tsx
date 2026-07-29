'use client';

import { useEffect, useState } from 'react';
import styles from '../dashboard/dashboard.module.css';

interface RevenueData {
  metrics: {
    monthlyRevenue: string;
    premiumSubscribers: number;
    conversionRate: string;
    refunds: number;
    recentPremiumAdded: string;
  };
  topPlans: Array<{
    plan: string;
    revenue: string;
    subs: number;
  }>;
  countries: Array<{
    country: string;
    revenue: string;
  }>;
}

export default function RevenuePage() {
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/revenue')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load revenue data');
        return res.json();
      })
      .then((resData) => {
        if (resData.success) {
          setData(resData);
        }
      })
      .catch((err) => console.error('Error fetching revenue metrics:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Revenue</h1>
          <p className={styles.pageSub}>Subscriptions, sales, and financial overview</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>💰 Monthly Revenue</span>
          <span className={styles.kpiValue}>
            {loading ? '—' : data?.metrics.monthlyRevenue}
          </span>
          <span className={styles.kpiDeltaUp}>Real-time active plan value</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>⭐ Premium Subscribers</span>
          <span className={styles.kpiValue}>
            {loading ? '—' : data?.metrics.premiumSubscribers}
          </span>
          <span className={styles.kpiDeltaUp}>
            {loading ? '—' : data?.metrics.recentPremiumAdded}
          </span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>📊 Conversion Rate</span>
          <span className={styles.kpiValue}>
            {loading ? '—' : data?.metrics.conversionRate}
          </span>
          <span className={styles.kpiDeltaUp}>Ratio of total registered users</span>
        </div>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>🔄 Refunds</span>
          <span className={styles.kpiValue}>
            {loading ? '—' : data?.metrics.refunds}
          </span>
          <span className={styles.kpiDeltaUp}>Under control</span>
        </div>
      </div>

      {/* Breakdown Rows */}
      <div className={styles.splitRow}>
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>🏆 Top Plans</span>
          </div>
          <div className={styles.panelBody}>
            {loading ? (
              <div style={{ padding: '1rem', color: '#64748B' }}>Loading plans...</div>
            ) : (
              (data?.topPlans || []).map((p) => (
                <div key={p.plan} className={styles.statRow}>
                  <span className={styles.statLabel}>{p.plan} ({p.subs} subs)</span>
                  <span className={styles.statValue}>{p.revenue}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>🌍 Revenue by Country</span>
          </div>
          <div className={styles.panelBody}>
            {loading ? (
              <div style={{ padding: '1rem', color: '#64748B' }}>Loading countries...</div>
            ) : (
              (data?.countries || []).map((c) => (
                <div key={c.country} className={styles.statRow}>
                  <span className={styles.statLabel}>{c.country}</span>
                  <span className={styles.statValue}>{c.revenue}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
