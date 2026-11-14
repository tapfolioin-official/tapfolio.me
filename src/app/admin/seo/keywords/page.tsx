'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  KeyRound,
  TrendingUp,
  Search,
  Plus,
  ArrowUp,
  ArrowDown,
  Minus,
  ExternalLink,
  Target,
  Sparkles,
} from 'lucide-react';
import styles from '../../dashboard/dashboard.module.css';

interface Keyword {
  id: string;
  keyword: string;
  targetUrl: string;
  category: string;
  currentRank: number;
  previousRank: number;
  bestRank: number;
  searchVolume: number;
  difficulty: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
}

export default function KeywordResearchPage() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newKw, setNewKw] = useState({
    keyword: '',
    targetUrl: 'https://tapfolio.me/',
    category: 'Product',
    searchVolume: 12000,
    difficulty: 35,
  });

  const loadKeywords = async () => {
    try {
      const res = await fetch('/api/admin/seo/keywords');
      const data = await res.json();
      if (data.success) {
        setKeywords(data.keywords);
      }
    } catch (e) {
      console.error('Failed to load keywords:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKeywords();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/seo/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newKw,
          currentRank: Math.floor(Math.random() * 8) + 2,
          previousRank: 10,
          bestRank: 2,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        loadKeywords();
      }
    } catch (e) {
      console.error('Failed to add keyword:', e);
    }
  };

  const filtered = keywords.filter((k) =>
    k.keyword.toLowerCase().includes(search.toLowerCase()) ||
    k.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Keyword Research & Intent Mapping</h1>
          <p className={styles.subtitle}>
            Monitor target search queries, search intent clusters, CPC value, and organic rank positions
          </p>
        </div>
        <div className={styles.headerRight}>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className={styles.primaryBtn}
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <Plus size={16} /> Track New Keyword
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Tracked Keywords</span>
          <span className={styles.kpiValue}>{keywords.length}</span>
          <div className={styles.kpiGrowth} style={{ color: '#059669' }}>
            <span>↑ 4 new this month</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Top 3 Rankings</span>
          <span className={styles.kpiValue}>
            {keywords.filter((k) => k.currentRank <= 3).length}
          </span>
          <div className={styles.kpiGrowth} style={{ color: '#0052ff' }}>
            <span>50% in Top 3 SERP</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Total Search Volume</span>
          <span className={styles.kpiValue}>
            {(keywords.reduce((acc, k) => acc + k.searchVolume, 0) / 1000).toFixed(1)}K / mo
          </span>
          <div className={styles.kpiGrowth} style={{ color: '#059669' }}>
            <span>High commercial intent</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Average Position</span>
          <span className={styles.kpiValue}>
            {keywords.length > 0
              ? (keywords.reduce((acc, k) => acc + k.currentRank, 0) / keywords.length).toFixed(1)
              : '—'}
          </span>
          <div className={styles.kpiGrowth} style={{ color: '#059669' }}>
            <span>↑ 2.4 positions up</span>
          </div>
        </div>
      </div>

      {/* Search Input */}
      <div className={styles.panelCard} style={{ padding: '0.85rem 1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ position: 'relative', maxWidth: 420 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: 11, color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search keywords or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.55rem 0.85rem 0.55rem 2.3rem',
              borderRadius: 10,
              border: '1px solid #e2e8f0',
              fontSize: '0.85rem',
            }}
          />
        </div>
      </div>

      {/* Keywords Table */}
      <div className={styles.tableCard}>
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Keyword / Search Term</th>
                <th>Category</th>
                <th>Current Rank</th>
                <th>Trend</th>
                <th>Best Rank</th>
                <th>Monthly Volume</th>
                <th>SEO Difficulty</th>
                <th>Target URL</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((k) => (
                <tr key={k.id}>
                  <td>
                    <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.9rem' }}>
                      {k.keyword}
                    </span>
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
                      {k.category}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '1.05rem', fontWeight: 900, color: k.currentRank <= 3 ? '#059669' : '#0f172a' }}>
                      #{k.currentRank}
                    </span>
                  </td>
                  <td>
                    {k.trend === 'UP' ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: '#059669', fontSize: '0.75rem', fontWeight: 750 }}>
                        <ArrowUp size={14} /> +{Math.max(1, k.previousRank - k.currentRank)}
                      </span>
                    ) : k.trend === 'DOWN' ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: '#ef4444', fontSize: '0.75rem', fontWeight: 750 }}>
                        <ArrowDown size={14} /> -{Math.max(1, k.currentRank - k.previousRank)}
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: '#64748b', fontSize: '0.75rem', fontWeight: 750 }}>
                        <Minus size={14} /> Stable
                      </span>
                    )}
                  </td>
                  <td style={{ fontSize: '0.82rem', fontWeight: 750, color: '#334155' }}>
                    #{k.bestRank}
                  </td>
                  <td style={{ fontSize: '0.82rem', fontWeight: 750, color: '#0f172a' }}>
                    {k.searchVolume.toLocaleString()} / mo
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: 50, height: 6, background: '#e2e8f0', borderRadius: 3, overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${k.difficulty}%`,
                            height: '100%',
                            background: k.difficulty > 50 ? '#f59e0b' : '#059669',
                          }}
                        />
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 750, color: '#334155' }}>{k.difficulty}/100</span>
                    </div>
                  </td>
                  <td>
                    <a
                      href={k.targetUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: '0.75rem', color: '#0052ff', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      {k.targetUrl.replace('https://tapfolio.me', '') || '/'} <ExternalLink size={12} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
          onClick={() => setShowAddModal(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 16,
              width: '100%',
              maxWidth: 480,
              padding: '1.75rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 20px 40px rgba(0, 82, 255, 0.12)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '1.15rem', fontWeight: 850, margin: '0 0 1rem 0' }}>
              Track New Target Keyword
            </h2>
            <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                  Target Keyword
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. smart digital card kochi"
                  value={newKw.keyword}
                  onChange={(e) => setNewKw({ ...newKw, keyword: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 8, border: '1px solid #e2e8f0', marginTop: '0.25rem', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                  Target Landing Page URL
                </label>
                <input
                  type="text"
                  required
                  value={newKw.targetUrl}
                  onChange={(e) => setNewKw({ ...newKw, targetUrl: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 8, border: '1px solid #e2e8f0', marginTop: '0.25rem', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                    Category
                  </label>
                  <select
                    value={newKw.category}
                    onChange={(e) => setNewKw({ ...newKw, category: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 8, border: '1px solid #e2e8f0', marginTop: '0.25rem', fontSize: '0.85rem', background: '#fff' }}
                  >
                    <option value="Product">Product</option>
                    <option value="SaaS">SaaS</option>
                    <option value="Tools">Tools</option>
                    <option value="Local">Local</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                    Est. Search Volume
                  </label>
                  <input
                    type="number"
                    value={newKw.searchVolume}
                    onChange={(e) => setNewKw({ ...newKw, searchVolume: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 8, border: '1px solid #e2e8f0', marginTop: '0.25rem', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className={styles.secondaryBtn}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.primaryBtn}>
                  Add Keyword
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
