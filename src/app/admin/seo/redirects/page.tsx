'use client';

import React, { useEffect, useState } from 'react';
import {
  CornerDownRight,
  Plus,
  Trash2,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import styles from '../../dashboard/dashboard.module.css';

export default function RedirectsManagerPage() {
  const [redirects, setRedirects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form
  const [sourcePath, setSourcePath] = useState('');
  const [targetPath, setTargetPath] = useState('');
  const [statusCode, setStatusCode] = useState(301);
  const [isSaving, setIsSaving] = useState(false);

  const fetchRedirects = async () => {
    try {
      const res = await fetch('/api/admin/seo/redirects');
      const data = await res.json();
      if (data.success) {
        setRedirects(data.redirects || []);
      }
    } catch (e) {
      console.error('Failed to load redirects:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRedirects();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/seo/redirects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourcePath, targetPath, statusCode }),
      });
      if (res.ok) {
        setShowModal(false);
        setSourcePath('');
        setTargetPath('');
        fetchRedirects();
      }
    } catch (e) {
      console.error('Failed to create redirect:', e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this redirect rule?')) return;
    try {
      const res = await fetch(`/api/admin/seo/redirects?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchRedirects();
      }
    } catch (e) {
      console.error('Failed to delete redirect:', e);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>301 / 302 URL Redirect Manager</h1>
          <p className={styles.subtitle}>
            Preserve SEO link equity, resolve 404 broken links, and forward legacy routes
          </p>
        </div>
        <div className={styles.headerRight}>
          <button
            onClick={() => setShowModal(true)}
            className={styles.refreshBtn}
          >
            <Plus size={15} />
            <span>Add Redirect Rule</span>
          </button>
        </div>
      </header>

      {/* Redirects Table */}
      <div className={styles.panelCard}>
        <table className={styles.ticketsTable}>
          <thead>
            <tr>
              <th>Source URL (Origin)</th>
              <th style={{ width: 40 }}></th>
              <th>Destination URL (Target)</th>
              <th>HTTP Code</th>
              <th>Status</th>
              <th>Total Clicks</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {redirects.map((r) => (
              <tr key={r.id}>
                <td>
                  <span style={{ fontWeight: 750, color: '#0f172a', fontFamily: 'monospace' }}>
                    {r.sourcePath}
                  </span>
                </td>
                <td>
                  <ArrowRight size={15} className="text-slate-400" />
                </td>
                <td>
                  <span style={{ fontWeight: 650, color: '#0052ff', fontFamily: 'monospace' }}>
                    {r.targetPath}
                  </span>
                </td>
                <td>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '0.15rem 0.5rem',
                      borderRadius: 6,
                      background: r.statusCode === 301 ? '#eff6ff' : '#fffbeb',
                      color: r.statusCode === 301 ? '#0052ff' : '#d97706',
                    }}
                  >
                    {r.statusCode} Permanent
                  </span>
                </td>
                <td>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 750,
                      color: '#059669',
                      background: '#ecfdf5',
                      padding: '0.15rem 0.5rem',
                      borderRadius: 6,
                    }}
                  >
                    Active
                  </span>
                </td>
                <td>
                  <span style={{ fontWeight: 800, color: '#0f172a' }}>{r.clicks.toLocaleString()}</span>
                </td>
                <td className="text-right">
                  <button
                    onClick={() => handleDelete(r.id)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: '#ef4444',
                      cursor: 'pointer',
                      padding: '0.35rem',
                    }}
                    title="Delete rule"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1.5rem',
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 16,
              width: '100%',
              maxWidth: 480,
              padding: '1.75rem',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 1rem 0' }}>
              Create Redirect Rule
            </h2>

            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                  Source Path (Legacy URL) *
                </label>
                <input
                  type="text"
                  required
                  value={sourcePath}
                  onChange={(e) => setSourcePath(e.target.value)}
                  placeholder="/old-portfolio-page"
                  style={{ width: '100%', padding: '0.55rem 0.85rem', borderRadius: 8, border: '1px solid #e2e8f0', marginTop: '0.25rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                  Destination Target Path *
                </label>
                <input
                  type="text"
                  required
                  value={targetPath}
                  onChange={(e) => setTargetPath(e.target.value)}
                  placeholder="/#configurator"
                  style={{ width: '100%', padding: '0.55rem 0.85rem', borderRadius: 8, border: '1px solid #e2e8f0', marginTop: '0.25rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                  HTTP Redirect Code
                </label>
                <select
                  value={statusCode}
                  onChange={(e) => setStatusCode(Number(e.target.value))}
                  style={{ width: '100%', padding: '0.55rem 0.85rem', borderRadius: 8, border: '1px solid #e2e8f0', marginTop: '0.25rem' }}
                >
                  <option value={301}>301 — Permanent Redirect (SEO Equity Passed)</option>
                  <option value={302}>302 — Temporary Redirect</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{ padding: '0.55rem 1.25rem', borderRadius: 8, border: '1px solid #e2e8f0', background: '#ffffff', cursor: 'pointer', fontWeight: 650 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  style={{ padding: '0.55rem 1.4rem', borderRadius: 8, border: 'none', background: '#0052ff', color: '#ffffff', cursor: 'pointer', fontWeight: 700 }}
                >
                  {isSaving ? 'Saving...' : 'Add Rule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
