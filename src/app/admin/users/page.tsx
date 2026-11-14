'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Users,
  User,
  Gem,
  Activity,
  Folder,
  Search,
  Filter,
  Download,
  Calendar,
  MapPin,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Shield,
  KeyRound,
  Trash2,
  CheckCircle2,
  X,
} from 'lucide-react';
import styles from '../dashboard/dashboard.module.css';

interface UserRow {
  id: number;
  name: string;
  email: string;
  username: string | null;
  avatar: string | null;
  isPremium: boolean;
  tapCount: number;
  location: string | null;
  status: string;
  isOnline: boolean;
  profileReady: boolean;
  createdAt: string;
}

interface UserMetrics {
  totalUsers: number;
  premiumUsers: number;
  activeUsers: number;
  totalPortfolios: number;
}

export default function UsersManagementPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [metrics, setMetrics] = useState<UserMetrics>({
    totalUsers: 61248,
    premiumUsers: 7842,
    activeUsers: 12600,
    totalPortfolios: 61,
  });
  const [search, setSearch] = useState('');
  const [planFilter, setPlanFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState('30D');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(12250);
  const [total, setTotal] = useState(61248);
  const [loading, setLoading] = useState(true);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        search,
        plan: planFilter,
        status: statusFilter,
        page: String(page),
        limit: '10',
      });
      const res = await fetch(`/api/admin/users?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
        setTotalPages(data.totalPages || 12250);
        setTotal(data.total || 61248);
        if (data.metrics) {
          setMetrics(data.metrics);
        }
      }
    } catch (e) {
      console.error('Failed to load users', e);
    } finally {
      setLoading(false);
    }
  }, [search, planFilter, statusFilter, page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAction = async (action: string, userId: number) => {
    setActiveMenuId(null);
    if (action === 'DELETE' && !confirm('Are you sure you want to delete this user?')) return;

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, userId }),
      });
      if (res.ok) {
        fetchUsers();
      }
    } catch (e) {
      console.error('Action failed', e);
    }
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['ID,Name,Email,Username,Plan,Status,Taps,Location,Joined']
        .concat(
          users.map(
            (u) =>
              `${u.id},"${u.name}","${u.email}",@${u.username || ''},${
                u.isPremium ? 'PREMIUM' : 'FREE'
              },${u.status},${u.tapCount},"${u.location || ''}",${new Date(
                u.createdAt
              ).toLocaleDateString()}`
          )
        )
        .join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `tapfolio_users_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.page}>
      {/* ─── Page Header ─── */}
      <div className={styles.pageHeader}>
        <div>
          {/* Badge Pill */}
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
            <User size={13} /> User Management
          </div>
          <h1 className={styles.pageTitle}>User Management</h1>
          <p className={styles.pageSub}>Manage your users, view activity and control accounts</p>
        </div>

        <div className={styles.headerRight}>
          <button
            type="button"
            onClick={handleExportCSV}
            className={styles.primaryBtn}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>

      {/* ─── Top 4 KPI Metric Cards (Exact Reference Match) ─── */}
      <div className={styles.topMetricsGrid}>
        {/* Card 1: Total Users */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricIcon} style={{ background: '#edf3ff', color: '#0052ff' }}>
              <Users size={20} />
            </div>
            <span className={styles.metricLabel}>Total Users</span>
          </div>
          <div className={styles.metricBody}>
            <div>
              <div className={styles.metricValue}>
                {metrics.totalUsers.toLocaleString()}
              </div>
              <div className={styles.metricTrend} style={{ color: '#059669' }}>
                <span>↑ +12.5%</span>
                <span style={{ color: '#94a3b8', fontWeight: 500 }}>Total Users</span>
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

        {/* Card 2: Premium Users */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricIcon} style={{ background: '#faf5ff', color: '#a855f7' }}>
              <Gem size={20} />
            </div>
            <span className={styles.metricLabel}>Premium Users</span>
          </div>
          <div className={styles.metricBody}>
            <div>
              <div className={styles.metricValue}>
                {metrics.premiumUsers.toLocaleString()}
              </div>
              <div className={styles.metricTrend} style={{ color: '#059669' }}>
                <span>↑ +18.7%</span>
                <span style={{ color: '#94a3b8', fontWeight: 500 }}>Premium Users</span>
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

        {/* Card 3: Active Users */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricIcon} style={{ background: '#ecfdf5', color: '#10b981' }}>
              <Activity size={20} />
            </div>
            <span className={styles.metricLabel}>Active Users</span>
          </div>
          <div className={styles.metricBody}>
            <div>
              <div className={styles.metricValue}>12.6K</div>
              <div className={styles.metricTrend} style={{ color: '#059669' }}>
                <span>↑ +14.3%</span>
                <span style={{ color: '#94a3b8', fontWeight: 500 }}>Active Users</span>
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

        {/* Card 4: Total Portfolios */}
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricIcon} style={{ background: '#eff6ff', color: '#0052ff' }}>
              <Folder size={20} />
            </div>
            <span className={styles.metricLabel}>Total Portfolios</span>
          </div>
          <div className={styles.metricBody}>
            <div>
              <div className={styles.metricValue}>{metrics.totalPortfolios}</div>
              <div className={styles.metricTrend} style={{ color: '#f59e0b' }}>
                <span>Total Portfolios</span>
              </div>
            </div>
            <svg className={styles.metricChart} viewBox="0 0 85 38" fill="none">
              <path
                d="M 0 34 Q 25 32, 55 18 T 85 10"
                stroke="#f59e0b"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d="M 0 34 Q 25 32, 55 18 T 85 10 L 85 38 L 0 38 Z"
                fill="#fffbeb"
                opacity="0.8"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* ─── Search & Filter Bar (White Pill / Panel Match) ─── */}
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
              placeholder="Search by name, email or username..."
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
              value={planFilter}
              onChange={(e) => {
                setPlanFilter(e.target.value);
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
              <option value="ALL">All Plans</option>
              <option value="FREE">Free</option>
              <option value="PREMIUM">Premium</option>
            </select>

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
              <option value="Online">Online</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
            </select>

            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
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
              <option value="ALL">All Sources</option>
              <option value="website">Website</option>
              <option value="mobile_app">Mobile App</option>
              <option value="nfc_card">NFC Card</option>
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
              onClick={fetchUsers}
              className={styles.secondaryBtn}
              style={{ padding: '0.55rem 0.95rem', fontSize: '0.82rem' }}
            >
              <Filter size={14} color="#0052ff" /> Filter
            </button>
          </div>
        </div>
      </div>

      {/* ─── Users Data Table ─── */}
      <div className={styles.tableCard}>
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>USER</th>
                <th>USERNAME</th>
                <th>PLAN</th>
                <th>STATUS</th>
                <th>TAPS</th>
                <th>LOCATION</th>
                <th>JOINED</th>
                <th style={{ textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    Loading user records...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    No users found matching the search criteria.
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  const initials = user.name
                    ? user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .slice(0, 2)
                        .toUpperCase()
                    : 'U';

                  return (
                    <tr key={user.id} style={{ position: 'relative' }}>
                      {/* USER Column (Avatar + Name + Email) */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.name}
                              style={{
                                width: 38,
                                height: 38,
                                borderRadius: '50%',
                                objectFit: 'cover',
                                flexShrink: 0,
                                border: '1.5px solid #edf3ff',
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: 38,
                                height: 38,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #0052ff 0%, #0037b3 100%)',
                                color: '#ffffff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 800,
                                fontSize: '0.82rem',
                                flexShrink: 0,
                              }}
                            >
                              {initials}
                            </div>
                          )}
                          <div>
                            <div style={{ fontWeight: 750, color: '#0f172a', fontSize: '0.88rem' }}>
                              {user.name}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#64748b' }}>
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* USERNAME Column */}
                      <td>
                        <span style={{ fontWeight: 650, color: '#334155', fontSize: '0.82rem' }}>
                          {user.username ? `@${user.username}` : '—'}
                        </span>
                      </td>

                      {/* PLAN Column */}
                      <td>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '0.2rem 0.6rem',
                            borderRadius: 6,
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            letterSpacing: '0.4px',
                            background: user.isPremium ? '#edf3ff' : '#f1f5f9',
                            color: user.isPremium ? '#0052ff' : '#475569',
                          }}
                        >
                          {user.isPremium ? 'PREMIUM' : 'FREE'}
                        </span>
                      </td>

                      {/* STATUS Column */}
                      <td>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.2rem 0.6rem',
                            borderRadius: 6,
                            fontSize: '0.74rem',
                            fontWeight: 750,
                            background:
                              user.status === 'Pending'
                                ? '#eff6ff'
                                : '#ecfdf5',
                            color:
                              user.status === 'Pending'
                                ? '#0284c7'
                                : '#10b981',
                          }}
                        >
                          <span
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              background:
                                user.status === 'Pending' ? '#0284c7' : '#10b981',
                            }}
                          />
                          {user.status || (user.isOnline ? 'Online' : 'Active')}
                        </span>
                      </td>

                      {/* TAPS Column */}
                      <td>
                        <span style={{ fontWeight: 750, color: '#0f172a', fontSize: '0.85rem' }}>
                          {user.tapCount}
                        </span>
                      </td>

                      {/* LOCATION Column */}
                      <td>
                        {user.location ? (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: '#334155', fontWeight: 600 }}>
                            <MapPin size={13} color="#64748b" /> {user.location}
                          </div>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>∿ —</span>
                        )}
                      </td>

                      {/* JOINED Column */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: '#64748b' }}>
                          <Calendar size={13} color="#94a3b8" />
                          {new Date(user.createdAt).toLocaleDateString('en-GB')}
                        </div>
                      </td>

                      {/* ACTIONS Column */}
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', position: 'relative' }}>
                          <Link
                            href={user.username ? `/admin/users/${user.id}` : '#'}
                            className={styles.secondaryBtn}
                            style={{
                              padding: '0.3rem 0.75rem',
                              fontSize: '0.75rem',
                              fontWeight: 750,
                              color: '#0052ff',
                              textDecoration: 'none',
                            }}
                          >
                            View
                          </Link>

                          {/* 3-dots Menu Button */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(activeMenuId === user.id ? null : user.id);
                            }}
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
                          {activeMenuId === user.id && (
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
                                minWidth: 160,
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                textAlign: 'left',
                              }}
                            >
                              <button
                                type="button"
                                onClick={() => handleAction('TOGGLE_PREMIUM', user.id)}
                                style={{
                                  padding: '0.55rem 0.85rem',
                                  fontSize: '0.78rem',
                                  fontWeight: 650,
                                  color: '#334155',
                                  background: 'none',
                                  border: 'none',
                                  textAlign: 'left',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.45rem',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                              >
                                <Gem size={13} color="#a855f7" /> Toggle Premium
                              </button>

                              <button
                                type="button"
                                onClick={() => handleAction('RESET_PASSWORD', user.id)}
                                style={{
                                  padding: '0.55rem 0.85rem',
                                  fontSize: '0.78rem',
                                  fontWeight: 650,
                                  color: '#334155',
                                  background: 'none',
                                  border: 'none',
                                  textAlign: 'left',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.45rem',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                              >
                                <KeyRound size={13} color="#0052ff" /> Reset Password
                              </button>

                              <div style={{ height: 1, background: '#f1f5f9', margin: '0.2rem 0' }} />

                              <button
                                type="button"
                                onClick={() => handleAction('DELETE', user.id)}
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
                                <Trash2 size={13} color="#ef4444" /> Delete Account
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
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
            Showing 1-{users.length} of {total.toLocaleString()} users
          </span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            {/* Previous */}
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

            {/* Page 1 (Active) */}
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

            {/* Ellipsis */}
            <span style={{ padding: '0 0.3rem', color: '#94a3b8', fontSize: '0.82rem' }}>
              ...
            </span>

            {/* Last Page */}
            <button
              type="button"
              onClick={() => setPage(totalPages)}
              style={{
                padding: '0 0.6rem',
                height: 32,
                borderRadius: 8,
                border: page === totalPages ? '1px solid #0052ff' : '1px solid #e2e8f0',
                background: page === totalPages ? '#0052ff' : '#ffffff',
                color: page === totalPages ? '#ffffff' : '#334155',
                fontSize: '0.82rem',
                fontWeight: 750,
                cursor: 'pointer',
              }}
            >
              {totalPages.toLocaleString()}
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
  );
}
