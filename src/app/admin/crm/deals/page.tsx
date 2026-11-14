'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  DollarSign,
  TrendingUp,
  Award,
  Filter,
  Search,
  Plus,
  CheckCircle2,
  Calendar,
  Building2,
  ArrowRight,
} from 'lucide-react';
import styles from '../../dashboard/dashboard.module.css';

interface Deal {
  id: string;
  name: string;
  company: string;
  value: number;
  stage: 'DISCOVERY' | 'PROPOSAL' | 'NEGOTIATION' | 'WON' | 'LOST';
  probability: number;
  expectedClose: string;
  owner: string;
  cardsCount: number;
}

const INITIAL_DEALS: Deal[] = [
  {
    id: 'deal-1',
    name: 'Acme Executive Team NFC Rollout (45 Cards)',
    company: 'Acme Technologies Inc.',
    value: 12400,
    stage: 'WON',
    probability: 100,
    expectedClose: '2026-11-18',
    owner: 'Nibrasul Haqq',
    cardsCount: 45,
  },
  {
    id: 'deal-2',
    name: 'Apex Global Field Operations Hardware Suite',
    company: 'Apex Logistics Global',
    value: 24500,
    stage: 'NEGOTIATION',
    probability: 80,
    expectedClose: '2026-11-28',
    owner: 'Nibrasul Haqq',
    cardsCount: 85,
  },
  {
    id: 'deal-3',
    name: 'Hyperloop Engineering Team Card Deployment',
    company: 'Hyperloop Innovations',
    value: 9800,
    stage: 'WON',
    probability: 100,
    expectedClose: '2026-11-12',
    owner: 'Nibrasul Haqq',
    cardsCount: 30,
  },
  {
    id: 'deal-4',
    name: 'Venture Pulse Partner & Associate Passports',
    company: 'Venture Pulse Capital',
    value: 6800,
    stage: 'PROPOSAL',
    probability: 60,
    expectedClose: '2026-12-05',
    owner: 'Support Desk',
    cardsCount: 18,
  },
  {
    id: 'deal-5',
    name: 'Nordic Design Studio Brand Customization Bundle',
    company: 'Nordic Design Studio',
    value: 4200,
    stage: 'DISCOVERY',
    probability: 40,
    expectedClose: '2026-12-15',
    owner: 'Nibrasul Haqq',
    cardsCount: 12,
  },
];

export default function DealsManagementPage() {
  const [deals, setDeals] = useState<Deal[]>(INITIAL_DEALS);
  const [stageFilter, setStageFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const totalValue = deals.reduce((acc, d) => acc + d.value, 0);
  const wonValue = deals.filter((d) => d.stage === 'WON').reduce((acc, d) => acc + d.value, 0);
  const activePipelineValue = deals
    .filter((d) => d.stage !== 'WON' && d.stage !== 'LOST')
    .reduce((acc, d) => acc + d.value, 0);

  const filteredDeals = deals.filter((d) => {
    const matchesStage = stageFilter === 'ALL' || d.stage === stageFilter;
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.company.toLowerCase().includes(search.toLowerCase()) ||
      d.owner.toLowerCase().includes(search.toLowerCase());
    return matchesStage && matchesSearch;
  });

  return (
    <div className={styles.page}>
      {/* Page Header */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Enterprise Deals & Pipeline Value</h1>
          <p className={styles.subtitle}>
            Track high-volume sales contracts, custom card bundle negotiations, and revenue forecasts
          </p>
        </div>
        <div className={styles.headerRight}>
          <Link
            href="/admin/crm/pipelines"
            className={styles.secondaryBtn}
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.45rem' }}
          >
            Kanban Board View
          </Link>
          <button
            type="button"
            onClick={() => alert('Deal creation form is integrated with Pipeline stages.')}
            className={styles.primaryBtn}
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <Plus size={16} /> New Deal Opportunity
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Total Pipeline Value</span>
          <span className={styles.kpiValue}>${totalValue.toLocaleString()}</span>
          <div className={styles.kpiGrowth} style={{ color: '#0052ff' }}>
            <span>↑ 31.4%</span>
            <span style={{ color: '#94a3b8', fontWeight: 500 }}>across all stages</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Closed Won Revenue</span>
          <span className={styles.kpiValue}>${wonValue.toLocaleString()}</span>
          <div className={styles.kpiGrowth} style={{ color: '#059669' }}>
            <span>↑ 24.2%</span>
            <span style={{ color: '#94a3b8', fontWeight: 500 }}>booked revenue</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>In-Flight Negotiation</span>
          <span className={styles.kpiValue}>${activePipelineValue.toLocaleString()}</span>
          <div className={styles.kpiGrowth} style={{ color: '#0284c7' }}>
            <span>80% win probability</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Average Deal Size</span>
          <span className={styles.kpiValue}>
            ${Math.round(totalValue / deals.length).toLocaleString()}
          </span>
          <div className={styles.kpiGrowth} style={{ color: '#059669' }}>
            <span>↑ $1,200</span>
            <span style={{ color: '#94a3b8', fontWeight: 500 }}>vs previous quarter</span>
          </div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className={styles.panelCard} style={{ padding: '0.85rem 1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: 340 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: 11, color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Filter deals, accounts or owners..."
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

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['ALL', 'DISCOVERY', 'PROPOSAL', 'NEGOTIATION', 'WON'].map((stg) => (
              <button
                key={stg}
                type="button"
                onClick={() => setStageFilter(stg)}
                style={{
                  padding: '0.45rem 0.85rem',
                  borderRadius: 8,
                  fontSize: '0.78rem',
                  fontWeight: 750,
                  border: stageFilter === stg ? '1px solid #0052ff' : '1px solid #e2e8f0',
                  background: stageFilter === stg ? '#0052ff' : '#ffffff',
                  color: stageFilter === stg ? '#ffffff' : '#475569',
                  cursor: 'pointer',
                }}
              >
                {stg}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Deals Table */}
      <div className={styles.tableCard}>
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Deal Title & Scope</th>
                <th>Organization</th>
                <th>Deal Value</th>
                <th>Stage Status</th>
                <th>Probability</th>
                <th>Target Close</th>
                <th>Deal Owner</th>
              </tr>
            </thead>
            <tbody>
              {filteredDeals.map((d) => (
                <tr key={d.id}>
                  <td>
                    <div style={{ fontWeight: 750, color: '#0f172a', fontSize: '0.88rem' }}>{d.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{d.cardsCount} Hardware Units Included</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 650, color: '#334155', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Building2 size={14} color="#0052ff" /> {d.company}
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 850, color: '#059669', fontSize: '0.92rem' }}>
                      ${d.value.toLocaleString()}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '0.2rem 0.55rem',
                        borderRadius: 6,
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        background:
                          d.stage === 'WON'
                            ? '#ecfdf5'
                            : d.stage === 'NEGOTIATION'
                            ? '#eff6ff'
                            : '#f8fafc',
                        color:
                          d.stage === 'WON'
                            ? '#059669'
                            : d.stage === 'NEGOTIATION'
                            ? '#0284c7'
                            : '#475569',
                      }}
                    >
                      {d.stage}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: 60, height: 6, background: '#e2e8f0', borderRadius: 4, overflow: 'hidden' }}>
                        <div
                          style={{
                            width: `${d.probability}%`,
                            height: '100%',
                            background: d.probability === 100 ? '#059669' : '#0052ff',
                          }}
                        />
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 750, color: '#0f172a' }}>{d.probability}%</span>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    {new Date(d.expectedClose).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </td>
                  <td style={{ fontSize: '0.8rem', fontWeight: 650, color: '#334155' }}>
                    {d.owner}
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
