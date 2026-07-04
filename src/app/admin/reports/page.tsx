'use client';

import { useEffect, useState } from 'react';
import styles from '../modules.module.css';

export default function ReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [counts, setCounts] = useState({ pending: 0, actioned: 0, rejected: 0 });
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = filter ? `?status=${filter}` : '';
      const res = await fetch(`/api/admin/reports${params}`);
      if (res.ok) {
        const data = await res.json();
        setReports(data.reports);
        setCounts(data.counts);
      }
    } catch (e) {
      console.error('Failed to load reports', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReports(); }, [filter]);

  const updateStatus = async (reportId: number, status: string) => {
    try {
      await fetch('/api/admin/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, status }),
      });
      fetchReports();
    } catch (e) {
      console.error('Failed to update report', e);
    }
  };

  const statusBadge = (s: string) => {
    const map: Record<string, string> = {
      PENDING: styles.badgePending,
      ACTIONED: styles.badgeActioned,
      REJECTED: styles.badgeRejected,
    };
    return map[s] || styles.badge;
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Reports & Moderation</h1>
          <p className={styles.pageSub}>Reported users and portfolios</p>
        </div>
      </div>

      <div className={styles.statusTabs}>
        {[
          { label: 'All', value: '', count: counts.pending + counts.actioned + counts.rejected },
          { label: 'Pending', value: 'PENDING', count: counts.pending },
          { label: 'Actioned', value: 'ACTIONED', count: counts.actioned },
          { label: 'Rejected', value: 'REJECTED', count: counts.rejected },
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

      <div className={styles.tablePanel}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Target</th>
              <th>Reporter</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
            ) : reports.length === 0 ? (
              <tr>
                <td colSpan={8}>
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>🚨</div>
                    <div className={styles.emptyText}>No reports found</div>
                  </div>
                </td>
              </tr>
            ) : (
              reports.map((r) => (
                <tr key={r.id}>
                  <td>#{r.id}</td>
                  <td style={{ fontWeight: 700 }}>{r.targetType}</td>
                  <td>{r.targetName}</td>
                  <td>{r.reporter}</td>
                  <td>{r.reason}</td>
                  <td><span className={statusBadge(r.status)}>{r.status}</span></td>
                  <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className={styles.actionGroup}>
                      {r.status === 'PENDING' && (
                        <>
                          <button className={styles.actionBtnPrimary} onClick={() => updateStatus(r.id, 'ACTIONED')}>
                            Action
                          </button>
                          <button className={styles.actionBtn} onClick={() => updateStatus(r.id, 'REJECTED')}>
                            Reject
                          </button>
                        </>
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
