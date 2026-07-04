'use client';

import { useEffect, useState } from 'react';
import styles from '../modules.module.css';

export default function SupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [counts, setCounts] = useState({ open: 0, pending: 0, resolved: 0, closed: 0 });
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const params = filter ? `?status=${filter}` : '';
      const res = await fetch(`/api/admin/support${params}`);
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets);
        setCounts(data.counts);
      }
    } catch (e) {
      console.error('Failed to load tickets', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTickets(); }, [filter]);

  const updateStatus = async (ticketId: number, status: string) => {
    try {
      await fetch('/api/admin/support', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId, status }),
      });
      fetchTickets();
    } catch (e) {
      console.error('Failed to update ticket', e);
    }
  };

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      OPEN: styles.badgeOpen,
      PENDING: styles.badgePending,
      RESOLVED: styles.badgeResolved,
      CLOSED: styles.badgeClosed,
    };
    return map[s] || styles.badge;
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Support Inbox</h1>
          <p className={styles.pageSub}>Manage customer support tickets</p>
        </div>
      </div>

      {/* Status Tabs */}
      <div className={styles.statusTabs}>
        {[
          { label: 'All', value: '', count: counts.open + counts.pending + counts.resolved + counts.closed },
          { label: 'Open', value: 'OPEN', count: counts.open },
          { label: 'Pending', value: 'PENDING', count: counts.pending },
          { label: 'Resolved', value: 'RESOLVED', count: counts.resolved },
          { label: 'Closed', value: 'CLOSED', count: counts.closed },
        ].map((tab) => (
          <button
            key={tab.value}
            className={filter === tab.value ? styles.statusTabActive : styles.statusTab}
            onClick={() => setFilter(tab.value)}
          >
            {tab.label}
            <span className={styles.statusCount}>{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className={styles.tablePanel}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
            ) : tickets.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>💬</div>
                    <div className={styles.emptyText}>No tickets found</div>
                  </div>
                </td>
              </tr>
            ) : (
              tickets.map((t) => (
                <tr key={t.id}>
                  <td>#{t.id}</td>
                  <td style={{ fontWeight: 700 }}>{t.name}</td>
                  <td>{t.email}</td>
                  <td>{t.subject}</td>
                  <td><span className={statusBadge(t.status)}>{t.status}</span></td>
                  <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className={styles.actionGroup}>
                      {t.status !== 'RESOLVED' && (
                        <button className={styles.actionBtnPrimary} onClick={() => updateStatus(t.id, 'RESOLVED')}>
                          Resolve
                        </button>
                      )}
                      {t.status !== 'CLOSED' && (
                        <button className={styles.actionBtn} onClick={() => updateStatus(t.id, 'CLOSED')}>
                          Close
                        </button>
                      )}
                    </div>
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
