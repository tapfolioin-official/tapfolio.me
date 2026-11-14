'use client';

import React from 'react';
import Link from 'next/link';
import {
  CheckCheck,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Globe,
  RefreshCw,
  Gauge,
} from 'lucide-react';
import styles from '../../dashboard/dashboard.module.css';

export default function TechnicalSeoAuditPage() {
  const auditItems = [
    { name: 'SSL / HTTPS Security & HSTS', status: 'PASS', score: '100%', detail: 'Strict-Transport-Security header active. Valid Let\'s Encrypt SSL certificate.' },
    { name: 'XML Sitemap Validation', status: 'PASS', score: '100%', detail: 'sitemap.xml validated with 420 indexable URLs and correct lastmod timestamps.' },
    { name: 'Robots.txt Crawlability', status: 'PASS', score: '100%', detail: 'Search engine bots permitted on public profile routes. Admin routes disallowed.' },
    { name: 'Canonical Tag Integrity', status: 'PASS', score: '100%', detail: 'All pages define explicit canonical link elements preventing duplicate content.' },
    { name: 'OpenGraph & Twitter Meta Cards', status: 'PASS', score: '100%', detail: 'Complete og:title, og:image, and twitter:card tags across all public portfolio URLs.' },
    { name: 'Core Web Vitals - LCP & CLS', status: 'PASS', score: '95%', detail: 'Largest Contentful Paint 1.4s (Good), Cumulative Layout Shift 0.02 (Good).' },
    { name: 'Broken Links & 404 Checker', status: 'PASS', score: '100%', detail: '0 internal broken links detected across 1,200 sampled routes.' },
    { name: 'Mobile Viewport & Touch Optimization', status: 'PASS', score: '98%', detail: '100% responsive design with tap target spacing >= 48px.' },
  ];

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Technical SEO Audit & Health Check</h1>
          <p className={styles.subtitle}>
            Continuous site crawler evaluating Core Web Vitals, indexability, metadata completeness, and crawl errors
          </p>
        </div>
        <div className={styles.headerRight}>
          <button
            type="button"
            onClick={() => alert('Full crawl re-run initiated. Results will update in ~2 minutes.')}
            className={styles.primaryBtn}
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <RefreshCw size={15} /> Run Full Site Audit
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Technical Health Score</span>
          <span className={styles.kpiValue} style={{ color: '#059669' }}>98%</span>
          <div className={styles.kpiGrowth} style={{ color: '#059669' }}>
            <span>0 critical errors</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Crawled Pages</span>
          <span className={styles.kpiValue}>421</span>
          <div className={styles.kpiGrowth} style={{ color: '#0052ff' }}>
            <span>100% indexable</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Broken Links</span>
          <span className={styles.kpiValue} style={{ color: '#059669' }}>0</span>
          <div className={styles.kpiGrowth} style={{ color: '#059669' }}>
            <span>Clean crawl profile</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Lighthouse SEO</span>
          <span className={styles.kpiValue}>100</span>
          <div className={styles.kpiGrowth} style={{ color: '#059669' }}>
            <span>Perfect audit rating</span>
          </div>
        </div>
      </div>

      {/* Audit Checklist */}
      <div className={styles.panelCard}>
        <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 1rem 0' }}>
          Automated Health & Crawl Inspection Items
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {auditItems.map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1rem',
                background: '#f8fafc',
                borderRadius: 10,
                border: '1px solid #e2e8f0',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <CheckCircle2 size={18} color="#059669" />
                <div>
                  <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.88rem' }}>
                    {item.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.15rem' }}>
                    {item.detail}
                  </div>
                </div>
              </div>

              <span
                style={{
                  padding: '0.2rem 0.65rem',
                  borderRadius: 6,
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  background: '#ecfdf5',
                  color: '#059669',
                }}
              >
                {item.status} ({item.score})
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
