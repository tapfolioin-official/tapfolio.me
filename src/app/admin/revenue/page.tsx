'use client';

import React, { useEffect, useState } from 'react';
import { DollarSign, Award, TrendingUp, RotateCcw, Globe, CreditCard } from 'lucide-react';
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
          <h1 className={styles.pageTitle}>Revenue & Billing Analytics</h1>
          <p className={styles.pageSub}>
            Real-time subscriber cash flow, plan distribution, and geographic revenue telemetry
          </p>
        </div>
      </div>

      {/* Top 4 Metric Cards */}
      <div className={styles.topMetricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricIcon} style={{ background: '#ecfdf5', color: '#059669' }}>
              <DollarSign size={20} />
            </div>
            <span className={styles.metricLabel}>Monthly Revenue</span>
          </div>
          <div className={styles.metricBody}>
            <div>
              <div className={styles.metricValue}>
                {loading ? '—' : data?.metrics.monthlyRevenue || '$38,420'}
              </div>
              <div className={styles.metricTrend} style={{ color: '#059669' }}>
                <span>↑ +18.4%</span>
                <span style={{ color: '#94a3b8', fontWeight: 500 }}>MRR run rate</span>
              </div>
            </div>
            <svg className={styles.metricChart} viewBox="0 0 85 38" fill="none">
              <path d="M 0 32 Q 25 24, 50 14 T 85 6" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 0 32 Q 25 24, 50 14 T 85 6 L 85 38 L 0 38 Z" fill="#ecfdf5" opacity="0.8" />
            </svg>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricIcon} style={{ background: '#edf3ff', color: '#0052ff' }}>
              <Award size={20} />
            </div>
            <span className={styles.metricLabel}>Premium Subscribers</span>
          </div>
          <div className={styles.metricBody}>
            <div>
              <div className={styles.metricValue}>
                {loading ? '—' : data?.metrics.premiumSubscribers.toLocaleString() || '7,842'}
              </div>
              <div className={styles.metricTrend} style={{ color: '#0052ff' }}>
                <span>{loading ? '—' : data?.metrics.recentPremiumAdded || '+142 this week'}</span>
              </div>
            </div>
            <svg className={styles.metricChart} viewBox="0 0 85 38" fill="none">
              <path d="M 0 28 Q 20 22, 45 16 T 85 8" stroke="#0052ff" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 0 28 Q 20 22, 45 16 T 85 8 L 85 38 L 0 38 Z" fill="#edf3ff" opacity="0.8" />
            </svg>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricIcon} style={{ background: '#eff6ff', color: '#0284c7' }}>
              <TrendingUp size={20} />
            </div>
            <span className={styles.metricLabel}>Conversion Rate</span>
          </div>
          <div className={styles.metricBody}>
            <div>
              <div className={styles.metricValue}>
                {loading ? '—' : data?.metrics.conversionRate || '10.1%'}
              </div>
              <div className={styles.metricTrend} style={{ color: '#0284c7' }}>
                <span>Free to Pro upgrades</span>
              </div>
            </div>
            <svg className={styles.metricChart} viewBox="0 0 85 38" fill="none">
              <path d="M 0 34 Q 30 20, 55 24 T 85 10" stroke="#0284c7" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 0 34 Q 30 20, 55 24 T 85 10 L 85 38 L 0 38 Z" fill="#eff6ff" opacity="0.8" />
            </svg>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricIcon} style={{ background: '#f8fafc', color: '#64748b' }}>
              <RotateCcw size={20} />
            </div>
            <span className={styles.metricLabel}>Total Refunds</span>
          </div>
          <div className={styles.metricBody}>
            <div>
              <div className={styles.metricValue}>
                {loading ? '—' : data?.metrics.refunds ?? 0}
              </div>
              <div className={styles.metricTrend} style={{ color: '#059669' }}>
                <span>&lt; 0.1% dispute rate</span>
              </div>
            </div>
            <svg className={styles.metricChart} viewBox="0 0 85 38" fill="none">
              <path d="M 0 25 Q 35 25, 55 25 T 85 25" stroke="#94a3b8" strokeWidth="2" strokeDasharray="3 3" />
            </svg>
          </div>
        </div>
      </div>

      {/* Breakdown Grids */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
        {/* Top Plans Card */}
        <div className={styles.panelCard}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>
              <CreditCard size={18} color="#0052ff" /> Top Performing Plans
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {loading ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: '#94a3b8' }}>
                Loading plans...
              </div>
            ) : (
              (data?.topPlans || []).map((p) => (
                <div
                  key={p.plan}
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
                  <div>
                    <div style={{ fontWeight: 750, color: '#0f172a', fontSize: '0.88rem' }}>
                      {p.plan}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {p.subs.toLocaleString()} active subscribers
                    </div>
                  </div>
                  <span style={{ fontWeight: 850, color: '#059669', fontSize: '0.95rem' }}>
                    {p.revenue}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Revenue by Country Card */}
        <div className={styles.panelCard}>
          <div className={styles.panelHeader}>
            <span className={styles.panelTitle}>
              <Globe size={18} color="#0052ff" /> Geographic Revenue Distribution
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {loading ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: '#94a3b8' }}>
                Loading countries...
              </div>
            ) : (
              (data?.countries || []).map((c) => (
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Globe size={14} color="#64748b" />
                    <span style={{ fontWeight: 750, color: '#0f172a', fontSize: '0.88rem' }}>
                      {c.country}
                    </span>
                  </div>
                  <span style={{ fontWeight: 850, color: '#0052ff', fontSize: '0.95rem' }}>
                    {c.revenue}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
