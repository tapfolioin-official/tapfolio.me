'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import styles from '../modules.module.css';

interface UserRow {
  id: number;
  name: string;
  email: string;
  username: string | null;
  avatar: string | null;
  isPremium: boolean;
  tapCount: number;
  location: string | null;
  isOnline: boolean;
  profileReady: boolean;
  createdAt: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ search, page: String(page), limit: '15' });
      const res = await fetch(`/api/admin/users?${params}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
        setTotalPages(data.totalPages);
        setTotal(data.total);
      }
    } catch (e) {
      console.error('Failed to load users', e);
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAction = async (action: string, userId: number) => {
    if (action === 'DELETE' && !confirm('Are you sure you want to permanently delete this user?')) return;

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

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>User Management</h1>
          <p className={styles.pageSub}>{total.toLocaleString()} registered users</p>
        </div>
        <button className={styles.exportBtn}>📥 Export CSV</button>
      </div>

      {/* Filters */}
      <div className={styles.filterBar}>
        <input
          className={styles.searchInput}
          placeholder="Search by name, email, or username..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <select className={styles.filterSelect}>
          <option value="">All Plans</option>
          <option value="premium">Premium</option>
          <option value="free">Free</option>
        </select>
        <select className={styles.filterSelect}>
          <option value="">All Status</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
        </select>
      </div>

      {/* Table */}
      <div className={styles.tablePanel}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>User</th>
              <th>Username</th>
              <th>Plan</th>
              <th>Status</th>
              <th>Taps</th>
              <th>Location</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '2rem' }}>
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={8}>
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>👥</div>
                    <div className={styles.emptyText}>No users found</div>
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className={styles.userCell}>
                      <img
                        src={user.avatar || '/profile_avatar.png'}
                        alt={user.name}
                        className={styles.userAvatar}
                      />
                      <div>
                        <div className={styles.userName}>{user.name}</div>
                        <div className={styles.userEmail}>{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>{user.username ? `@${user.username}` : '—'}</td>
                  <td>
                    <span className={user.isPremium ? styles.badgePremium : styles.badgeFree}>
                      {user.isPremium ? 'Premium' : 'Free'}
                    </span>
                  </td>
                  <td>
                    <span className={user.isOnline ? styles.badgeOnline : styles.badgeOffline}>
                      {user.isOnline ? 'Online' : 'Offline'}
                    </span>
                  </td>
                  <td>{user.tapCount}</td>
                  <td>{user.location || '—'}</td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div className={styles.actionGroup}>
                      {user.username && (
                        <Link
                          href={`/admin/users/${user.id}`}
                          className={styles.actionBtnPrimary}
                        >
                          View
                        </Link>
                      )}
                      <button
                        className={styles.actionBtn}
                        onClick={() => handleAction('RESET_PASSWORD', user.id)}
                      >
                        Reset PW
                      </button>
                      <button
                        className={styles.actionBtnDanger}
                        onClick={() => handleAction('DELETE', user.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className={styles.pagination}>
          <span className={styles.paginationInfo}>
            Page {page} of {totalPages} ({total} total)
          </span>
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
