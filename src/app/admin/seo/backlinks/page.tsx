'use client';

import React from 'react';
import Link from 'next/link';
import {
  Link2,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  Globe,
  Search,
} from 'lucide-react';
import styles from '../../dashboard/dashboard.module.css';

export default function BacklinkManagementPage() {
  const backlinks = [
    { domain: 'producthunt.com', target: 'https://tapfolio.me', da: 91, anchor: 'Tapfolio — Smart NFC Business Cards', type: 'Dofollow', firstSeen: '2026-08-15' },
    { domain: 'techcrunch.com', target: 'https://tapfolio.me/about', da: 93, anchor: 'contactless networking operating system', type: 'Dofollow', firstSeen: '2026-09-02' },
    { domain: 'medium.com', target: 'https://tapfolio.me', da: 94, anchor: 'Tapfolio NFC portfolio platform', type: 'Nofollow', firstSeen: '2026-09-20' },
    { domain: 'indiehackers.com', target: 'https://tapfolio.me/careers', da: 82, anchor: 'Tapfolio smart card hardware', type: 'Dofollow', firstSeen: '2026-10-04' },
    { domain: 'dev.to', target: 'https://tapfolio.me', da: 86, anchor: 'best digital business card for developers', type: 'Dofollow', firstSeen: '2026-10-18' },
  ];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Backlink & Domain Authority Profile</h1>
          <p className={styles.subtitle}>
            Inbound referring domains, anchor text distribution, dofollow ratios, and Domain Rating (DR)
          </p>
        </div>
      </header>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Domain Rating (DR)</span>
          <span className={styles.kpiValue}>68</span>
          <div className={styles.kpiGrowth} style={{ color: '#059669' }}>
            <span>↑ +6 points in 90 days</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Total Backlinks</span>
          <span className={styles.kpiValue}>3,420</span>
          <div className={styles.kpiGrowth} style={{ color: '#0052ff' }}>
            <span>↑ 18.2% new links</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Referring Domains</span>
          <span className={styles.kpiValue}>482</span>
          <div className={styles.kpiGrowth} style={{ color: '#059669' }}>
            <span>84% Dofollow</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Spam Score</span>
          <span className={styles.kpiValue} style={{ color: '#059669' }}>1%</span>
          <div className={styles.kpiGrowth} style={{ color: '#059669' }}>
            <span>Clean referring profile</span>
          </div>
        </div>
      </div>

      {/* Backlinks Table */}
      <div className={styles.tableCard}>
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Referring Domain</th>
                <th>Target Landing Page</th>
                <th>Domain Authority</th>
                <th>Anchor Text</th>
                <th>Link Attribute</th>
                <th>First Indexed</th>
              </tr>
            </thead>
            <tbody>
              {backlinks.map((b, idx) => (
                <tr key={idx}>
                  <td>
                    <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Globe size={14} color="#0052ff" /> {b.domain}
                    </div>
                  </td>
                  <td style={{ fontSize: '0.8rem', color: '#64748b' }}>{b.target}</td>
                  <td>
                    <span style={{ fontWeight: 850, color: '#059669', fontSize: '0.9rem' }}>
                      {b.da}
                    </span>
                  </td>
                  <td style={{ fontWeight: 650, color: '#334155', fontSize: '0.82rem' }}>
                    &ldquo;{b.anchor}&rdquo;
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '0.2rem 0.55rem',
                        borderRadius: 6,
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        background: b.type === 'Dofollow' ? '#ecfdf5' : '#f1f5f9',
                        color: b.type === 'Dofollow' ? '#059669' : '#64748b',
                      }}
                    >
                      {b.type}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.78rem', color: '#64748b' }}>{b.firstSeen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
