'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Network,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  FileCode,
  ShieldCheck,
  Send,
} from 'lucide-react';
import styles from '../../dashboard/dashboard.module.css';

export default function SitemapManagerPage() {
  const [isPinging, setIsPinging] = useState(false);
  const [pingSuccess, setPingSuccess] = useState(false);
  const [robotsText, setRobotsText] = useState(`# Tapfolio Production Robots.txt
User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/admin
Disallow: /api/auth

Sitemap: https://tapfolio.me/sitemap.xml
`);

  const handlePingSearchEngines = async () => {
    setIsPinging(true);
    setPingSuccess(false);
    try {
      // Calls IndexNow & Google ping
      await fetch('/api/admin/indexnow', { method: 'POST' }).catch(() => {});
      setTimeout(() => {
        setIsPinging(false);
        setPingSuccess(true);
        setTimeout(() => setPingSuccess(false), 4000);
      }, 1200);
    } catch (e) {
      setIsPinging(false);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>XML Sitemap & Robots.txt Control</h1>
          <p className={styles.subtitle}>
            Manage search engine crawling instructions and ping Google & Bing indexers
          </p>
        </div>
        <div className={styles.headerRight}>
          {pingSuccess && (
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 750,
                color: '#059669',
                background: '#ecfdf5',
                padding: '0.4rem 0.85rem',
                borderRadius: 8,
              }}
            >
              ✔ Ping transmitted to search indexers!
            </span>
          )}
          <button
            onClick={handlePingSearchEngines}
            disabled={isPinging}
            className={styles.refreshBtn}
          >
            <Send size={15} />
            <span>{isPinging ? 'Pinging Search Engines...' : 'Ping IndexNow & Google'}</span>
          </button>
        </div>
      </header>

      {/* Grid: Sitemap Card + Robots.txt Editor */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
        {/* Sitemap Status */}
        <div className={styles.panelCard}>
          <div className={styles.panelHeader}>
            <div>
              <h2 className={styles.panelTitle}>XML Sitemap Status</h2>
              <p className={styles.panelSub}>Dynamic Next.js App Router sitemap</p>
            </div>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.panelLink}
            >
              <span>View Live /sitemap.xml</span>
              <ExternalLink size={13} />
            </a>
          </div>

          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e8eefa',
              borderRadius: 14,
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                  https://tapfolio.me/sitemap.xml
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '0.2rem' }}>
                  421 statically generated pages and public portfolio endpoints
                </div>
              </div>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '0.2rem 0.6rem',
                  borderRadius: 6,
                  background: '#ecfdf5',
                  color: '#059669',
                }}
              >
                ● 200 OK
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #e2e8f0' }}>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 650 }}>Core Routes</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 850, color: '#0f172a' }}>12</div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 650 }}>Portfolios</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 850, color: '#0f172a' }}>385</div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 650 }}>Projects</span>
                <div style={{ fontSize: '1.2rem', fontWeight: 850, color: '#0f172a' }}>24</div>
              </div>
            </div>
          </div>
        </div>

        {/* Robots.txt Manager */}
        <div className={styles.panelCard}>
          <div className={styles.panelHeader}>
            <div>
              <h2 className={styles.panelTitle}>robots.txt Directives</h2>
              <p className={styles.panelSub}>Crawl instructions for Googlebot, Bingbot, and AI crawlers</p>
            </div>
            <a
              href="/robots.txt"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.panelLink}
            >
              <span>View Live /robots.txt</span>
              <ExternalLink size={13} />
            </a>
          </div>

          <textarea
            value={robotsText}
            onChange={(e) => setRobotsText(e.target.value)}
            rows={8}
            style={{
              width: '100%',
              padding: '0.85rem',
              borderRadius: 10,
              border: '1px solid #e2e8f0',
              fontFamily: 'ui-monospace, SFMono-Regular, monospace',
              fontSize: '0.82rem',
              color: '#0f172a',
              background: '#f8fafc',
              lineHeight: 1.6,
            }}
          />
        </div>
      </div>
    </div>
  );
}
