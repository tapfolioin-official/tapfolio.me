'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  FileText,
  Search,
  Filter,
  Plus,
  RefreshCw,
  MoreVertical,
  ExternalLink,
  Edit,
  Trash2,
  CheckCircle2,
  Archive,
  Clock,
  Eye,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowUpDown,
  Check,
  X,
} from 'lucide-react';
import styles from '@/app/admin/dashboard/dashboard.module.css';

interface ArticleItem {
  id: number;
  title: string;
  slug: string;
  summary: string;
  featuredImage: string | null;
  status: 'PUBLISHED' | 'DRAFT' | 'SCHEDULED' | 'PENDING_REVIEW' | 'ARCHIVED';
  publishedAt: string | null;
  scheduledAt: string | null;
  readingTime: string | null;
  views: number;
  authorName: string | null;
  categoryName: string | null;
  updatedAt: string;
}

export default function AllArticlesPage() {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters & Pagination
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('dateDesc');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // Categories list for dropdown
  const [categories, setCategories] = useState<string[]>([]);

  const fetchArticles = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        status: statusFilter,
        category: categoryFilter,
        sortBy,
        page: String(page),
        limit: String(limit),
      });

      const res = await fetch(`/api/admin/blog/posts?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setArticles(data.posts || []);
        setTotalCount(data.total || 0);
        setTotalPages(data.totalPages || 1);
      }
    } catch (e) {
      console.error('Failed to load articles', e);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, categoryFilter, sortBy, page, limit]);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // Load categories list for filter dropdown
  useEffect(() => {
    fetch('/api/admin/blog/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) {
          setCategories(data.categories.map((c: any) => c.name));
        }
      })
      .catch((e) => console.error(e));
  }, []);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(articles.map((a) => a.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const executeBulkAction = async (action: 'PUBLISH' | 'UNPUBLISH' | 'ARCHIVE' | 'DELETE') => {
    if (selectedIds.length === 0) return;
    if (action === 'DELETE' && !confirm(`Are you sure you want to delete ${selectedIds.length} articles?`)) {
      return;
    }

    try {
      const res = await fetch('/api/admin/blog/posts/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, ids: selectedIds }),
      });

      if (res.ok) {
        setActionFeedback(`Bulk ${action.toLowerCase()} applied successfully.`);
        setSelectedIds([]);
        fetchArticles();
        setTimeout(() => setActionFeedback(null), 4000);
      }
    } catch (e) {
      console.error(e);
      alert('Bulk action failed');
    }
  };

  const handleDeleteOne = async (id: number, title: string) => {
    if (!confirm(`Delete article: "${title}"?`)) return;
    try {
      const res = await fetch(`/api/admin/blog/posts?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        setActionFeedback(`Article deleted.`);
        fetchArticles();
        setTimeout(() => setActionFeedback(null), 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getStatusBadge = (status: ArticleItem['status']) => {
    switch (status) {
      case 'PUBLISHED':
        return (
          <span
            style={{
              padding: '0.2rem 0.55rem',
              borderRadius: 20,
              fontSize: '0.72rem',
              fontWeight: 750,
              background: '#ecfdf5',
              color: '#059669',
              border: '1px solid #a7f3d0',
            }}
          >
            ● Published
          </span>
        );
      case 'DRAFT':
        return (
          <span
            style={{
              padding: '0.2rem 0.55rem',
              borderRadius: 20,
              fontSize: '0.72rem',
              fontWeight: 750,
              background: '#fffbeb',
              color: '#d97706',
              border: '1px solid #fde68a',
            }}
          >
            ● Draft
          </span>
        );
      case 'SCHEDULED':
        return (
          <span
            style={{
              padding: '0.2rem 0.55rem',
              borderRadius: 20,
              fontSize: '0.72rem',
              fontWeight: 750,
              background: '#f0f9ff',
              color: '#0284c7',
              border: '1px solid #bae6fd',
            }}
          >
            ● Scheduled
          </span>
        );
      case 'PENDING_REVIEW':
        return (
          <span
            style={{
              padding: '0.2rem 0.55rem',
              borderRadius: 20,
              fontSize: '0.72rem',
              fontWeight: 750,
              background: '#f5f3ff',
              color: '#7c3aed',
              border: '1px solid #ddd6fe',
            }}
          >
            ● Pending Review
          </span>
        );
      case 'ARCHIVED':
        return (
          <span
            style={{
              padding: '0.2rem 0.55rem',
              borderRadius: 20,
              fontSize: '0.72rem',
              fontWeight: 750,
              background: '#f1f5f9',
              color: '#64748b',
              border: '1px solid #cbd5e1',
            }}
          >
            ● Archived
          </span>
        );
    }
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
          <h1 className={styles.pageTitle}>All Articles ({totalCount.toLocaleString()})</h1>
          <p className={styles.pageSub}>
            Manage, edit, filter and organize published and draft articles across Tapfolio Insights.
          </p>
        </div>

        <div className={styles.headerRight}>
          <Link
            href="/admin/content/blog/create"
            className={styles.primaryBtn}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={16} /> Create Article
          </Link>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionFeedback && (
        <div
          style={{
            padding: '0.65rem 1rem',
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            borderRadius: 10,
            fontSize: '0.82rem',
            fontWeight: 650,
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <CheckCircle2 size={16} /> {actionFeedback}
        </div>
      )}

      {/* ─── Search, Filters & Bulk Action Bar ─── */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: '#ffffff',
          padding: '0.85rem 1rem',
          borderRadius: 14,
          border: '1px solid #e8eefa',
          marginBottom: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', gap: '0.75rem', flex: 1, minWidth: 260 }}>
          {/* Search Input */}
          <div style={{ position: 'relative', flex: 1 }}>
            <Search
              size={14}
              style={{ position: 'absolute', left: 10, top: 11, color: '#94a3b8' }}
            />
            <input
              type="text"
              placeholder="Search articles by title, slug or summary..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              style={{
                width: '100%',
                padding: '0.55rem 0.85rem 0.55rem 2rem',
                borderRadius: 10,
                border: '1px solid #e2e8f0',
                fontSize: '0.82rem',
                outline: 'none',
              }}
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            style={{
              padding: '0.55rem 0.85rem',
              borderRadius: 10,
              border: '1px solid #e2e8f0',
              fontSize: '0.82rem',
              background: '#fff',
              color: '#334155',
              fontWeight: 600,
            }}
          >
            <option value="ALL">All Statuses</option>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Drafts</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="PENDING_REVIEW">Pending Review</option>
            <option value="ARCHIVED">Archived</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            style={{
              padding: '0.55rem 0.85rem',
              borderRadius: 10,
              border: '1px solid #e2e8f0',
              fontSize: '0.82rem',
              background: '#fff',
              color: '#334155',
              fontWeight: 600,
            }}
          >
            <option value="ALL">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Sort Selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{
              padding: '0.55rem 0.85rem',
              borderRadius: 10,
              border: '1px solid #e2e8f0',
              fontSize: '0.82rem',
              background: '#fff',
              color: '#334155',
              fontWeight: 600,
            }}
          >
            <option value="dateDesc">Newest First</option>
            <option value="dateAsc">Oldest First</option>
            <option value="viewsDesc">Most Viewed</option>
            <option value="titleAsc">Title (A-Z)</option>
            <option value="updatedDesc">Recently Updated</option>
          </select>
        </div>

        {/* Bulk Action Controls */}
        {selectedIds.length > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#eff6ff',
              padding: '0.35rem 0.75rem',
              borderRadius: 10,
              border: '1px solid #bfdbfe',
            }}
          >
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1e40af' }}>
              {selectedIds.length} selected
            </span>
            <button
              type="button"
              onClick={() => executeBulkAction('PUBLISH')}
              className={styles.secondaryBtn}
              style={{ padding: '0.25rem 0.55rem', fontSize: '0.74rem' }}
            >
              Publish
            </button>
            <button
              type="button"
              onClick={() => executeBulkAction('UNPUBLISH')}
              className={styles.secondaryBtn}
              style={{ padding: '0.25rem 0.55rem', fontSize: '0.74rem' }}
            >
              Draft
            </button>
            <button
              type="button"
              onClick={() => executeBulkAction('ARCHIVE')}
              className={styles.secondaryBtn}
              style={{ padding: '0.25rem 0.55rem', fontSize: '0.74rem' }}
            >
              Archive
            </button>
            <button
              type="button"
              onClick={() => executeBulkAction('DELETE')}
              style={{
                padding: '0.25rem 0.55rem',
                fontSize: '0.74rem',
                background: '#fee2e2',
                color: '#b91c1c',
                border: '1px solid #fecaca',
                borderRadius: 8,
                cursor: 'pointer',
                fontWeight: 700,
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>

      {/* ─── Articles Table ─── */}
      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: 36 }}>
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={articles.length > 0 && selectedIds.length === articles.length}
                  style={{ accentColor: '#0052ff', width: 15, height: 15 }}
                />
              </th>
              <th>ARTICLE</th>
              <th>CATEGORY</th>
              <th>AUTHOR</th>
              <th>STATUS</th>
              <th>VIEWS</th>
              <th>DATE</th>
              <th style={{ textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                  Loading articles from database...
                </td>
              </tr>
            ) : articles.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                  No articles matched your criteria.
                </td>
              </tr>
            ) : (
              articles.map((article) => {
                const isSelected = selectedIds.includes(article.id);
                return (
                  <tr
                    key={article.id}
                    style={{ background: isSelected ? '#f8faff' : undefined }}
                  >
                    <td>
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectOne(article.id)}
                        style={{ accentColor: '#0052ff', width: 15, height: 15 }}
                      />
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        {/* Featured Image Thumbnail */}
                        <div
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: 8,
                            background: '#f1f5f9',
                            overflow: 'hidden',
                            flexShrink: 0,
                            border: '1px solid #e2e8f0',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {article.featuredImage ? (
                            <img
                              src={article.featuredImage}
                              alt=""
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          ) : (
                            <FileText size={18} color="#94a3b8" />
                          )}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <Link
                            href={`/admin/content/blog/create?id=${article.id}`}
                            style={{
                              fontWeight: 700,
                              color: '#0f172a',
                              fontSize: '0.86rem',
                              textDecoration: 'none',
                            }}
                          >
                            {article.title}
                          </Link>
                          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                            /blog/{article.slug}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          background: '#f1f5f9',
                          color: '#475569',
                          padding: '0.2rem 0.5rem',
                          borderRadius: 6,
                        }}
                      >
                        {article.categoryName || 'General'}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: '#334155', fontWeight: 600 }}>
                      {article.authorName || 'Tapfolio Team'}
                    </td>
                    <td>{getStatusBadge(article.status)}</td>
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
                        <Eye size={13} /> {article.views.toLocaleString()}
                      </span>
                    </td>
                    <td style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      {article.publishedAt
                        ? new Date(article.publishedAt).toLocaleDateString('en-GB')
                        : '—'}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                        }}
                      >
                        <Link
                          href={`/admin/content/blog/create?id=${article.id}`}
                          className={styles.secondaryBtn}
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.76rem' }}
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/blog/${article.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.secondaryBtn}
                          style={{ padding: '0.35rem 0.55rem', fontSize: '0.76rem' }}
                          title="Open public view"
                        >
                          <ExternalLink size={13} />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDeleteOne(article.id, article.title)}
                          className={styles.secondaryBtn}
                          style={{ padding: '0.35rem 0.55rem', color: '#ef4444' }}
                          title="Delete article"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* ─── Pagination Footer ─── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem',
            borderTop: '1px solid #f1f5f9',
          }}
        >
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Showing {articles.length} of {totalCount} articles
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
              className={styles.secondaryBtn}
              style={{
                padding: '0.35rem 0.65rem',
                opacity: page <= 1 ? 0.5 : 1,
                cursor: page <= 1 ? 'not-allowed' : 'pointer',
              }}
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155' }}>
              Page {page} of {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
              className={styles.secondaryBtn}
              style={{
                padding: '0.35rem 0.65rem',
                opacity: page >= totalPages ? 0.5 : 1,
                cursor: page >= totalPages ? 'not-allowed' : 'pointer',
              }}
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
