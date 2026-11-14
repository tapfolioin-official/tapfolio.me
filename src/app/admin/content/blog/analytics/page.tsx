'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  BarChart2,
  TrendingUp,
  Eye,
  Clock,
  ArrowRight,
  ExternalLink,
  Users,
} from 'lucide-react';
import styles from '@/app/admin/dashboard/dashboard.module.css';

export default function BlogAnalyticsPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/blog/dashboard')
      .then((res) => res.json())
      .then((data) => {
        if (data.metrics) setMetrics(data.metrics);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.25rem 0.75rem',
              background: '#edf3ff',
              color: '#0052ff',
              borderRadius: 20,
              fontSize: '0.78rem',
              fontWeight: 750,
              marginBottom: '0.55rem',
            }}
          >
            <BarChart2 size={13} /> Reader Telemetry
          </div>
          <h1 className={styles.pageTitle}>Blog Performance & Traffic Analytics</h1>
          <p className={styles.pageSub}>
            Track readership metrics, page views, high-converting articles and category popularity.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>Total Blog Article Views</div>
          <div className={styles.kpiValue} style={{ color: '#0052ff' }}>
            {loading ? '—' : (metrics?.totalViews || 0).toLocaleString()}
          </div>
          <div className={styles.kpiSubtext}>Organic readership reads</div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>Published Live Articles</div>
          <div className={styles.kpiValue} style={{ color: '#059669' }}>
            {loading ? '—' : (metrics?.publishedCount || 0).toLocaleString()}
          </div>
          <div className={styles.kpiSubtext}>Indexed and readable</div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>Estimated Avg. Read Time</div>
          <div className={styles.kpiValue} style={{ color: '#7c3aed' }}>
            4.8 Min
          </div>
          <div className={styles.kpiSubtext}>Across all published guides</div>
        </div>

        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>Active Categories</div>
          <div className={styles.kpiValue} style={{ color: '#0284c7' }}>
            {loading ? '—' : metrics?.categories?.length || 7}
          </div>
          <div className={styles.kpiSubtext}>Topic niches represented</div>
        </div>
      </div>

      {/* Top Performing Articles */}
      <div className={styles.tableCard}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
              Top 10 High-Performing Articles by Traffic
            </h2>
            <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
              Articles generating the most connection inquiries and organic reads
            </p>
          </div>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: 40 }}>#</th>
              <th>ARTICLE TITLE</th>
              <th>CATEGORY</th>
              <th>AUTHOR</th>
              <th>PAGEVIEWS</th>
              <th style={{ textAlign: 'right' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                  Loading analytics...
                </td>
              </tr>
            ) : !metrics?.mostViewed || metrics.mostViewed.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                  No view telemetry recorded yet.
                </td>
              </tr>
            ) : (
              metrics.mostViewed.map((post: any, idx: number) => (
                <tr key={post.id}>
                  <td style={{ fontWeight: 800, color: idx === 0 ? '#0052ff' : '#94a3b8' }}>
                    {idx + 1}
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{post.title}</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>/blog/{post.slug}</div>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: 6,
                        background: '#f1f5f9',
                        color: '#475569',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                      }}
                    >
                      {post.categoryName || 'General'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.82rem', color: '#334155', fontWeight: 600 }}>
                    {post.authorName || 'Tapfolio Team'}
                  </td>
                  <td>
                    <span style={{ fontWeight: 800, color: '#0052ff', fontSize: '0.86rem' }}>
                      {post.views.toLocaleString()} views
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className={styles.secondaryBtn}
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.76rem' }}
                    >
                      <ExternalLink size={13} /> View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
