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

  const fetchTickets = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/support');
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets || []);
      }
    } catch (e) {
      console.error('Failed to fetch support tickets', e);
    } finally {
      setLoadingTickets(false);
    }
  }, []);

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

  const handleUpdateTicketStatus = async (ticketId: number, status: string) => {
    try {
      const res = await fetch('/api/admin/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId, status })
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
          value={loading ? undefined : (kpis?.totalUsers ?? 0)}
          formatter={(v) => (v ?? 0).toLocaleString()}
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
          value={loading ? undefined : (kpis?.premiumUsers ?? 0)}
          formatter={(v) => (v ?? 0).toLocaleString()}
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

        {/* Card: Portfolios */}
        <MetricCard
          icon="🖼️"
          label="Portfolios"
          value={loading ? undefined : (kpis?.totalProfiles ?? 0)}
          formatter={(v) => (v ?? 0).toLocaleString()}
          loading={loading}
        />

        {/* Card: Projects */}
        <MetricCard
          icon="🗂️"
          label="Projects"
          value={loading ? undefined : (kpis?.totalProjects ?? 0)}
          formatter={(v) => (v ?? 0).toLocaleString()}
          loading={loading}
        />

        {/* Card: Total Taps */}
        <MetricCard
          icon="👆"
          label="Total Taps"
          value={loading ? undefined : (kpis?.totalTaps ?? 0)}
          formatter={(v) => (v ?? 0).toLocaleString()}
          footer={
            <span className={styles.metricTrendUp}>
              NFC profile connections
            </span>
          }
          loading={loading}
        />

        {/* Card: Support Queue */}
        <MetricCard
          icon="💬"
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

        {/* Card: Pending Reports */}
        <MetricCard
          icon="🚨"
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
              {(kpis?.pendingReports || 0) > 3 ? 'Action needed' : 'Clear'}
            </span>
          }
          loading={loading}
        />
      </div>

      {/* Support Tickets Section */}
      <div className={styles.ticketsCard}>
        <div className={styles.ticketsTitleBlock}>
          <h2 className={styles.ticketsTitle}>User Reviews & Complaints</h2>
          <p className={styles.ticketsSubtitle}>Manage feedback, complaints, and ticket requests submitted from the user dashboard.</p>
        </div>

        {loadingTickets ? (
          <div className="text-center py-10 text-gray-500 text-sm">Loading tickets...</div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-10 text-gray-400 text-sm border border-dashed border-gray-200 rounded-2xl">
            No active support tickets or complaints found.
          </div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.ticketsTable}>
              <thead>
                <tr>
                  <th>User Details</th>
                  <th>Category / Subject</th>
                  <th>Message Description</th>
                  <th>Date Submitted</th>
                  <th>Status</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <div className={styles.ticketUser}>{t.name}</div>
                      <div className={styles.ticketEmail}>{t.email}</div>
                    </td>
                    <td>
                      <span className="font-semibold text-gray-800">{t.subject}</span>
                    </td>
                    <td title={t.message}>
                      <div className="flex flex-col gap-1 items-start">
                        <div className={styles.ticketMessage}>{t.message}</div>
                        <button
                          onClick={() => setSelectedTicket(t)}
                          className="text-blue-500 hover:text-blue-700 text-xs font-bold bg-transparent border-none p-0 cursor-pointer"
                        >
                          Read Full Message
                        </button>
                      </div>
                    </td>
                    <td>
                      <div className={styles.ticketDate}>
                        {new Date(t.createdAt).toLocaleDateString()} {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.statusBadge} ${
                        t.status === 'OPEN' ? styles.statusOpen :
                        t.status === 'PENDING' ? styles.statusPending :
                        t.status === 'RESOLVED' ? styles.statusResolved :
                        styles.statusClosed
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td>
                      <div className={styles.actionBtnGroup}>
                        {t.status !== 'RESOLVED' && (
                          <button
                            onClick={() => handleUpdateTicketStatus(t.id, 'RESOLVED')}
                            className={styles.resolveBtn}
                          >
                            Resolve
                          </button>
                        )}
                        {t.status !== 'CLOSED' && (
                          <button
                            onClick={() => handleUpdateTicketStatus(t.id, 'CLOSED')}
                            className={styles.closeBtn}
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
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>{selectedTicket.subject}</h3>
              <button onClick={() => setSelectedTicket(null)} className={styles.modalCloseBtn}>&times;</button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.modalMetaGrid}>
                <div>
                  <label className={styles.modalMetaLabel}>From User</label>
                  <div className={styles.modalMetaVal}>{selectedTicket.name}</div>
                  <div className="text-xs text-gray-500 font-mono mt-0.5">{selectedTicket.email}</div>
                </div>
                <div>
                  <label className={styles.modalMetaLabel}>Date Submitted</label>
                  <div className={styles.modalMetaVal}>
                    {new Date(selectedTicket.createdAt).toLocaleString()}
                  </div>
                </div>
                <div>
                  <label className={styles.modalMetaLabel}>Ticket Status</label>
                  <div className="mt-1">
                    <span className={`${styles.statusBadge} ${
                      selectedTicket.status === 'OPEN' ? styles.statusOpen :
                      selectedTicket.status === 'PENDING' ? styles.statusPending :
                      selectedTicket.status === 'RESOLVED' ? styles.statusResolved :
                      styles.statusClosed
                    }`}>
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
                Close View
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