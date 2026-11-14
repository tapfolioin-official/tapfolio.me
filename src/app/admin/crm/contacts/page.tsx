'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Contact,
  Search,
  Filter,
  UserPlus,
  Mail,
  Phone,
  Building2,
  Globe,
  Smartphone,
  Radio,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronRight,
  X,
  CreditCard,
  Sparkles,
  Download,
} from 'lucide-react';
import styles from '../../dashboard/dashboard.module.css';

interface UnifiedContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  title: string;
  source: 'website' | 'mobile_app' | 'nfc_card' | 'enterprise';
  status: 'ACTIVE' | 'LEAD' | 'VIP' | 'CHURNED';
  plan: 'FREE' | 'PRO' | 'ENTERPRISE';
  portfolioUrl?: string;
  nfcCardsCount: number;
  totalTaps: number;
  notes: string;
  tags: string[];
  createdAt: string;
  lastActive: string;
}

export default function ContactsManagementPage() {
  const [contacts, setContacts] = useState<UnifiedContact[]>([]);
  const [metrics, setMetrics] = useState({
    totalContacts: 0,
    enterpriseAccounts: 0,
    activeNfcUsers: 0,
    mobileAppUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [planFilter, setPlanFilter] = useState('ALL');
  const [selectedContact, setSelectedContact] = useState<UnifiedContact | null>(null);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      if (sourceFilter !== 'ALL') params.set('source', sourceFilter);
      if (planFilter !== 'ALL') params.set('plan', planFilter);

      const res = await fetch(`/api/admin/crm/contacts?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setContacts(data.contacts);
        if (data.metrics) setMetrics(data.metrics);
      }
    } catch (err) {
      console.error('Failed to fetch CRM contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [sourceFilter, planFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchContacts();
  };

  return (
    <div className={styles.page}>
      {/* Page Header */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Unified Customer Contacts</h1>
          <p className={styles.subtitle}>
            Omnichannel 360° directory connecting website users, mobile app accounts, and active NFC cardholders
          </p>
        </div>
        <div className={styles.headerRight}>
          <Link
            href="/admin/crm/leads"
            className={styles.secondaryBtn}
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <UserPlus size={16} /> Manage Inbound Leads
          </Link>
          <Link
            href="/admin/crm/pipelines"
            className={styles.primaryBtn}
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <Layers size={16} /> View Deals Pipeline
          </Link>
        </div>
      </header>

      {/* Top 4 KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Total Unified Contacts</span>
          <span className={styles.kpiValue}>
            {loading ? '—' : metrics.totalContacts.toLocaleString()}
          </span>
          <div className={styles.kpiGrowth} style={{ color: '#059669' }}>
            <span>↑ 18.4%</span>
            <span style={{ color: '#94a3b8', fontWeight: 500 }}>vs last month</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Enterprise Accounts</span>
          <span className={styles.kpiValue}>
            {loading ? '—' : metrics.enterpriseAccounts.toLocaleString()}
          </span>
          <div className={styles.kpiGrowth} style={{ color: '#0052ff' }}>
            <span>↑ 24.1%</span>
            <span style={{ color: '#94a3b8', fontWeight: 500 }}>high-LTV clients</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Active NFC Cardholders</span>
          <span className={styles.kpiValue}>
            {loading ? '—' : metrics.activeNfcUsers.toLocaleString()}
          </span>
          <div className={styles.kpiGrowth} style={{ color: '#059669' }}>
            <span>↑ 31.2%</span>
            <span style={{ color: '#94a3b8', fontWeight: 500 }}>hardware deployed</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Mobile App Users</span>
          <span className={styles.kpiValue}>
            {loading ? '—' : metrics.mobileAppUsers.toLocaleString()}
          </span>
          <div className={styles.kpiGrowth} style={{ color: '#0052ff' }}>
            <span>↑ 14.8%</span>
            <span style={{ color: '#94a3b8', fontWeight: 500 }}>iOS & Android</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className={styles.panelCard} style={{ padding: '1rem 1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, maxWidth: 420 }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: 12, color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search by name, email, company, or tag..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem 0.6rem 2.3rem',
                  borderRadius: 10,
                  border: '1px solid #e2e8f0',
                  fontSize: '0.85rem',
                  outline: 'none',
                }}
              />
            </div>
            <button
              type="submit"
              className={styles.secondaryBtn}
              style={{ padding: '0.6rem 1rem' }}
            >
              Search
            </button>
          </form>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>SOURCE:</span>
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  background: '#ffffff',
                }}
              >
                <option value="ALL">All Sources</option>
                <option value="website">Website</option>
                <option value="mobile_app">Mobile App</option>
                <option value="nfc_card">NFC Card</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>PLAN:</span>
              <select
                value={planFilter}
                onChange={(e) => setPlanFilter(e.target.value)}
                style={{
                  padding: '0.5rem 0.75rem',
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  background: '#ffffff',
                }}
              >
                <option value="ALL">All Plans</option>
                <option value="FREE">Free</option>
                <option value="PRO">Pro</option>
                <option value="ENTERPRISE">Enterprise</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Contacts Table */}
      <div className={styles.tableCard}>
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Customer / Contact</th>
                <th>Company & Title</th>
                <th>Channel Source</th>
                <th>Plan Status</th>
                <th>Hardware & Taps</th>
                <th>Last Active</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    Loading unified CRM contacts...
                  </td>
                </tr>
              ) : contacts.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '3rem', color: '#94a3b8' }}>
                    No contacts found matching the filters.
                  </td>
                </tr>
              ) : (
                contacts.map((c) => {
                  return (
                    <tr
                      key={c.id}
                      onClick={() => setSelectedContact(c)}
                      style={{ cursor: 'pointer' }}
                    >
                      {/* Name & Email */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: '50%',
                              background: '#edf3ff',
                              color: '#0052ff',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800,
                              fontSize: '0.85rem',
                              flexShrink: 0,
                            }}
                          >
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 750, color: '#0f172a' }}>{c.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{c.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Company & Role */}
                      <td>
                        <div style={{ fontWeight: 650, color: '#334155' }}>{c.company}</div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{c.title}</div>
                      </td>

                      {/* Channel Source */}
                      <td>
                        {c.source === 'mobile_app' ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              padding: '0.25rem 0.6rem',
                              borderRadius: 6,
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              background: '#eff6ff',
                              color: '#0284c7',
                            }}
                          >
                            <Smartphone size={13} /> Mobile App
                          </span>
                        ) : c.source === 'nfc_card' ? (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              padding: '0.25rem 0.6rem',
                              borderRadius: 6,
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              background: '#fdf4ff',
                              color: '#a855f7',
                            }}
                          >
                            <Radio size={13} /> NFC Hardware
                          </span>
                        ) : (
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              padding: '0.25rem 0.6rem',
                              borderRadius: 6,
                              fontSize: '0.74rem',
                              fontWeight: 700,
                              background: '#edf3ff',
                              color: '#0052ff',
                            }}
                          >
                            <Globe size={13} /> Website
                          </span>
                        )}
                      </td>

                      {/* Plan Status */}
                      <td>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '0.2rem 0.55rem',
                            borderRadius: 6,
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            letterSpacing: '0.3px',
                            background:
                              c.plan === 'ENTERPRISE'
                                ? '#fef3c7'
                                : c.plan === 'PRO'
                                ? '#ecfdf5'
                                : '#f1f5f9',
                            color:
                              c.plan === 'ENTERPRISE'
                                ? '#b45309'
                                : c.plan === 'PRO'
                                ? '#059669'
                                : '#64748b',
                          }}
                        >
                          {c.plan}
                        </span>
                      </td>

                      {/* Hardware & Taps */}
                      <td>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>
                          {c.totalTaps.toLocaleString()} Taps
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
                          {c.nfcCardsCount} NFC Card{c.nfcCardsCount !== 1 ? 's' : ''}
                        </div>
                      </td>

                      {/* Last Active */}
                      <td style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        {new Date(c.lastActive).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>

                      {/* Action */}
                      <td style={{ textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedContact(c);
                          }}
                          className={styles.secondaryBtn}
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                        >
                          View 360° <ChevronRight size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer 360° Profile Drawer Modal */}
      {selectedContact && (
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
          onClick={() => setSelectedContact(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 16,
              width: '100%',
              maxWidth: 680,
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 20px 40px rgba(0, 82, 255, 0.12)',
              border: '1px solid #e2e8f0',
              padding: '1.75rem',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: 'linear-gradient(135deg, #0052ff 0%, #0037b3 100%)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.3rem',
                    fontWeight: 800,
                  }}
                >
                  {selectedContact.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 850, margin: 0, color: '#0f172a' }}>
                    {selectedContact.name}
                  </h2>
                  <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
                    {selectedContact.title} at <strong>{selectedContact.company}</strong>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedContact(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '0.4rem',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Profile Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
                  Email Address
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Mail size={14} color="#0052ff" /> {selectedContact.email}
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: 10, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase' }}>
                  Phone Number
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Phone size={14} color="#0052ff" /> {selectedContact.phone}
                </div>
              </div>
            </div>

            {/* Hardware & Subscription Section */}
            <div
              style={{
                background: '#edf3ff',
                borderRadius: 12,
                padding: '1rem',
                marginBottom: '1.25rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '0.75rem',
                textAlign: 'center',
              }}
            >
              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#0052ff', textTransform: 'uppercase' }}>
                  Account Tier
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', marginTop: '0.2rem' }}>
                  {selectedContact.plan}
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#0052ff', textTransform: 'uppercase' }}>
                  NFC Cards Paired
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', marginTop: '0.2rem' }}>
                  {selectedContact.nfcCardsCount} Cards
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#0052ff', textTransform: 'uppercase' }}>
                  Total Scan Telemetry
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', marginTop: '0.2rem' }}>
                  {selectedContact.totalTaps.toLocaleString()} Taps
                </div>
              </div>
            </div>

            {/* Public Portfolio URL */}
            {selectedContact.portfolioUrl && (
              <div style={{ marginBottom: '1.25rem' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                  Live Portfolio Link
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    background: '#f8fafc',
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <span style={{ fontSize: '0.82rem', color: '#0052ff', fontWeight: 650 }}>
                    {selectedContact.portfolioUrl}
                  </span>
                  <a
                    href={selectedContact.portfolioUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#0052ff',
                      textDecoration: 'none',
                    }}
                  >
                    Open <ExternalLink size={13} />
                  </a>
                </div>
              </div>
            )}

            {/* Notes & Tags */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                CRM Notes & Context
              </div>
              <div
                style={{
                  padding: '0.75rem',
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 8,
                  fontSize: '0.82rem',
                  color: '#334155',
                  lineHeight: 1.5,
                }}
              >
                {selectedContact.notes}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
              <button
                type="button"
                onClick={() => alert(`Email composition opened for ${selectedContact.email}`)}
                className={styles.secondaryBtn}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Mail size={15} /> Send Direct Email
              </button>
              <Link
                href={`/admin/crm/tasks`}
                className={styles.primaryBtn}
                style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Calendar size={15} /> Schedule Follow-up
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
