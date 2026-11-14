'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Layers,
  CheckCircle2,
  AlertCircle,
  Flag,
  Plus,
  Search,
  Filter,
  Calendar,
  MapPin,
  ExternalLink,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Eye,
  ShieldCheck,
  ShieldAlert,
  Trash2,
  X,
  Compass,
  Radio,
  Sparkles,
  Check,
  FileText,
  User,
  Globe,
  Share2,
} from 'lucide-react';
import styles from '../dashboard/dashboard.module.css';

interface PortfolioItem {
  id: number;
  name: string;
  description: string;
  username: string;
  thumbnail: string;
  ownerName: string;
  ownerAvatar: string;
  ownerEmail: string;
  category: string;
  status: 'Published' | 'Pending' | 'Reported' | 'Draft';
  tapCount: number;
  location: string;
  joinedDate: string;
  isPremium: boolean;
  projectsCount: number;
  moderationNotes?: string;
}

interface PortfolioMetrics {
  totalPortfolios: number;
  publishedPortfolios: number;
  pendingPortfolios: number;
  reportedPortfolios: number;
}

export default function PortfolioManagementPage() {
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [metrics, setMetrics] = useState<PortfolioMetrics>({
    totalPortfolios: 61,
    publishedPortfolios: 58,
    pendingPortfolios: 3,
    reportedPortfolios: 2,
  });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [userFilter, setUserFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState('30D');
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(8);
  const [totalCount, setTotalCount] = useState(61);
  const [loading, setLoading] = useState(true);

  // Contextual menu & Modals state
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [selectedPortfolio, setSelectedPortfolio] = useState<PortfolioItem | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  // New portfolio form state
  const [newPortfolioForm, setNewPortfolioForm] = useState({
    name: '',
    username: '',
    description: '',
    category: 'Creative Studio',
    location: 'Kochi, Kerala',
    isPremium: false,
    thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&auto=format&fit=crop&q=80',
  });

  const fetchPortfolios = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        status: statusFilter,
        category: categoryFilter,
        userType: userFilter,
        page: String(page),
        limit: String(rowsPerPage),
      });

      const res = await fetch(`/api/admin/portfolios?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setPortfolios(data.portfolios || []);
        setTotalCount(data.total || 61);
        setTotalPages(data.totalPages || 8);
        if (data.metrics) {
          setMetrics(data.metrics);
        }
      }
    } catch (e) {
      console.error('Failed to load portfolios', e);
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter, categoryFilter, userFilter, page, rowsPerPage]);

  useEffect(() => {
    fetchPortfolios();
  }, [fetchPortfolios]);

  // Moderation action handler
  const handleModeration = async (action: 'APPROVE' | 'UNPUBLISH' | 'REPORT' | 'DELETE', portfolio: PortfolioItem) => {
    setActiveMenuId(null);
    if (action === 'DELETE' && !confirm(`Are you sure you want to delete portfolio @${portfolio.username}?`)) {
      return;
    }

    try {
      const res = await fetch('/api/admin/portfolios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, portfolioId: portfolio.id, username: portfolio.username }),
      });
      if (res.ok) {
        setActionFeedback(`Portfolio @${portfolio.username} updated: ${action}`);
        setTimeout(() => setActionFeedback(null), 3000);
        if (selectedPortfolio && selectedPortfolio.id === portfolio.id) {
          if (action === 'DELETE') {
            setSelectedPortfolio(null);
          } else {
            setSelectedPortfolio({
              ...selectedPortfolio,
              status: action === 'APPROVE' ? 'Published' : action === 'UNPUBLISH' ? 'Draft' : 'Reported',
            });
          }
        }
        fetchPortfolios();
      }
    } catch (err) {
      console.error('Moderation action failed', err);
    }
  };

  // Create portfolio handler
  const handleCreatePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPortfolioForm.name || !newPortfolioForm.username) return;

    try {
      const res = await fetch('/api/admin/portfolios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CREATE_PORTFOLIO',
          data: newPortfolioForm,
        }),
      });
      if (res.ok) {
        setShowCreateModal(false);
        setActionFeedback(`Created portfolio @${newPortfolioForm.username}`);
        setTimeout(() => setActionFeedback(null), 3000);
        setNewPortfolioForm({
          name: '',
          username: '',
          description: '',
          category: 'Creative Studio',
          location: 'Kochi, Kerala',
          isPremium: false,
          thumbnail: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=300&auto=format&fit=crop&q=80',
        });
        fetchPortfolios();
      }
    } catch (err) {
      console.error('Create portfolio failed', err);
    }
  };

  return (
    <div className={styles.page}>
      {/* ─── Page Header ─── */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Portfolio Management</h1>
          <p className={styles.pageSub}>Manage and moderate published portfolios across Tapfolio</p>
        </div>

        <div className={styles.headerRight}>
          {actionFeedback && (
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 750,
                color: '#059669',
                background: '#ecfdf5',
                padding: '0.4rem 0.85rem',
                borderRadius: 8,
                border: '1px solid #a7f3d0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <CheckCircle2 size={15} /> {actionFeedback}
            </span>
          )}

          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className={styles.primaryBtn}
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <Plus size={16} /> Create Portfolio
          </button>
        </div>
      </div>

      {/* ─── Top 4 KPI Overview Cards (Matching reference UI) ─── */}
      <div className={styles.topMetricsGrid}>
        {/* Card 1: Total Portfolios */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricIcon} style={{ background: '#edf3ff', color: '#0052ff' }}>
              <Layers size={20} />
            </div>
            <span className={styles.metricLabel}>Total Portfolios</span>
          </div>
          <div className={styles.metricBody}>
            <div>
              <div className={styles.metricValue}>{metrics.totalPortfolios}</div>
              <div className={styles.metricTrend} style={{ color: '#059669' }}>
                <span>↑ +12%</span>
                <span style={{ color: '#94a3b8', fontWeight: 500 }}>vs last month</span>
              </div>
            </div>
            <svg className={styles.metricChart} viewBox="0 0 85 38" fill="none">
              <path
                d="M 0 32 Q 25 24, 50 14 T 85 6"
                stroke="#0052ff"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M 0 32 Q 25 24, 50 14 T 85 6 L 85 38 L 0 38 Z"
                fill="#edf3ff"
                opacity="0.8"
              />
            </svg>
          </div>
        </div>

        {/* Card 2: Published */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricIcon} style={{ background: '#ecfdf5', color: '#10b981' }}>
              <CheckCircle2 size={20} />
            </div>
            <span className={styles.metricLabel}>Published</span>
          </div>
          <div className={styles.metricBody}>
            <div>
              <div className={styles.metricValue}>{metrics.publishedPortfolios}</div>
              <div className={styles.metricTrend} style={{ color: '#059669' }}>
                <span>↑ +8%</span>
                <span style={{ color: '#94a3b8', fontWeight: 500 }}>live online</span>
              </div>
            </div>
            <svg className={styles.metricChart} viewBox="0 0 85 38" fill="none">
              <path
                d="M 0 34 Q 25 18, 50 22 T 85 8"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M 0 34 Q 25 18, 50 22 T 85 8 L 85 38 L 0 38 Z"
                fill="#ecfdf5"
                opacity="0.8"
              />
            </svg>
          </div>
        </div>

        {/* Card 3: Pending Review */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricIcon} style={{ background: '#fffbeb', color: '#f59e0b' }}>
              <AlertCircle size={20} />
            </div>
            <span className={styles.metricLabel}>Pending Review</span>
          </div>
          <div className={styles.metricBody}>
            <div>
              <div className={styles.metricValue}>{metrics.pendingPortfolios}</div>
              <div className={styles.metricTrend} style={{ color: '#ef4444' }}>
                <span>↓ -25%</span>
                <span style={{ color: '#94a3b8', fontWeight: 500 }}>queue size</span>
              </div>
            </div>
            <svg className={styles.metricChart} viewBox="0 0 85 38" fill="none">
              <path
                d="M 0 24 Q 25 32, 55 20 T 85 12"
                stroke="#f59e0b"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M 0 24 Q 25 32, 55 20 T 85 12 L 85 38 L 0 38 Z"
                fill="#fffbeb"
                opacity="0.8"
              />
            </svg>
          </div>
        </div>

        {/* Card 4: Reported */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricIcon} style={{ background: '#faf5ff', color: '#a855f7' }}>
              <Flag size={20} />
            </div>
            <span className={styles.metricLabel}>Reported</span>
          </div>
          <div className={styles.metricBody}>
            <div>
              <div className={styles.metricValue}>{metrics.reportedPortfolios}</div>
              <div className={styles.metricTrend} style={{ color: '#ef4444' }}>
                <span>↓ -33%</span>
                <span style={{ color: '#94a3b8', fontWeight: 500 }}>flagged items</span>
              </div>
            </div>
            <svg className={styles.metricChart} viewBox="0 0 85 38" fill="none">
              <path
                d="M 0 30 Q 25 22, 50 18 T 85 8"
                stroke="#a855f7"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M 0 30 Q 25 22, 50 18 T 85 8 L 85 38 L 0 38 Z"
                fill="#faf5ff"
                opacity="0.8"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* ─── Search & Filter Bar (White Pill Panel Card) ─── */}
      <div
        className={styles.panelCard}
        style={{
          padding: '0.85rem 1.25rem',
          marginBottom: '1.25rem',
          borderRadius: 14,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.85rem',
          }}
        >
          {/* Search Input */}
          <div style={{ position: 'relative', flex: 1, minWidth: 260, maxWidth: 420 }}>
            <Search
              size={16}
              style={{ position: 'absolute', left: 12, top: 11, color: '#94a3b8' }}
            />
            <input
              type="text"
              placeholder="Search portfolios by name or username..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              style={{
                width: '100%',
                padding: '0.55rem 0.85rem 0.55rem 2.3rem',
                borderRadius: 10,
                border: '1px solid #e2e8f0',
                fontSize: '0.85rem',
                outline: 'none',
                background: '#ffffff',
                color: '#0f172a',
              }}
            />
          </div>

          {/* Filter Dropdowns */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              style={{
                padding: '0.55rem 0.95rem',
                borderRadius: 10,
                border: '1px solid #e2e8f0',
                fontSize: '0.82rem',
                fontWeight: 650,
                color: '#334155',
                background: '#ffffff',
                cursor: 'pointer',
              }}
            >
              <option value="ALL">All Status</option>
              <option value="Published">Published</option>
              <option value="Pending">Pending Review</option>
              <option value="Reported">Reported</option>
              <option value="Draft">Draft</option>
            </select>

            <select
              value={userFilter}
              onChange={(e) => {
                setUserFilter(e.target.value);
                setPage(1);
              }}
              style={{
                padding: '0.55rem 0.95rem',
                borderRadius: 10,
                border: '1px solid #e2e8f0',
                fontSize: '0.82rem',
                fontWeight: 650,
                color: '#334155',
                background: '#ffffff',
                cursor: 'pointer',
              }}
            >
              <option value="ALL">All Users</option>
              <option value="PREMIUM">Premium Users</option>
              <option value="FREE">Free Tier</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              style={{
                padding: '0.55rem 0.95rem',
                borderRadius: 10,
                border: '1px solid #e2e8f0',
                fontSize: '0.82rem',
                fontWeight: 650,
                color: '#334155',
                background: '#ffffff',
                cursor: 'pointer',
              }}
            >
              <option value="ALL">All Categories</option>
              <option value="Creative Studio">Creative Studio</option>
              <option value="Developer Portfolio">Developer Portfolio</option>
              <option value="Medical Portfolio">Medical Portfolio</option>
              <option value="Designer Portfolio">Designer Portfolio</option>
              <option value="College Profile">College Profile</option>
              <option value="Print & Design">Print & Design</option>
              <option value="Software Solutions">Software Solutions</option>
            </select>

            {/* Date Range Selector */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              style={{
                padding: '0.55rem 0.95rem',
                borderRadius: 10,
                border: '1px solid #e2e8f0',
                fontSize: '0.82rem',
                fontWeight: 650,
                color: '#334155',
                background: '#ffffff',
                cursor: 'pointer',
              }}
            >
              <option value="7D">Last 7 Days</option>
              <option value="30D">Last 30 Days</option>
              <option value="90D">Last 90 Days</option>
              <option value="1Y">This Year</option>
            </select>

            {/* Filter Action Button */}
            <button
              type="button"
              onClick={fetchPortfolios}
              className={styles.secondaryBtn}
              style={{ padding: '0.55rem 0.95rem', fontSize: '0.82rem' }}
            >
              <Filter size={14} color="#0052ff" /> Filter
            </button>
          </div>
        </div>
      </div>

      {/* ─── Portfolios Data Table ─── */}
      <div className={styles.tableCard}>
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>PORTFOLIO</th>
                <th>USER</th>
                <th>STATUS</th>
                <th>TAPS</th>
                <th>LOCATION</th>
                <th>JOINED</th>
                <th style={{ textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                /* Shimmer loading skeleton */
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={7} style={{ padding: '1.25rem', textAlign: 'center', color: '#94a3b8' }}>
                      <div
                        style={{
                          height: 28,
                          background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
                          backgroundSize: '200% 100%',
                          borderRadius: 8,
                          animation: 'pulse 1.5s infinite',
                        }}
                      />
                    </td>
                  </tr>
                ))
              ) : portfolios.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3.5rem', color: '#94a3b8' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: '50%',
                          background: '#edf3ff',
                          color: '#0052ff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Layers size={24} />
                      </div>
                      <div style={{ fontWeight: 750, color: '#0f172a', fontSize: '0.95rem' }}>
                        No Portfolios Found
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', maxWidth: 360 }}>
                        No portfolio records matched the active search filters. Try adjusting your search query or reset status filters.
                      </div>
                    </div>
                  </td>
                </tr>
              ) : (
                portfolios.map((portfolio) => {
                  return (
                    <tr
                      key={portfolio.id}
                      onClick={() => setSelectedPortfolio(portfolio)}
                      style={{ cursor: 'pointer', position: 'relative' }}
                    >
                      {/* PORTFOLIO Column (Thumbnail + Name + Description) */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          <img
                            src={portfolio.thumbnail}
                            alt={portfolio.name}
                            style={{
                              width: 46,
                              height: 38,
                              borderRadius: 8,
                              objectFit: 'cover',
                              flexShrink: 0,
                              border: '1px solid #e2e8f0',
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.88rem' }}>
                              {portfolio.name}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '0.1rem' }}>
                              {portfolio.description}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* USER Column (Avatar + Name + @username) */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <img
                            src={portfolio.ownerAvatar}
                            alt={portfolio.ownerName}
                            style={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              objectFit: 'cover',
                              flexShrink: 0,
                              border: '1px solid #edf3ff',
                            }}
                          />
                          <div>
                            <div style={{ fontWeight: 750, color: '#0f172a', fontSize: '0.82rem' }}>
                              {portfolio.ownerName}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                              @{portfolio.username}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* STATUS Column */}
                      <td>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.25rem 0.65rem',
                            borderRadius: 6,
                            fontSize: '0.74rem',
                            fontWeight: 800,
                            background:
                              portfolio.status === 'Published'
                                ? '#ecfdf5'
                                : portfolio.status === 'Pending'
                                ? '#eff6ff'
                                : portfolio.status === 'Reported'
                                ? '#fee2e2'
                                : '#f1f5f9',
                            color:
                              portfolio.status === 'Published'
                                ? '#10b981'
                                : portfolio.status === 'Pending'
                                ? '#0284c7'
                                : portfolio.status === 'Reported'
                                ? '#dc2626'
                                : '#64748b',
                          }}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              background:
                                portfolio.status === 'Published'
                                  ? '#10b981'
                                  : portfolio.status === 'Pending'
                                  ? '#0284c7'
                                  : portfolio.status === 'Reported'
                                  ? '#dc2626'
                                  : '#64748b',
                            }}
                          />
                          {portfolio.status}
                        </span>
                      </td>

                      {/* TAPS Column */}
                      <td>
                        <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.88rem' }}>
                          {portfolio.tapCount}
                        </span>
                      </td>

                      {/* LOCATION Column */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem', color: '#334155', fontWeight: 600 }}>
                          <MapPin size={13} color="#64748b" /> {portfolio.location}
                        </div>
                      </td>

                      {/* JOINED Column */}
                      <td>
                        <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 550 }}>
                          {portfolio.joinedDate}
                        </span>
                      </td>

                      {/* ACTIONS Column */}
                      <td style={{ textAlign: 'right' }}>
                        <div
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', position: 'relative' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => setSelectedPortfolio(portfolio)}
                            className={styles.secondaryBtn}
                            style={{
                              padding: '0.3rem 0.75rem',
                              fontSize: '0.75rem',
                              fontWeight: 750,
                              color: '#0052ff',
                            }}
                          >
                            View
                          </button>

                          {/* 3-dots Context Menu Button */}
                          <button
                            type="button"
                            onClick={() =>
                              setActiveMenuId(activeMenuId === portfolio.id ? null : portfolio.id)
                            }
                            style={{
                              background: 'none',
                              border: '1px solid #e2e8f0',
                              borderRadius: 8,
                              padding: '0.35rem 0.45rem',
                              color: '#64748b',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <MoreVertical size={14} />
                          </button>

                          {/* Dropdown Menu */}
                          {activeMenuId === portfolio.id && (
                            <div
                              style={{
                                position: 'absolute',
                                right: 0,
                                top: '100%',
                                marginTop: '0.35rem',
                                background: '#ffffff',
                                border: '1px solid #e2e8f0',
                                borderRadius: 10,
                                boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
                                zIndex: 50,
                                minWidth: 175,
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                textAlign: 'left',
                              }}
                            >
                              <a
                                href={`https://tapfolio.me/${portfolio.username}`}
                                target="_blank"
                                rel="noreferrer"
                                style={{
                                  padding: '0.55rem 0.85rem',
                                  fontSize: '0.78rem',
                                  fontWeight: 650,
                                  color: '#334155',
                                  textDecoration: 'none',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.45rem',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                              >
                                <ExternalLink size={13} color="#0052ff" /> Open Public Card
                              </a>

                              <button
                                type="button"
                                onClick={() => handleModeration('APPROVE', portfolio)}
                                style={{
                                  padding: '0.55rem 0.85rem',
                                  fontSize: '0.78rem',
                                  fontWeight: 650,
                                  color: '#059669',
                                  background: 'none',
                                  border: 'none',
                                  textAlign: 'left',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.45rem',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = '#ecfdf5')}
                                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                              >
                                <ShieldCheck size={13} color="#059669" /> Approve & Publish
                              </button>

                              <button
                                type="button"
                                onClick={() => handleModeration('UNPUBLISH', portfolio)}
                                style={{
                                  padding: '0.55rem 0.85rem',
                                  fontSize: '0.78rem',
                                  fontWeight: 650,
                                  color: '#b45309',
                                  background: 'none',
                                  border: 'none',
                                  textAlign: 'left',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.45rem',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = '#fffbeb')}
                                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                              >
                                <AlertCircle size={13} color="#f59e0b" /> Unpublish to Draft
                              </button>

                              <button
                                type="button"
                                onClick={() => handleModeration('REPORT', portfolio)}
                                style={{
                                  padding: '0.55rem 0.85rem',
                                  fontSize: '0.78rem',
                                  fontWeight: 650,
                                  color: '#a855f7',
                                  background: 'none',
                                  border: 'none',
                                  textAlign: 'left',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.45rem',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = '#faf5ff')}
                                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                              >
                                <Flag size={13} color="#a855f7" /> Flag as Reported
                              </button>

                              <div style={{ height: 1, background: '#f1f5f9', margin: '0.2rem 0' }} />

                              <button
                                type="button"
                                onClick={() => handleModeration('DELETE', portfolio)}
                                style={{
                                  padding: '0.55rem 0.85rem',
                                  fontSize: '0.78rem',
                                  fontWeight: 650,
                                  color: '#ef4444',
                                  background: 'none',
                                  border: 'none',
                                  textAlign: 'left',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.45rem',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = '#fee2e2')}
                                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                              >
                                <Trash2 size={13} color="#ef4444" /> Delete Portfolio
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* ─── Footer Pagination (Exact Match) ─── */}
        <div
          style={{
            padding: '1rem 1.4rem',
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          {/* Showing Count */}
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
            Showing 1-{portfolios.length} of {totalCount} portfolios
          </span>

          {/* Rows Per Page & Pagination Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
              <span>Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setPage(1);
                }}
                style={{
                  padding: '0.35rem 0.65rem',
                  borderRadius: 6,
                  border: '1px solid #e2e8f0',
                  fontSize: '0.8rem',
                  fontWeight: 650,
                  background: '#ffffff',
                  color: '#334155',
                }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              {/* Prev */}
              <button
                type="button"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page <= 1}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                  color: page <= 1 ? '#cbd5e1' : '#334155',
                  cursor: page <= 1 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ChevronLeft size={16} />
              </button>

              {/* Page 1 */}
              <button
                type="button"
                onClick={() => setPage(1)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: page === 1 ? '1px solid #0052ff' : '1px solid #e2e8f0',
                  background: page === 1 ? '#0052ff' : '#ffffff',
                  color: page === 1 ? '#ffffff' : '#334155',
                  fontSize: '0.82rem',
                  fontWeight: 750,
                  cursor: 'pointer',
                }}
              >
                1
              </button>

              {/* Page 2 */}
              <button
                type="button"
                onClick={() => setPage(2)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: page === 2 ? '1px solid #0052ff' : '1px solid #e2e8f0',
                  background: page === 2 ? '#0052ff' : '#ffffff',
                  color: page === 2 ? '#ffffff' : '#334155',
                  fontSize: '0.82rem',
                  fontWeight: 750,
                  cursor: 'pointer',
                }}
              >
                2
              </button>

              {/* Page 3 */}
              <button
                type="button"
                onClick={() => setPage(3)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: page === 3 ? '1px solid #0052ff' : '1px solid #e2e8f0',
                  background: page === 3 ? '#0052ff' : '#ffffff',
                  color: page === 3 ? '#ffffff' : '#334155',
                  fontSize: '0.82rem',
                  fontWeight: 750,
                  cursor: 'pointer',
                }}
              >
                3
              </button>

              <span style={{ padding: '0 0.25rem', color: '#94a3b8', fontSize: '0.82rem' }}>...</span>

              {/* Page 8 */}
              <button
                type="button"
                onClick={() => setPage(8)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: page === 8 ? '1px solid #0052ff' : '1px solid #e2e8f0',
                  background: page === 8 ? '#0052ff' : '#ffffff',
                  color: page === 8 ? '#ffffff' : '#334155',
                  fontSize: '0.82rem',
                  fontWeight: 750,
                  cursor: 'pointer',
                }}
              >
                8
              </button>

              {/* Next */}
              <button
                type="button"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                  background: '#ffffff',
                  color: page >= totalPages ? '#cbd5e1' : '#334155',
                  cursor: page >= totalPages ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Portfolio Detail Inspection Modal (Requirements 11 & 12) ─── */}
      {selectedPortfolio && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1.25rem',
          }}
          onClick={() => setSelectedPortfolio(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 18,
              width: '100%',
              maxWidth: 720,
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px rgba(0, 82, 255, 0.14)',
              border: '1px solid #e2e8f0',
              padding: '1.75rem',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <img
                  src={selectedPortfolio.thumbnail}
                  alt={selectedPortfolio.name}
                  style={{
                    width: 64,
                    height: 52,
                    borderRadius: 12,
                    objectFit: 'cover',
                    border: '1px solid #e2e8f0',
                  }}
                />
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 850, margin: 0, color: '#0f172a' }}>
                      {selectedPortfolio.name}
                    </h2>
                    <span
                      style={{
                        padding: '0.2rem 0.55rem',
                        borderRadius: 6,
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        background: selectedPortfolio.status === 'Published' ? '#ecfdf5' : '#eff6ff',
                        color: selectedPortfolio.status === 'Published' ? '#10b981' : '#0284c7',
                      }}
                    >
                      {selectedPortfolio.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.25rem' }}>
                    {selectedPortfolio.description} · Category:{' '}
                    <strong style={{ color: '#0052ff' }}>{selectedPortfolio.category}</strong>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedPortfolio(null)}
                style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.4rem' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Quick Stats Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '0.75rem',
                background: '#f8fafc',
                borderRadius: 12,
                padding: '1rem',
                marginBottom: '1.5rem',
                border: '1px solid #e2e8f0',
                textAlign: 'center',
              }}
            >
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                  NFC Taps
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0052ff', marginTop: '0.2rem' }}>
                  {selectedPortfolio.tapCount}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                  Projects Live
                </div>
                <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', marginTop: '0.2rem' }}>
                  {selectedPortfolio.projectsCount}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                  Account Tier
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: selectedPortfolio.isPremium ? '#a855f7' : '#475569', marginTop: '0.2rem' }}>
                  {selectedPortfolio.isPremium ? 'PREMIUM' : 'FREE'}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                  Location
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 750, color: '#0f172a', marginTop: '0.35rem' }}>
                  {selectedPortfolio.location}
                </div>
              </div>
            </div>

            {/* Owner & Route Information */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '1rem' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                  Portfolio Owner
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <img
                    src={selectedPortfolio.ownerAvatar}
                    alt={selectedPortfolio.ownerName}
                    style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>
                      {selectedPortfolio.ownerName}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      {selectedPortfolio.ownerEmail}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '1rem' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
                  Public Web Route
                </div>
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 750, color: '#0052ff' }}>
                    https://tapfolio.me/{selectedPortfolio.username}
                  </div>
                  <a
                    href={`https://tapfolio.me/${selectedPortfolio.username}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#0052ff',
                      marginTop: '0.35rem',
                      textDecoration: 'none',
                    }}
                  >
                    Open Live Web Preview <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </div>

            {/* Moderation Actions Bar */}
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.65rem' }}>
                Administrative Moderation Actions
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', gap: '0.65rem' }}>
                  <button
                    type="button"
                    onClick={() => handleModeration('APPROVE', selectedPortfolio)}
                    style={{
                      background: '#ecfdf5',
                      color: '#059669',
                      border: '1px solid #a7f3d0',
                      borderRadius: 8,
                      padding: '0.5rem 0.95rem',
                      fontSize: '0.8rem',
                      fontWeight: 750,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <ShieldCheck size={14} /> Approve & Publish
                  </button>

                  <button
                    type="button"
                    onClick={() => handleModeration('UNPUBLISH', selectedPortfolio)}
                    style={{
                      background: '#fffbeb',
                      color: '#b45309',
                      border: '1px solid #fde68a',
                      borderRadius: 8,
                      padding: '0.5rem 0.95rem',
                      fontSize: '0.8rem',
                      fontWeight: 750,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <AlertCircle size={14} /> Unpublish to Draft
                  </button>

                  <button
                    type="button"
                    onClick={() => handleModeration('REPORT', selectedPortfolio)}
                    style={{
                      background: '#faf5ff',
                      color: '#a855f7',
                      border: '1px solid #e9d5ff',
                      borderRadius: 8,
                      padding: '0.5rem 0.95rem',
                      fontSize: '0.8rem',
                      fontWeight: 750,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    <Flag size={14} /> Flag as Reported
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleModeration('DELETE', selectedPortfolio)}
                  style={{
                    background: '#ffffff',
                    color: '#ef4444',
                    border: '1px solid #fecaca',
                    borderRadius: 8,
                    padding: '0.5rem 0.95rem',
                    fontSize: '0.8rem',
                    fontWeight: 750,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Create Portfolio Modal (Requirement 8) ─── */}
      {showCreateModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1.25rem',
          }}
          onClick={() => setShowCreateModal(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 18,
              width: '100%',
              maxWidth: 520,
              padding: '1.75rem',
              boxShadow: '0 25px 50px rgba(0, 82, 255, 0.14)',
              border: '1px solid #e2e8f0',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '1.25rem', fontWeight: 850, margin: '0 0 1rem 0', color: '#0f172a' }}>
              Create New Portfolio
            </h2>

            <form onSubmit={handleCreatePortfolio} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                  Portfolio Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Studio Portfolio"
                  value={newPortfolioForm.name}
                  onChange={(e) => setNewPortfolioForm({ ...newPortfolioForm, name: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 8, border: '1px solid #e2e8f0', marginTop: '0.25rem', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                  Username / Handle
                </label>
                <div style={{ position: 'relative', marginTop: '0.25rem' }}>
                  <span style={{ position: 'absolute', left: 10, top: 10, color: '#94a3b8', fontWeight: 700 }}>@</span>
                  <input
                    type="text"
                    required
                    placeholder="handle"
                    value={newPortfolioForm.username}
                    onChange={(e) =>
                      setNewPortfolioForm({ ...newPortfolioForm, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })
                    }
                    style={{ width: '100%', padding: '0.6rem 0.85rem 0.6rem 1.8rem', borderRadius: 8, border: '1px solid #e2e8f0', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                  Tagline / Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Modern creative design studio"
                  value={newPortfolioForm.description}
                  onChange={(e) => setNewPortfolioForm({ ...newPortfolioForm, description: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 8, border: '1px solid #e2e8f0', marginTop: '0.25rem', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                    Category
                  </label>
                  <select
                    value={newPortfolioForm.category}
                    onChange={(e) => setNewPortfolioForm({ ...newPortfolioForm, category: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 8, border: '1px solid #e2e8f0', marginTop: '0.25rem', fontSize: '0.85rem', background: '#fff' }}
                  >
                    <option value="Creative Studio">Creative Studio</option>
                    <option value="Developer Portfolio">Developer Portfolio</option>
                    <option value="Medical Portfolio">Medical Portfolio</option>
                    <option value="Designer Portfolio">Designer Portfolio</option>
                    <option value="College Profile">College Profile</option>
                    <option value="Print & Design">Print & Design</option>
                    <option value="Software Solutions">Software Solutions</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                    Location
                  </label>
                  <input
                    type="text"
                    value={newPortfolioForm.location}
                    onChange={(e) => setNewPortfolioForm({ ...newPortfolioForm, location: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 8, border: '1px solid #e2e8f0', marginTop: '0.25rem', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                <input
                  type="checkbox"
                  id="premiumCheck"
                  checked={newPortfolioForm.isPremium}
                  onChange={(e) => setNewPortfolioForm({ ...newPortfolioForm, isPremium: e.target.checked })}
                  style={{ width: 16, height: 16, accentColor: '#0052ff' }}
                />
                <label htmlFor="premiumCheck" style={{ fontSize: '0.85rem', fontWeight: 650, color: '#334155' }}>
                  Enable Tapfolio Pro Features & Custom Themes
                </label>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className={styles.secondaryBtn}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.primaryBtn}>
                  Create & Publish Portfolio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
