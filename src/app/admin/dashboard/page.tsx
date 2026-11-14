'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  Users,
  Sparkles,
  TrendingUp,
  Layers,
  FolderGit2,
  Zap,
  Headphones,
  ShieldAlert,
  Clock,
  RefreshCw,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ShieldCheck,
  Activity,
  Megaphone,
  UserCheck,
  MessageSquare,
  AlertTriangle,
  ChevronRight,
  Filter,
} from 'lucide-react';
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
  totalTaps: number;
}

export default function AdminDashboard() {
  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Support tickets state
  const [tickets, setTickets] = useState<any[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [ticketFilter, setTicketFilter] = useState<'ALL' | 'OPEN' | 'PENDING' | 'RESOLVED'>('ALL');

  const fetchTickets = useCallback(async (retryCount = 0) => {
    try {
      const res = await fetch('/api/admin/support');
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets || []);
        setLoadingTickets(false);
      } else if (retryCount < 2) {
        setTimeout(() => fetchTickets(retryCount + 1), 1500);
      } else {
        setLoadingTickets(false);
      }
    } catch (e) {
      if (retryCount < 2) {
        setTimeout(() => fetchTickets(retryCount + 1), 1500);
      } else {
        console.error('Failed to fetch support tickets', e);
        setLoadingTickets(false);
      }
    }
  }, []);

  const fetchData = useCallback(async (showRefreshing = false, retryCount = 0) => {
    if (showRefreshing) setRefreshing(true);
    try {
      const res = await fetch('/api/admin/analytics');
      if (res.ok) {
        const data = await res.json();
        setKpis(data.kpis);
        setLastUpdated(new Date());
        setLoading(false);
        setRefreshing(false);
      } else if (retryCount < 2) {
        setTimeout(() => fetchData(false, retryCount + 1), 1500);
      } else {
        setLoading(false);
        setRefreshing(false);
      }
    } catch (e) {
      if (retryCount < 2) {
        setTimeout(() => fetchData(false, retryCount + 1), 1500);
      } else {
        console.error('Failed to fetch analytics', e);
        setLoading(false);
        setRefreshing(false);
      }
    }
  }, []);

  const handleUpdateTicketStatus = async (ticketId: number, status: string) => {
    try {
      const res = await fetch('/api/admin/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId, status }),
      });
      if (res.ok) {
        fetchTickets();
        fetchData();
      }
    } catch (e) {
      console.error('Failed to update ticket status', e);
    }
  };

  useEffect(() => {
    fetchData();
    fetchTickets();
    const interval = setInterval(() => {
      fetchData();
      fetchTickets();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchData, fetchTickets]);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const filteredTickets = tickets.filter((t) => {
    if (ticketFilter === 'ALL') return true;
    return t.status === ticketFilter;
  });

  return (
    <div className={styles.page}>
      {/* Header */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>
            <span>Admin Command Center</span>
          </h1>
          <p className={styles.subtitle}>
            Real-time telemetry, user management, and system infrastructure performance.
          </p>
        </div>
        <div className={styles.headerRight}>
          {lastUpdated && (
            <span className={styles.timestamp}>
              <Clock size={13} />
              <span>Live sync {formatTime(lastUpdated)}</span>
            </span>
          )}
          <button
            className={`${styles.refreshBtn} ${refreshing ? styles.refreshing : ''}`}
            onClick={() => fetchData(true)}
            disabled={refreshing}
            aria-label="Refresh data"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            <span>{refreshing ? 'Syncing...' : 'Sync Now'}</span>
          </button>
        </div>
      </header>

      {/* Quick Action Navigation Strip */}
      <div className={styles.quickActionsBar}>
        <Link href="/admin/security" className={styles.quickActionPill}>
          <ShieldCheck size={14} className="text-sky-400" />
          <span>Security & Threat Center</span>
          <span className={styles.pillDotSuccess} />
        </Link>
        <Link href="/admin/users" className={styles.quickActionPill}>
          <Users size={14} className="text-blue-400" />
          <span>User Directory</span>
        </Link>
        <Link href="/admin/live" className={styles.quickActionPill}>
          <Activity size={14} className="text-emerald-400" />
          <span>Live Taps Stream</span>
        </Link>
        <Link href="/admin/broadcast" className={styles.quickActionPill}>
          <Megaphone size={14} className="text-amber-400" />
          <span>System Broadcast</span>
        </Link>
        <Link href="/admin/portfolios" className={styles.quickActionPill}>
          <Layers size={14} className="text-cyan-400" />
          <span>Portfolios</span>
        </Link>
        <Link href="/admin/control-center" className={styles.quickActionPill}>
          <Zap size={14} className="text-violet-400" />
          <span>Control Center</span>
        </Link>
      </div>

      {/* KPI Grid */}
      <div className={styles.kpiGrid}>
        {/* Card 1: Total Users */}
        <MetricCard
          icon={<Users size={20} />}
          iconColor="linear-gradient(135deg, rgba(37,99,235,0.2), rgba(56,189,248,0.2))"
          iconBorder="rgba(56,189,248,0.3)"
          iconText="#38bdf8"
          label="Total Users"
          value={loading ? undefined : (kpis?.totalUsers ?? 0)}
          formatter={(v) => (v ?? 0).toLocaleString()}
          footer={
            <span className={styles.metricTrendUp}>
              <TrendingUp size={12} /> +{loading ? '…' : kpis?.todayUsers} today
            </span>
          }
          loading={loading}
        />

        {/* Card 2: Premium Users */}
        <MetricCard
          icon={<Sparkles size={20} />}
          iconColor="linear-gradient(135deg, rgba(245,158,11,0.2), rgba(251,191,36,0.2))"
          iconBorder="rgba(251,191,36,0.3)"
          iconText="#fbbf24"
          label="Premium Users"
          value={loading ? undefined : (kpis?.premiumUsers ?? 0)}
          formatter={(v) => (v ?? 0).toLocaleString()}
          footer={
            <span className={styles.metricTrendUp}>
              {loading
                ? '…'
                : `${(((kpis?.premiumUsers || 0) / Math.max(kpis?.totalUsers || 1, 1)) * 100).toFixed(1)}%`}{' '}
              conversion
            </span>
          }
          loading={loading}
        />

        {/* Card 3: Weekly Growth */}
        <MetricCard
          icon={<TrendingUp size={20} />}
          iconColor="linear-gradient(135deg, rgba(16,185,129,0.2), rgba(52,211,153,0.2))"
          iconBorder="rgba(52,211,153,0.3)"
          iconText="#34d399"
          label="Growth (weekly)"
          value={loading ? undefined : (kpis?.growth ?? 0)}
          formatter={(v) => `${(v ?? 0) > 0 ? '+' : ''}${v ?? 0}%`}
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

        {/* Card 4: Portfolios */}
        <MetricCard
          icon={<Layers size={20} />}
          iconColor="linear-gradient(135deg, rgba(6,182,212,0.2), rgba(34,211,238,0.2))"
          iconBorder="rgba(34,211,238,0.3)"
          iconText="#22d3ee"
          label="Active Portfolios"
          value={loading ? undefined : (kpis?.totalProfiles ?? 0)}
          formatter={(v) => (v ?? 0).toLocaleString()}
          footer={
            <span className={styles.metricTrendUp}>
              Published live sites
            </span>
          }
          loading={loading}
        />

        {/* Card 5: Projects */}
        <MetricCard
          icon={<FolderGit2 size={20} />}
          iconColor="linear-gradient(135deg, rgba(139,92,246,0.2), rgba(167,139,250,0.2))"
          iconBorder="rgba(167,139,250,0.3)"
          iconText="#a78bfa"
          label="Showcase Projects"
          value={loading ? undefined : (kpis?.totalProjects ?? 0)}
          formatter={(v) => (v ?? 0).toLocaleString()}
          loading={loading}
        />

        {/* Card 6: Total Taps */}
        <MetricCard
          icon={<Zap size={20} />}
          iconColor="linear-gradient(135deg, rgba(236,72,153,0.2), rgba(244,114,182,0.2))"
          iconBorder="rgba(244,114,182,0.3)"
          iconText="#f472b6"
          label="Total NFC Taps"
          value={loading ? undefined : (kpis?.totalTaps ?? 0)}
          formatter={(v) => (v ?? 0).toLocaleString()}
          footer={
            <span className={styles.metricTrendUp}>
              NFC profile connections
            </span>
          }
          loading={loading}
        />

        {/* Card 7: Support Queue */}
        <MetricCard
          icon={<Headphones size={20} />}
          iconColor="linear-gradient(135deg, rgba(245,158,11,0.2), rgba(249,115,22,0.2))"
          iconBorder="rgba(249,115,22,0.3)"
          iconText="#fb923c"
          label="Support Queue"
          value={loading ? undefined : (kpis?.openTickets ?? 0)}
          formatter={(v) => (v ?? 0).toString()}
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

        {/* Card 8: Pending Reports */}
        <MetricCard
          icon={<ShieldAlert size={20} />}
          iconColor="linear-gradient(135deg, rgba(239,68,68,0.2), rgba(248,113,113,0.2))"
          iconBorder="rgba(248,113,113,0.3)"
          iconText="#f87171"
          label="Pending Reports"
          value={loading ? undefined : (kpis?.pendingReports ?? 0)}
          formatter={(v) => (v ?? 0).toString()}
          footer={
            <span
              className={
                (kpis?.pendingReports || 0) > 3
                  ? styles.metricAlertDanger
                  : styles.metricAlertSuccess
              }
            >
              {(kpis?.pendingReports || 0) > 3 ? 'Action needed' : 'Clear & Protected'}
            </span>
          }
          loading={loading}
        />
      </div>

      {/* Support Tickets & Complaints Section */}
      <div className={styles.ticketsCard}>
        <div className={styles.ticketsTitleBlock}>
          <div>
            <h2 className={styles.ticketsTitle}>
              <MessageSquare size={20} className="text-sky-400" />
              <span>User Feedback & Complaints Queue</span>
            </h2>
            <p className={styles.ticketsSubtitle}>
              Direct inquiries, bug reports, and user feedback submitted through the dashboard contact desk.
            </p>
          </div>

          {/* Ticket Filter Pills */}
          <div className="flex gap-2">
            {(['ALL', 'OPEN', 'PENDING', 'RESOLVED'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setTicketFilter(filter)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  ticketFilter === filter
                    ? 'bg-blue-600/30 text-sky-400 border border-sky-400/40 shadow-sm'
                    : 'bg-white/5 text-slate-400 border border-white/5 hover:bg-white/10'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {loadingTickets ? (
          <div className="text-center py-12 text-slate-500 text-sm flex items-center justify-center gap-2">
            <RefreshCw size={16} className="animate-spin text-sky-400" />
            <span>Loading support queue...</span>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
            <CheckCircle2 size={28} className="mx-auto mb-2 text-emerald-400 opacity-80" />
            <p className="font-semibold text-slate-300">No {ticketFilter !== 'ALL' ? ticketFilter.toLowerCase() : ''} tickets found</p>
            <p className="text-xs text-slate-500 mt-1">All user complaints and feedback in this view have been attended to.</p>
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.ticketsTable}>
              <thead>
                <tr>
                  <th>User Details</th>
                  <th>Category / Subject</th>
                  <th>Message Preview</th>
                  <th>Submitted At</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTickets.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <div className={styles.ticketUser}>{t.name}</div>
                      <div className={styles.ticketEmail}>{t.email}</div>
                    </td>
                    <td>
                      <span className="font-semibold text-slate-200">{t.subject}</span>
                    </td>
                    <td title={t.message}>
                      <div className="flex flex-col gap-1 items-start">
                        <div className={styles.ticketMessage}>{t.message}</div>
                        <button
                          onClick={() => setSelectedTicket(t)}
                          className="text-sky-400 hover:text-sky-300 text-xs font-semibold bg-transparent border-none p-0 cursor-pointer inline-flex items-center gap-1"
                        >
                          <span>Inspect details</span>
                          <ChevronRight size={12} />
                        </button>
                      </div>
                    </td>
                    <td>
                      <div className={styles.ticketDate}>
                        {new Date(t.createdAt).toLocaleDateString()} at{' '}
                        {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td>
                      <span
                        className={`${styles.statusBadge} ${
                          t.status === 'OPEN'
                            ? styles.statusOpen
                            : t.status === 'PENDING'
                            ? styles.statusPending
                            : t.status === 'RESOLVED'
                            ? styles.statusResolved
                            : styles.statusClosed
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionBtnGroup}>
                        {t.status !== 'RESOLVED' && (
                          <button
                            onClick={() => handleUpdateTicketStatus(t.id, 'RESOLVED')}
                            className={styles.resolveBtn}
                            title="Mark as Resolved"
                          >
                            Resolve
                          </button>
                        )}
                        {t.status !== 'CLOSED' && (
                          <button
                            onClick={() => handleUpdateTicketStatus(t.id, 'CLOSED')}
                            className={styles.closeBtn}
                            title="Close Ticket"
                          >
                            Close
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Read Message Detail Modal */}
      {selectedTicket && (
        <div className={styles.modalOverlay} onClick={() => setSelectedTicket(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>{selectedTicket.subject}</h3>
              <button onClick={() => setSelectedTicket(null)} className={styles.modalCloseBtn}>
                &times;
              </button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalMetaGrid}>
                <div>
                  <label className={styles.modalMetaLabel}>From User</label>
                  <div className={styles.modalMetaVal}>{selectedTicket.name}</div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">{selectedTicket.email}</div>
                </div>
                <div>
                  <label className={styles.modalMetaLabel}>Date Submitted</label>
                  <div className={styles.modalMetaVal}>
                    {new Date(selectedTicket.createdAt).toLocaleString()}
                  </div>
                </div>
                <div>
                  <label className={styles.modalMetaLabel}>Status</label>
                  <div className="mt-1">
                    <span
                      className={`${styles.statusBadge} ${
                        selectedTicket.status === 'OPEN'
                          ? styles.statusOpen
                          : selectedTicket.status === 'PENDING'
                          ? styles.statusPending
                          : selectedTicket.status === 'RESOLVED'
                          ? styles.statusResolved
                          : styles.statusClosed
                      }`}
                    >
                      {selectedTicket.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className={styles.modalMessageBlock}>
                <label className={styles.modalMetaLabel}>Review / Complaint Details</label>
                <div className={styles.modalMessageText}>{selectedTicket.message}</div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <div className="flex gap-2">
                {selectedTicket.status !== 'RESOLVED' && (
                  <button
                    onClick={() => {
                      handleUpdateTicketStatus(selectedTicket.id, 'RESOLVED');
                      setSelectedTicket(null);
                    }}
                    className={styles.resolveBtn}
                  >
                    Mark Resolved
                  </button>
                )}
                {selectedTicket.status !== 'CLOSED' && (
                  <button
                    onClick={() => {
                      handleUpdateTicketStatus(selectedTicket.id, 'CLOSED');
                      setSelectedTicket(null);
                    }}
                    className={styles.closeBtn}
                  >
                    Close Ticket
                  </button>
                )}
              </div>
              <button onClick={() => setSelectedTicket(null)} className={styles.closeModalActionBtn}>
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------- Reusable Metric Card Component ----------
interface MetricCardProps {
  icon: React.ReactNode;
  iconColor?: string;
  iconBorder?: string;
  iconText?: string;
  label: string;
  value?: number;
  formatter?: (value: number) => string;
  footer?: React.ReactNode;
  loading: boolean;
}

function MetricCard({
  icon,
  iconColor = 'rgba(255, 255, 255, 0.05)',
  iconBorder = 'rgba(255, 255, 255, 0.08)',
  iconText = '#38bdf8',
  label,
  value,
  formatter = (v) => v.toString(),
  footer,
  loading,
}: MetricCardProps) {
  return (
    <div className={styles.metricCard}>
      <div
        className={styles.metricIcon}
        style={{
          background: iconColor,
          borderColor: iconBorder,
          color: iconText,
        }}
      >
        {icon}
      </div>
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
