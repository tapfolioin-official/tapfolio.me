'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  FileText,
  CheckCircle2,
  Clock,
  CalendarClock,
  Eye,
  Plus,
  ArrowRight,
  TrendingUp,
  FolderTree,
  ImageIcon,
  Sparkles,
  RefreshCw,
  ExternalLink,
  Edit3,
  Search,
  Filter,
} from 'lucide-react';
import styles from '../../dashboard/dashboard.module.css';

interface DashboardMetrics {
  totalArticles: number;
  publishedCount: number;
  draftCount: number;
  scheduledCount: number;
  pendingReviewCount: number;
  totalViews: number;
  recentlyPublished: Array<{
    id: number;
    title: string;
    slug: string;
    categoryName: string;
    authorName: string;
    publishedAt: string;
    views: number;
  }>;
  mostViewed: Array<{
    id: number;
    title: string;
    slug: string;
    categoryName: string;
    authorName: string;
    publishedAt: string;
    views: number;
  }>;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
    postCount: number;
  }>;
}

export default function BlogDashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMetrics = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/blog/dashboard');
      if (res.ok) {
        const data = await res.json();
        setMetrics(data.metrics);
      }
    } catch (err) {
      console.error('Failed to load blog metrics', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchMetrics();
  }, [fetchMetrics]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchMetrics();
  };

  return (
    <div className={styles.page}>
      {/* ─── Page Header ─── */}
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
            <FileText size={13} /> Content Management
          </div>
          <h1 className={styles.pageTitle}>Blog Management & Publishing</h1>
          <p className={styles.pageSub}>
            Create, schedule, optimize SEO and publish dynamic articles across Tapfolio Insights.
          </p>
        </div>

        <div className={styles.headerRight}>
          <button
            type="button"
            onClick={handleRefresh}
            className={styles.secondaryBtn}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} /> Refresh
          </button>
          <Link
            href="/blog"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.secondaryBtn}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <ExternalLink size={14} /> View Public Blog
          </Link>
          <Link
            href="/admin/content/blog/create"
            className={styles.primaryBtn}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={16} /> Create New Article
          </Link>
        </div>
      </div>

      {/* ─── 6 Key Publishing Metrics Cards ─── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        {/* Total Articles */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel}>Total Articles</div>
          <div className={styles.kpiValue}>
            {loading ? '—' : (metrics?.totalArticles || 0).toLocaleString()}
          </div>
          <div className={styles.kpiSubtext}>Stored in database</div>
        </div>

        {/* Published */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel} style={{ color: '#059669' }}>
            ● Published Live
          </div>
          <div className={styles.kpiValue}>
            {loading ? '—' : (metrics?.publishedCount || 0).toLocaleString()}
          </div>
          <div className={styles.kpiSubtext}>Indexed by search engines</div>
        </div>

        {/* Drafts */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel} style={{ color: '#d97706' }}>
            ● Drafts
          </div>
          <div className={styles.kpiValue}>
            {loading ? '—' : (metrics?.draftCount || 0).toLocaleString()}
          </div>
          <div className={styles.kpiSubtext}>Unpublished drafts</div>
        </div>

        {/* Scheduled */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel} style={{ color: '#0284c7' }}>
            ● Scheduled Posts
          </div>
          <div className={styles.kpiValue}>
            {loading ? '—' : (metrics?.scheduledCount || 0).toLocaleString()}
          </div>
          <div className={styles.kpiSubtext}>Auto-release queue</div>
        </div>

        {/* Pending Review */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel} style={{ color: '#7c3aed' }}>
            ● Pending Review
          </div>
          <div className={styles.kpiValue}>
            {loading ? '—' : (metrics?.pendingReviewCount || 0).toLocaleString()}
          </div>
          <div className={styles.kpiSubtext}>Awaiting sign-off</div>
        </div>

        {/* Total Views */}
        <div className={styles.kpiCard}>
          <div className={styles.kpiLabel} style={{ color: '#0052ff' }}>
            Total Article Views
          </div>
          <div className={styles.kpiValue}>
            {loading ? '—' : (metrics?.totalViews || 0).toLocaleString()}
          </div>
          <div className={styles.kpiSubtext}>Organic reader traffic</div>
        </div>
      </div>

      {/* ─── Quick Navigation Tabs Bar ─── */}
      <div
        style={{
          display: 'flex',
          gap: '0.6rem',
          flexWrap: 'wrap',
          marginBottom: '1.5rem',
          background: '#ffffff',
          padding: '0.75rem',
          borderRadius: 14,
          border: '1px solid #e8eefa',
        }}
      >
        <Link
          href="/admin/content/blog/articles"
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 10,
            background: '#edf3ff',
            color: '#0052ff',
            fontWeight: 700,
            fontSize: '0.82rem',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <FileText size={15} /> All Articles ({metrics?.totalArticles || 0})
        </Link>
        <Link
          href="/admin/content/blog/create"
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 10,
            background: '#f8fafc',
            color: '#475569',
            fontWeight: 650,
            fontSize: '0.82rem',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <Plus size={15} /> New Article
        </Link>
        <Link
          href="/admin/content/blog/categories"
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 10,
            background: '#f8fafc',
            color: '#475569',
            fontWeight: 650,
            fontSize: '0.82rem',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <FolderTree size={15} /> Categories ({metrics?.categories.length || 0})
        </Link>
        <Link
          href="/admin/content/blog/media"
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 10,
            background: '#f8fafc',
            color: '#475569',
            fontWeight: 650,
            fontSize: '0.82rem',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <ImageIcon size={15} /> Media Library
        </Link>
        <Link
          href="/admin/content/blog/scheduled"
          style={{
            padding: '0.5rem 1rem',
            borderRadius: 10,
            background: '#f8fafc',
            color: '#475569',
            fontWeight: 650,
            fontSize: '0.82rem',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <CalendarClock size={15} /> Scheduled ({metrics?.scheduledCount || 0})
        </Link>
      </div>

      {/* ─── Two-Column Operations Layout ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1.25rem' }}>
        {/* Left Column: Recently Published Articles Table */}
        <div className={styles.tableCard}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem',
            }}
          >
            <div>
              <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                Recently Published Articles
              </h2>
              <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
                Live articles currently served on tapfolio.me/blog
              </p>
            </div>
            <Link
              href="/admin/content/blog/articles"
              style={{
                fontSize: '0.8rem',
                fontWeight: 700,
                color: '#0052ff',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
              }}
            >
              View All <ArrowRight size={13} />
            </Link>
          </div>

          <table className={styles.table}>
            <thead>
              <tr>
                <th>ARTICLE TITLE</th>
                <th>CATEGORY</th>
                <th>AUTHOR</th>
                <th>VIEWS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                    Loading articles...
                  </td>
                </tr>
              ) : !metrics?.recentlyPublished || metrics.recentlyPublished.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                    No published articles found.
                  </td>
                </tr>
              ) : (
                metrics.recentlyPublished.map((post) => (
                  <tr key={post.id}>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.86rem' }}>
                          {post.title}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                          /blog/{post.slug}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          background: '#f1f5f9',
                          color: '#475569',
                          padding: '0.2rem 0.5rem',
                          borderRadius: 6,
                        }}
                      >
                        {post.categoryName || 'General'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: '#334155', fontWeight: 600 }}>
                      {post.authorName || 'Tapfolio Team'}
                    </td>
                    <td>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          color: '#0052ff',
                        }}
                      >
                        <Eye size={13} /> {post.views.toLocaleString()}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <Link
                          href={`/admin/content/blog/create?id=${post.id}`}
                          className={styles.secondaryBtn}
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.76rem' }}
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.secondaryBtn}
                          style={{ padding: '0.3rem 0.5rem', fontSize: '0.76rem' }}
                          title="View live article"
                        >
                          <ExternalLink size={13} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Right Column: Most Viewed Articles & Categories Breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Top Articles by Views */}
          <div className={styles.tableCard}>
            <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.25rem' }}>
              Most Viewed Articles
            </h2>
            <p style={{ fontSize: '0.78rem', color: '#64748b', marginBottom: '0.85rem' }}>
              Articles driving top organic reader engagement
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {loading ? (
                <div style={{ color: '#94a3b8', fontSize: '0.82rem' }}>Loading top content...</div>
              ) : !metrics?.mostViewed || metrics.mostViewed.length === 0 ? (
                <div style={{ color: '#94a3b8', fontSize: '0.82rem' }}>No view telemetry recorded yet.</div>
              ) : (
                metrics.mostViewed.map((post, idx) => (
                  <div
                    key={post.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.55rem',
                      borderRadius: 10,
                      background: '#f8fafc',
                      border: '1px solid #f1f5f9',
                    }}
                  >
                    <span
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: 6,
                        background: idx === 0 ? '#0052ff' : '#e2e8f0',
                        color: idx === 0 ? '#fff' : '#475569',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {idx + 1}
                    </span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          color: '#0f172a',
                          textDecoration: 'none',
                          display: 'block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {post.title}
                      </Link>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                        {post.categoryName} • {post.views} views
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Categories Overview */}
          <div className={styles.tableCard}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '0.65rem',
              }}
            >
              <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                Content Categories
              </h2>
              <Link
                href="/admin/content/blog/categories"
                style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0052ff', textDecoration: 'none' }}
              >
                Manage
              </Link>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {metrics?.categories.map((cat) => (
                <div
                  key={cat.id}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: 20,
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    fontSize: '0.78rem',
                    fontWeight: 650,
                    color: '#334155',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <span>{cat.name}</span>
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      background: '#edf3ff',
                      color: '#0052ff',
                      padding: '0.1rem 0.35rem',
                      borderRadius: 10,
                    }}
                  >
                    {cat.postCount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
