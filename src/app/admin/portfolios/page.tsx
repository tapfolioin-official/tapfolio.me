'use client';

import { useEffect, useState, useCallback } from 'react';
import styles from '../modules.module.css';

interface PortfolioRow {
  id: number;
  name: string;
  username: string;
  avatar: string;
  isPremium: boolean;
  tapCount: number;
  projectCount: number;
  socialCount: number;
}

export default function PortfoliosPage() {
  const [portfolios, setPortfolios] = useState<PortfolioRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchPortfolios = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ search, page: '1', limit: '30' });
      const res = await fetch(`/api/admin/users?${params}`);
      if (res.ok) {
        const data = await res.json();
        setPortfolios(
          data.users
            .filter((u: any) => u.username)
            .map((u: any) => ({
              id: u.id,
              name: u.name || '—',
              username: u.username,
              avatar: u.avatar || '/profile_avatar.png',
              isPremium: u.isPremium,
              tapCount: u.tapCount,
              projectCount: 0,
              socialCount: 0,
            }))
        );
      }
    } catch (e) {
      console.error('Failed to load portfolios', e);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchPortfolios(); }, [fetchPortfolios]);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Portfolio Management</h1>
          <p className={styles.pageSub}>Browse and moderate published portfolios</p>
        </div>
      </div>

      <div className={styles.filterBar}>
        <input
          className={styles.searchInput}
          placeholder="Search by name or username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className={styles.tablePanel}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Portfolio</th>
              <th>Username</th>
              <th>Plan</th>
              <th>Taps</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>Loading...</td></tr>
            ) : portfolios.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>🖼️</div>
                    <div className={styles.emptyText}>No portfolios found</div>
                  </div>
                </td>
              </tr>
            ) : (
              portfolios.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className={styles.userCell}>
                      <img src={p.avatar} alt={p.name} className={styles.userAvatar} />
                      <div>
                        <div className={styles.userName}>{p.name}</div>
                      </div>
                    </div>
                  </td>
                  <td>@{p.username}</td>
                  <td>
                    <span className={p.isPremium ? styles.badgePremium : styles.badgeFree}>
                      {p.isPremium ? 'Premium' : 'Free'}
                    </span>
                  </td>
                  <td>{p.tapCount}</td>
                  <td>
                    <div className={styles.actionGroup}>
                      <a
                        href={`/connect/${p.username}`}
                        target="_blank"
                        className={styles.actionBtnPrimary}
                        style={{ textDecoration: 'none' }}
                      >
                        Open
                      </a>
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
