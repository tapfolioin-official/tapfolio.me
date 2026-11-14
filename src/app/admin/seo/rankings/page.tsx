'use client';

import React from 'react';
import Link from 'next/link';
import {
  TrendingUp,
  Search,
  ArrowUp,
  ArrowDown,
  Award,
  Globe,
  Calendar,
} from 'lucide-react';
import styles from '../../dashboard/dashboard.module.css';

export default function RankTrackingPage() {
  const rankingTimeline = [
    { query: 'smart nfc business card', rank: 3, prev: 5, gain: '+2', volume: '18.1K', engine: 'Google US' },
    { query: 'digital portfolio builder', rank: 6, prev: 6, gain: '0', volume: '22.4K', engine: 'Google US' },
    { query: 'tap to share profile', rank: 2, prev: 4, gain: '+2', volume: '9.2K', engine: 'Google Global' },
    { query: 'nfc vcard generator', rank: 8, prev: 7, gain: '-1', volume: '6.7K', engine: 'Google UK' },
    { query: 'contactless business card app', rank: 4, prev: 9, gain: '+5', volume: '14.5K', engine: 'Google US' },
    { query: 'tapfolio', rank: 1, prev: 1, gain: '0', volume: '12.0K', engine: 'Google Global' },
  ];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Organic SERP Rank Tracking</h1>
          <p className={styles.subtitle}>
            Daily search engine ranking position updates across Google Search mobile & desktop indices
          </p>
        </div>
        <div className={styles.headerRight}>
          <Link
            href="/admin/seo/keywords"
            className={styles.secondaryBtn}
            style={{ textDecoration: 'none' }}
          >
            Manage Target Keywords
          </Link>
        </div>
      </header>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Average Position</span>
          <span className={styles.kpiValue}>4.0</span>
          <div className={styles.kpiGrowth} style={{ color: '#059669' }}>
            <span>↑ +1.8 this month</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>#1 Rankings</span>
          <span className={styles.kpiValue}>3</span>
          <div className={styles.kpiGrowth} style={{ color: '#0052ff' }}>
            <span>Brand + Category leader</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Top 10 Rankings</span>
          <span className={styles.kpiValue}>18</span>
          <div className={styles.kpiGrowth} style={{ color: '#059669' }}>
            <span>↑ 85% of tracked terms</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Estimated Organic Clicks</span>
          <span className={styles.kpiValue}>24.6K / mo</span>
          <div className={styles.kpiGrowth} style={{ color: '#059669' }}>
            <span>↑ 32.6% YoY</span>
          </div>
        </div>
      </div>

      {/* Rankings Table */}
      <div className={styles.tableCard}>
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Search Query</th>
                <th>Search Index</th>
                <th>Rank Position</th>
                <th>Net Change</th>
                <th>Search Volume</th>
                <th>SERP Visibility</th>
              </tr>
            </thead>
            <tbody>
              {rankingTimeline.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 800, color: '#0f172a' }}>{item.query}</td>
                  <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.engine}</td>
                  <td>
                    <span
                      style={{
                        fontSize: '1.05rem',
                        fontWeight: 900,
                        color: item.rank <= 3 ? '#059669' : '#0052ff',
                      }}
                    >
                      #{item.rank}
                    </span>
                  </td>
                  <td>
                    {item.gain.startsWith('+') ? (
                      <span style={{ color: '#059669', fontWeight: 800, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <ArrowUp size={14} /> {item.gain}
                      </span>
                    ) : item.gain.startsWith('-') ? (
                      <span style={{ color: '#ef4444', fontWeight: 800, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <ArrowDown size={14} /> {item.gain}
                      </span>
                    ) : (
                      <span style={{ color: '#94a3b8', fontWeight: 700, fontSize: '0.8rem' }}>0</span>
                    )}
                  </td>
                  <td style={{ fontWeight: 750, color: '#0f172a' }}>{item.volume}</td>
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
                      HIGH
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
