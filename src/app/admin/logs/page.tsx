'use client';

import { useEffect, useState } from 'react';
import styles from '../modules.module.css';

export default function LogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [moduleFilter, setModuleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: '30' });
      if (moduleFilter) params.set('module', moduleFilter);
      const res = await fetch(`/api/admin/audit-logs?${params}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs);
        setTotalPages(data.totalPages);
      }
    } catch (e) {
      console.error('Failed to load logs', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLogs(); }, [moduleFilter, page]);

  const iconForModule = (mod: string) => {
    const icons: Record<string, string> = {
      USER_MANAGEMENT: '👥',
      SUPPORT: '💬',
      MODERATION: '🚨',
      BROADCAST: '📢',
    };
    return icons[mod] || '📋';
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Activity Logs</h1>
          <p className={styles.pageSub}>Complete audit trail of admin actions</p>
        </div>
        <button className={styles.exportBtn}>📥 Export</button>
      </div>

      <div className={styles.filterBar}>
        <select
          className={styles.filterSelect}
          value={moduleFilter}
          onChange={(e) => { setModuleFilter(e.target.value); setPage(1); }}
        >
          <option value="">All Modules</option>
          <option value="USER_MANAGEMENT">User Management</option>
          <option value="SUPPORT">Support</option>
          <option value="MODERATION">Moderation</option>
          <option value="BROADCAST">Broadcast</option>
        </select>
      </div>

      <div className={styles.tablePanel}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#94A3B8' }}>Loading...</div>
        ) : logs.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📝</div>
            <div className={styles.emptyText}>No audit logs recorded yet</div>
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className={styles.logEntry}>
              <span className={styles.logIcon}>{iconForModule(log.module)}</span>
              <div className={styles.logContent}>
                <div className={styles.logAction}>{log.action}</div>
                <div className={styles.logMeta}>
                  {log.module} · Target: {log.targetType} #{log.targetId} · IP: {log.ipAddress || '—'}
                </div>
              </div>
              <span className={styles.logTime}>
                {new Date(log.createdAt).toLocaleString()}
              </span>
            </div>
          ))
        )}

        <div className={styles.pagination}>
          <span className={styles.paginationInfo}>Page {page} of {totalPages}</span>
          <div className={styles.paginationBtns}>
            <button
              className={page <= 1 ? styles.pageBtnDisabled : styles.pageBtn}
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page <= 1}
            >
              ← Prev
            </button>
            <button
              className={page >= totalPages ? styles.pageBtnDisabled : styles.pageBtn}
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
