'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Search,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import styles from '../dashboard/dashboard.module.css';

interface Subscription {
  id: string;
  userName: string;
  userEmail: string;
  plan: 'PRO_MONTHLY' | 'PRO_ANNUAL' | 'ENTERPRISE';
  amount: number;
  status: 'ACTIVE' | 'TRIALING' | 'PAST_DUE' | 'CANCELED';
  currentPeriodEnd: string;
  paymentMethod: string;
  cardsPaired: number;
}

const SUBS_DATA: Subscription[] = [
  {
    id: 'sub-101',
    userName: 'Sarah Jenkins',
    userEmail: 'sarah.jenkins@acmecorp.io',
    plan: 'ENTERPRISE',
    amount: 990,
    status: 'ACTIVE',
    currentPeriodEnd: '2027-11-15',
    paymentMethod: 'Mastercard •••• 4242',
    cardsPaired: 45,
  },
  {
    id: 'sub-102',
    userName: 'David Chen',
    userEmail: 'david@venturepulse.com',
    plan: 'PRO_ANNUAL',
    amount: 144,
    status: 'ACTIVE',
    currentPeriodEnd: '2027-08-20',
    paymentMethod: 'Visa •••• 8812',
    cardsPaired: 3,
  },
  {
    id: 'sub-103',
    userName: 'Elena Rostova',
    userEmail: 'elena.rostova@nordicdesign.se',
    plan: 'PRO_MONTHLY',
    amount: 14.99,
    status: 'ACTIVE',
    currentPeriodEnd: '2026-12-10',
    paymentMethod: 'Apple Pay',
    cardsPaired: 2,
  },
  {
    id: 'sub-104',
    userName: 'Priya Sharma',
    userEmail: 'priya.sharma@hyperloop.in',
    plan: 'ENTERPRISE',
    amount: 650,
    status: 'ACTIVE',
    currentPeriodEnd: '2027-09-01',
    paymentMethod: 'Corporate Wire',
    cardsPaired: 30,
  },
  {
    id: 'sub-105',
    userName: 'Alexander Vance',
    userEmail: 'alex.vance@blackmesa.org',
    plan: 'PRO_MONTHLY',
    amount: 14.99,
    status: 'PAST_DUE',
    currentPeriodEnd: '2026-11-08',
    paymentMethod: 'Visa •••• 1092',
    cardsPaired: 1,
  },
];

export default function SubscriptionsPage() {
  const [subs, setSubs] = useState<Subscription[]>(SUBS_DATA);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const filtered = subs.filter((s) => {
    const matchesFilter = filter === 'ALL' || s.status === filter;
    const matchesSearch =
      s.userName.toLowerCase().includes(search.toLowerCase()) ||
      s.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      s.plan.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Subscriptions & Recurring Revenue</h1>
          <p className={styles.subtitle}>
            Manage active memberships, corporate seats, billing intervals, renewal status, and churn prevention
          </p>
        </div>
      </header>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Total Paid Memberships</span>
          <span className={styles.kpiValue}>7,842</span>
          <div className={styles.kpiGrowth} style={{ color: '#059669' }}>
            <span>↑ 18.7%</span>
            <span style={{ color: '#94a3b8', fontWeight: 500 }}>paying users</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Monthly Recurring (MRR)</span>
          <span className={styles.kpiValue}>$38,420</span>
          <div className={styles.kpiGrowth} style={{ color: '#0052ff' }}>
            <span>↑ 24.5%</span>
            <span style={{ color: '#94a3b8', fontWeight: 500 }}>recurring revenue</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Annual Run Rate (ARR)</span>
          <span className={styles.kpiValue}>$461,040</span>
          <div className={styles.kpiGrowth} style={{ color: '#059669' }}>
            <span>↑ $82K this quarter</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Net Monthly Churn</span>
          <span className={styles.kpiValue} style={{ color: '#059669' }}>1.2%</span>
          <div className={styles.kpiGrowth} style={{ color: '#059669' }}>
            <span>Best-in-class retention</span>
          </div>
        </div>
      </div>

      {/* Filter Strip */}
      <div className={styles.panelCard} style={{ padding: '0.85rem 1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', width: 340 }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: 11, color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search subscriber, email or plan..."
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
            {['ALL', 'ACTIVE', 'PAST_DUE', 'CANCELED'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilter(st)}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: 8,
                  fontSize: '0.78rem',
                  fontWeight: 750,
                  border: filter === st ? '1px solid #0052ff' : '1px solid #e2e8f0',
                  background: filter === st ? '#0052ff' : '#ffffff',
                  color: filter === st ? '#ffffff' : '#475569',
                  cursor: 'pointer',
                }}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Subscriptions Table */}
      <div className={styles.tableCard}>
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Subscriber Account</th>
                <th>Membership Plan</th>
                <th>Billing Amount</th>
                <th>Billing Status</th>
                <th>Payment Method</th>
                <th>Renewal / Period End</th>
                <th>Hardware Included</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id}>
                  <td>
                    <div style={{ fontWeight: 750, color: '#0f172a', fontSize: '0.88rem' }}>{s.userName}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{s.userEmail}</div>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '0.2rem 0.55rem',
                        borderRadius: 6,
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        background:
                          s.plan === 'ENTERPRISE'
                            ? '#fef3c7'
                            : s.plan === 'PRO_ANNUAL'
                            ? '#edf3ff'
                            : '#f1f5f9',
                        color:
                          s.plan === 'ENTERPRISE'
                            ? '#b45309'
                            : s.plan === 'PRO_ANNUAL'
                            ? '#0052ff'
                            : '#334155',
                      }}
                    >
                      {s.plan.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 800, color: '#059669', fontSize: '0.9rem' }}>
                      ${s.amount.toFixed(2)}
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '0.2rem 0.55rem',
                        borderRadius: 6,
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        background: s.status === 'ACTIVE' ? '#ecfdf5' : '#fee2e2',
                        color: s.status === 'ACTIVE' ? '#059669' : '#dc2626',
                      }}
                    >
                      {s.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.82rem', color: '#334155' }}>{s.paymentMethod}</td>
                  <td style={{ fontSize: '0.78rem', color: '#64748b' }}>{s.currentPeriodEnd}</td>
                  <td style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>
                    {s.cardsPaired} NFC Card{s.cardsPaired !== 1 ? 's' : ''}
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
