'use client';

import React from 'react';
import Link from 'next/link';
import {
  FolderGit2,
  FileText,
  Search,
  ExternalLink,
  Edit3,
  CheckCircle2,
} from 'lucide-react';
import styles from '../../dashboard/dashboard.module.css';

export default function ContentManagementPage() {
  const contentPages = [
    { title: 'Home / Hero Configurator', path: '/', wordCount: 1840, targetKw: 'smart nfc business card', readability: 'Good', lastAudit: '2026-11-12' },
    { title: 'About Tapfolio — Our Vision', path: '/about', wordCount: 960, targetKw: 'contactless business card company', readability: 'Excellent', lastAudit: '2026-11-10' },
    { title: 'Careers — Engineering & Product', path: '/careers', wordCount: 1420, targetKw: 'tapfolio careers kochi', readability: 'Good', lastAudit: '2026-11-14' },
    { title: 'Privacy Policy & Data Security', path: '/privacy', wordCount: 2200, targetKw: 'tapfolio privacy policy', readability: 'Standard', lastAudit: '2026-10-30' },
    { title: 'Terms of Service & Hardware Warranty', path: '/terms', wordCount: 2800, targetKw: 'tapfolio terms of service', readability: 'Standard', lastAudit: '2026-10-30' },
  ];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>SEO Content & Landing Pages</h1>
          <p className={styles.subtitle}>
            Audit word counts, keyword density, semantic content structure, and readability across public routes
          </p>
        </div>
        <div className={styles.headerRight}>
          <Link
            href="/admin/seo/website"
            className={styles.primaryBtn}
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <Edit3 size={15} /> Edit Route Metadata
          </Link>
        </div>
      </header>

      {/* Content Table */}
      <div className={styles.tableCard}>
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Page Title & Route</th>
                <th>Word Count</th>
                <th>Primary Keyword Focus</th>
                <th>Readability</th>
                <th>Last Crawled</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contentPages.map((p, idx) => (
                <tr key={idx}>
                  <td>
                    <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>{p.title}</div>
                    <div style={{ fontSize: '0.75rem', color: '#0052ff' }}>{p.path}</div>
                  </td>
                  <td style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                    {p.wordCount.toLocaleString()} words
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '0.2rem 0.55rem',
                        borderRadius: 6,
                        fontSize: '0.72rem',
                        fontWeight: 750,
                        background: '#edf3ff',
                        color: '#0052ff',
                      }}
                    >
                      {p.targetKw}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '0.2rem 0.55rem',
                        borderRadius: 6,
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        background: '#ecfdf5',
                        color: '#059669',
                      }}
                    >
                      {p.readability}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.78rem', color: '#64748b' }}>{p.lastAudit}</td>
                  <td style={{ textAlign: 'right' }}>
                    <Link
                      href={`/admin/seo/website`}
                      className={styles.secondaryBtn}
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', textDecoration: 'none' }}
                    >
                      Edit SEO
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
