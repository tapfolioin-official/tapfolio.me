'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  CalendarClock,
  Send,
  Edit2,
  Trash2,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import styles from '../../dashboard/dashboard.module.css';

interface ScheduledPost {
  id: number;
  title: string;
  slug: string;
  scheduledAt: string | null;
  authorName: string | null;
  categoryName: string | null;
  readingTime: string | null;
}

export default function ScheduledPostsPage() {
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(true);

  const loadScheduled = () => {
    setLoading(true);
    fetch('/api/admin/blog/posts?status=SCHEDULED&limit=50')
      .then((res) => res.json())
      .then((data) => {
        if (data.posts) setPosts(data.posts);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadScheduled();
  }, []);

  const handlePublishNow = async (id: number) => {
    if (!confirm('Publish this scheduled article immediately?')) return;
    try {
      const res = await fetch('/api/admin/blog/posts/bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'PUBLISH', ids: [id] }),
      });
      if (res.ok) {
        loadScheduled();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={styles.page}>
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
            <CalendarClock size={13} /> Automated Release Queue
          </div>
          <h1 className={styles.pageTitle}>Scheduled Articles ({posts.length})</h1>
          <p className={styles.pageSub}>
            Queued content scheduled for automatic database-backed publication at future timestamps.
          </p>
        </div>

        <div className={styles.headerRight}>
          <Link
            href="/admin/content/blog/create"
            className={styles.primaryBtn}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <CalendarClock size={16} /> Schedule New Article
          </Link>
        </div>
      </div>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>SCHEDULED ARTICLE</th>
              <th>CATEGORY</th>
              <th>AUTHOR</th>
              <th>SCHEDULED DATE & TIME</th>
              <th style={{ textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                  Checking release queue...
                </td>
              </tr>
            ) : posts.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                  No articles are currently scheduled for future release.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id}>
                  <td>
                    <div style={{ fontWeight: 700, color: '#0f172a' }}>{post.title}</div>
                    <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>/blog/{post.slug}</div>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: 6,
                        background: '#f1f5f9',
                        color: '#475569',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                      }}
                    >
                      {post.categoryName || 'General'}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.82rem', color: '#334155', fontWeight: 600 }}>
                    {post.authorName || 'Tapfolio Team'}
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0284c7', fontWeight: 700, fontSize: '0.82rem' }}>
                      <Clock size={14} />
                      {post.scheduledAt ? new Date(post.scheduledAt).toLocaleString() : 'TBD'}
                    </div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <button
                        type="button"
                        onClick={() => handlePublishNow(post.id)}
                        className={styles.primaryBtn}
                        style={{ padding: '0.3rem 0.65rem', fontSize: '0.76rem' }}
                      >
                        Publish Now
                      </button>
                      <Link
                        href={`/admin/content/blog/create?id=${post.id}`}
                        className={styles.secondaryBtn}
                        style={{ padding: '0.3rem 0.65rem', fontSize: '0.76rem' }}
                      >
                        Edit
                      </Link>
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
