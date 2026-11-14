'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Globe,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  Zap,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';
import styles from '../dashboard/dashboard.module.css';

export default function WebsiteManagementPage() {
  const [isPurging, setIsPurging] = useState(false);
  const [purgeSuccess, setPurgeSuccess] = useState(false);

  const handlePurgeCache = async () => {
    setIsPurging(true);
    setPurgeSuccess(false);
    setTimeout(() => {
      setIsPurging(false);
      setPurgeSuccess(true);
      setTimeout(() => setPurgeSuccess(false), 3000);
    }, 1000);
  };

  const routes = [
    { path: '/', type: 'Static (ISR)', revalidate: '3600s', status: '200 OK', views: '142.5K' },
    { path: '/about', type: 'Static', revalidate: 'Static', status: '200 OK', views: '18.2K' },
    { path: '/careers', type: 'Server (Dynamic)', revalidate: 'Dynamic', status: '200 OK', views: '9.4K' },
    { path: '/pricing', type: 'Static', revalidate: 'Static', status: '200 OK', views: '38.1K' },
    { path: '/features', type: 'Static', revalidate: 'Static', status: '200 OK', views: '22.8K' },
    { path: '/[userId]', type: 'Dynamic (ISR)', revalidate: '60s', status: '200 OK', views: '342.1K' },
    { path: '/[userId]/projects/[slug]', type: 'Dynamic (ISR)', revalidate: '60s', status: '200 OK', views: '84.6K' },
  ];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Website Control Centre</h1>
          <p className={styles.subtitle}>
            Production route status, edge CDN caching, page load benchmarks and live deployments for tapfolio.me
          </p>
        </div>
        <div className={styles.headerRight}>
          {purgeSuccess && (
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 750,
                color: '#059669',
                background: '#ecfdf5',
                padding: '0.4rem 0.85rem',
                borderRadius: 8,
              }}
            >
              ✔ Vercel Edge Cache Purged!
            </span>
          )}
          <button
            onClick={handlePurgeCache}
            disabled={isPurging}
            className={styles.refreshBtn}
          >
            <RefreshCw size={15} className={isPurging ? 'animate-spin' : ''} />
            <span>{isPurging ? 'Purging Cache...' : 'Purge Edge Cache'}</span>
          </button>
        </div>
      </header>

      {/* Top 4 Metrics Grid */}
      <div className={styles.topMetricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricIcon} style={{ background: '#edf3ff', color: '#0052ff' }}>
              <Globe size={19} />
            </div>
            <span className={styles.metricLabel}>Monthly Web Visitors</span>
          </div>
          <div className={styles.metricBody}>
            <div>
              <div className={styles.metricValue}>184.2K</div>
              <div className={styles.metricTrend}>
                <TrendingUp size={13} />
                <span>+31.4% vs last month</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricIcon} style={{ background: '#ecfdf5', color: '#059669' }}>
              <Zap size={19} />
            </div>
            <span className={styles.metricLabel}>Edge Cache Hit Ratio</span>
          </div>
          <div className={styles.metricBody}>
            <div>
              <div className={styles.metricValue}>98.4%</div>
              <div className={styles.metricTrend}>
                <TrendingUp size={13} />
                <span>Sub-50ms global delivery</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricIcon} style={{ background: '#eff6ff', color: '#00a3ff' }}>
              <CheckCircle2 size={19} />
            </div>
            <span className={styles.metricLabel}>Core Web Vitals LCP</span>
          </div>
          <div className={styles.metricBody}>
            <div>
              <div className={styles.metricValue}>0.8s</div>
              <div style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700, marginTop: '0.2rem' }}>
                ● Top 5% worldwide speed
              </div>
            </div>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricIcon} style={{ background: '#fffbeb', color: '#d97706' }}>
              <ShieldCheck size={19} />
            </div>
            <span className={styles.metricLabel}>SSL / HTTPS Status</span>
          </div>
          <div className={styles.metricBody}>
            <div>
              <div className={styles.metricValue}>A+ Security</div>
              <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '0.2rem' }}>
                HSTS Preload & Strict CSP Active
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Routes Table */}
      <div className={styles.panelCard}>
        <div className={styles.panelHeader}>
          <div>
            <h2 className={styles.panelTitle}>Published Web Routes & Static Generation</h2>
            <p className={styles.panelSub}>Next.js 16 App Router deployment paths</p>
          </div>
        </div>

        <table className={styles.ticketsTable}>
          <thead>
            <tr>
              <th>Route Endpoint</th>
              <th>Rendering Mode</th>
              <th>Revalidation Interval</th>
              <th>Health / HTTP</th>
              <th>Monthly Impressions</th>
              <th className="text-right">Live Link</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((r) => (
              <tr key={r.path}>
                <td>
                  <span style={{ fontWeight: 750, color: '#0f172a', fontFamily: 'monospace' }}>
                    {r.path}
                  </span>
                </td>
                <td>
                  <span style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 650 }}>{r.type}</span>
                </td>
                <td>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{r.revalidate}</span>
                </td>
                <td>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '0.2rem 0.55rem',
                      borderRadius: 6,
                      background: '#ecfdf5',
                      color: '#059669',
                    }}
                  >
                    ● {r.status}
                  </span>
                </td>
                <td>
                  <span style={{ fontWeight: 800, color: '#0f172a' }}>{r.views}</span>
                </td>
                <td className="text-right">
                  <a
                    href={r.path === '/[userId]' ? '/nibras' : r.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 750,
                      color: '#0052ff',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}
                  >
                    <span>Visit Route</span>
                    <ExternalLink size={12} />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
