'use client';

import { useEffect, useState, useCallback } from 'react';
import styles from './dashboard.module.css';

interface KPIs {
  totalUsers: number;
  todayUsers: number;
  weekUsers: number;
  monthUsers: number;
  premiumUsers: number;
  totalProfiles: number;
  totalProjects: number;
  growth: number;
  openTickets: number;
  pendingReports: number;
}

export default function AdminDashboard() {
  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true);
    try {
      const res = await fetch('/api/admin/analytics');
      if (res.ok) {
        const data = await res.json();
        setKpis(data.kpis);
        setLastUpdated(new Date());
      }
    } catch (e) {
      console.error('Failed to fetch analytics', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => fetchData(), 30000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>
            Real‑time overview of Tapfolio's performance
          </p>
        </div>
        <div className={styles.headerRight}>
          {lastUpdated && (
            <span className={styles.timestamp}>
              🕒 Updated {formatTime(lastUpdated)}
            </span>
          )}
          <button
            className={`${styles.refreshBtn} ${refreshing ? styles.refreshing : ''}`}
            onClick={() => fetchData(true)}
            disabled={refreshing}
            aria-label="Refresh data"
          >
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              stroke="currentColor"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            <span>Refresh</span>
          </button>
        </div>
      </header>

      {/* KPI Grid */}
      <div className={styles.kpiGrid}>
        {/* Card: Total Users */}
        <MetricCard
          icon="👥"
          label="Total Users"
          value={loading ? undefined : kpis?.totalUsers}
          formatter={(v) => v.toLocaleString()}
          footer={
            <span className={styles.metricTrendUp}>
              +{loading ? '…' : kpis?.todayUsers} today
            </span>
          }
          loading={loading}
        />

        {/* Card: Premium */}
        <MetricCard
          icon="⭐"
          label="Premium Users"
          value={loading ? undefined : kpis?.premiumUsers}
          formatter={(v) => v.toLocaleString()}
          footer={
            <span className={styles.metricTrendUp}>
              {loading
                ? '…'
                : `${((kpis?.premiumUsers || 0) / Math.max(kpis?.totalUsers || 1, 1) * 100).toFixed(1)}%`}{' '}
              conversion
            </span>
          }
          loading={loading}
        />

        {/* Card: Growth */}
        <MetricCard
          icon="📈"
          label="Growth (weekly)"
          value={loading ? undefined : kpis?.growth}
          formatter={(v) => `${v > 0 ? '+' : ''}${v}%`}
          footer={
            <span
              className={
                (kpis?.growth || 0) >= 0
                  ? styles.metricTrendUp
                  : styles.metricTrendDown
              }
            >
              vs last week
            </span>
          }
          loading={loading}
        />

        {/* Card: Portfolios */}
        <MetricCard
          icon="🖼️"
          label="Portfolios"
          value={loading ? undefined : kpis?.totalProfiles}
          formatter={(v) => v.toLocaleString()}
          loading={loading}
        />

        {/* Card: Projects */}
        <MetricCard
          icon="🗂️"
          label="Projects"
          value={loading ? undefined : kpis?.totalProjects}
          formatter={(v) => v.toLocaleString()}
          loading={loading}
        />

        {/* Card: Support Queue */}
        <MetricCard
          icon="💬"
          label="Support Queue"
          value={loading ? undefined : kpis?.openTickets}
          formatter={(v) => v.toString()}
          footer={
            <span
              className={
                (kpis?.openTickets || 0) > 5
                  ? styles.metricAlertDanger
                  : styles.metricAlertSuccess
              }
            >
              {(kpis?.openTickets || 0) > 5 ? 'Needs attention' : 'Under control'}
            </span>
          }
          loading={loading}
        />

        {/* Card: Pending Reports */}
        <MetricCard
          icon="🚨"
          label="Pending Reports"
          value={loading ? undefined : kpis?.pendingReports}
          formatter={(v) => v.toString()}
          footer={
            <span
              className={
                (kpis?.pendingReports || 0) > 3
                  ? styles.metricAlertDanger
                  : styles.metricAlertSuccess
              }
            >
              {(kpis?.pendingReports || 0) > 3 ? 'Action needed' : 'Clear'}
            </span>
          }
          loading={loading}
        />
      </div>
    </div>
  );
}

// ---------- Reusable Metric Card Component ----------
interface MetricCardProps {
  icon: string;
  label: string;
  value?: number;
  formatter?: (value: number) => string;
  footer?: React.ReactNode;
  loading: boolean;
}

function MetricCard({
  icon,
  label,
  value,
  formatter = (v) => v.toString(),
  footer,
  loading,
}: MetricCardProps) {
  return (
    <div className={styles.metricCard}>
      <div className={styles.metricIcon}>{icon}</div>
      <div className={styles.metricContent}>
        <span className={styles.metricLabel}>{label}</span>
        <span className={styles.metricValue}>
          {loading ? <span className={styles.skeleton} /> : formatter(value!)}
        </span>
        {footer && <div className={styles.metricFooter}>{footer}</div>}
      </div>
    </div>
  );
}