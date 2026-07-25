'use client';

import { useState } from 'react';
import styles from '../modules.module.css';

export default function SettingsPage() {
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleIndexNowSubmit = async () => {
    setSubmitting(true);
    setResult(null);
    try {
      const response = await fetch('/api/admin/indexnow', {
        method: 'POST',
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setResult({ success: true, message: data.message || 'Sitemap URLs successfully submitted to IndexNow.' });
      } else {
        setResult({ success: false, message: data.error || 'Failed to submit sitemap URLs.' });
      }
    } catch (error: any) {
      setResult({ success: false, message: error.message || 'An error occurred during submission.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Settings</h1>
          <p className={styles.pageSub}>Admin dashboard configuration</p>
        </div>
      </div>

      <div className={styles.formPanel}>
        <div className={styles.formGrid}>
          <div className={styles.formGroupFull}>
            <label className={styles.formLabel}>Platform Name</label>
            <input className={styles.formInput} defaultValue="Tapfolio" />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Default Theme</label>
            <select className={styles.formSelect} defaultValue="light">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Maintenance Mode</label>
            <select className={styles.formSelect} defaultValue="off">
              <option value="off">Off</option>
              <option value="on">On</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Registration</label>
            <select className={styles.formSelect} defaultValue="open">
              <option value="open">Open</option>
              <option value="invite">Invite Only</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Auto-refresh Interval</label>
            <select className={styles.formSelect} defaultValue="30">
              <option value="5">5 seconds</option>
              <option value="15">15 seconds</option>
              <option value="30">30 seconds</option>
              <option value="60">60 seconds</option>
            </select>
          </div>
          <div className={styles.formActions}>
            <button className={styles.submitBtn}>💾 Save Settings</button>
          </div>
        </div>
      </div>

      <div className={styles.formPanel}>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.5rem' }}>IndexNow Search Indexing</h2>
        <p style={{ fontSize: '0.85rem', color: '#64748B', marginBottom: '1.25rem' }}>
          Instantly notify search engines (such as Bing and Yandex) when pages are added, updated, or removed from your sitemap.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '0.5rem 1rem', fontSize: '0.8rem', fontWeight: 500 }}>
              <div style={{ color: '#64748B' }}>Protocol Key:</div>
              <code style={{ color: '#0F172A', fontFamily: 'monospace', fontWeight: 600 }}>c04d18a813124e1c94e04e6551583ffe</code>

              <div style={{ color: '#64748B' }}>Verification URL:</div>
              <div>
                <a
                  href="/c04d18a813124e1c94e04e6551583ffe.txt"
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: '#2563EB', textDecoration: 'underline', fontWeight: 600 }}
                >
                  /c04d18a813124e1c94e04e6551583ffe.txt
                </a>
              </div>

              <div style={{ color: '#64748B' }}>Key Status:</div>
              <div>
                <span style={{ background: '#DCFCE7', color: '#16A34A', fontSize: '0.7rem', padding: '0.15rem 0.4rem', borderRadius: '4px', fontWeight: 700 }}>
                  ACTIVE (VERIFIED)
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={handleIndexNowSubmit}
              disabled={submitting}
              className={styles.submitBtn}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: submitting ? '#94A3B8' : '#3B82F6' }}
            >
              {submitting ? '⏳ Submitting...' : '🚀 Submit Sitemap to IndexNow'}
            </button>
          </div>

          {result && (
            <div
              style={{
                fontSize: '0.8rem',
                fontWeight: 600,
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: result.success ? '1px solid #BBF7D0' : '1px solid #FECACA',
                background: result.success ? '#F0FDF4' : '#FEF2F2',
                color: result.success ? '#15803D' : '#B91C1C',
                marginTop: '0.25rem',
              }}
            >
              {result.success ? '✅ Success: ' : '❌ Error: '}
              {result.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
