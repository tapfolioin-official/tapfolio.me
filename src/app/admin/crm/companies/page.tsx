'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Building2,
  Users,
  Radio,
  DollarSign,
  Plus,
  Search,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Briefcase,
} from 'lucide-react';
import styles from '../../dashboard/dashboard.module.css';

interface Company {
  id: string;
  name: string;
  industry: string;
  primaryContact: string;
  contactEmail: string;
  cardsDeployed: number;
  activeMembers: number;
  dealValue: number;
  status: 'ACTIVE' | 'TRIAL' | 'NEGOTIATION' | 'EXPIRING';
  domain: string;
}

const INITIAL_COMPANIES: Company[] = [
  {
    id: 'comp-1',
    name: 'Acme Technologies Inc.',
    industry: 'Enterprise Software & SaaS',
    primaryContact: 'Sarah Jenkins',
    contactEmail: 'sarah.jenkins@acmecorp.io',
    cardsDeployed: 45,
    activeMembers: 120,
    dealValue: 12400,
    status: 'ACTIVE',
    domain: 'acmecorp.io',
  },
  {
    id: 'comp-2',
    name: 'Venture Pulse Capital',
    industry: 'Venture Capital & Private Equity',
    primaryContact: 'David Chen',
    contactEmail: 'david@venturepulse.com',
    cardsDeployed: 18,
    activeMembers: 35,
    dealValue: 6800,
    status: 'ACTIVE',
    domain: 'venturepulse.com',
  },
  {
    id: 'comp-3',
    name: 'Nordic Design Studio',
    industry: 'Creative & Architecture Agency',
    primaryContact: 'Elena Rostova',
    contactEmail: 'elena.rostova@nordicdesign.se',
    cardsDeployed: 12,
    activeMembers: 24,
    dealValue: 4200,
    status: 'TRIAL',
    domain: 'nordicdesign.se',
  },
  {
    id: 'comp-4',
    name: 'Apex Logistics Global',
    industry: 'Supply Chain & Freight Logistics',
    primaryContact: 'Marcus Brody',
    contactEmail: 'm.brody@apexlogistics.com',
    cardsDeployed: 85,
    activeMembers: 210,
    dealValue: 24500,
    status: 'NEGOTIATION',
    domain: 'apexlogistics.com',
  },
  {
    id: 'comp-5',
    name: 'Hyperloop Innovations',
    industry: 'High-Tech Mobility & Engineering',
    primaryContact: 'Priya Sharma',
    contactEmail: 'priya.sharma@hyperloop.in',
    cardsDeployed: 30,
    activeMembers: 75,
    dealValue: 9800,
    status: 'ACTIVE',
    domain: 'hyperloop.in',
  },
];

export default function CompaniesManagementPage() {
  const [companies, setCompanies] = useState<Company[]>(INITIAL_COMPANIES);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: '',
    industry: 'Technology & SaaS',
    primaryContact: '',
    contactEmail: '',
    cardsDeployed: 10,
    dealValue: 2500,
    domain: '',
  });

  const filteredCompanies = companies.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase()) ||
      c.primaryContact.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.name || !newCompany.contactEmail) return;

    const created: Company = {
      id: `comp-${Date.now()}`,
      name: newCompany.name,
      industry: newCompany.industry,
      primaryContact: newCompany.primaryContact || 'Admin',
      contactEmail: newCompany.contactEmail,
      cardsDeployed: Number(newCompany.cardsDeployed) || 1,
      activeMembers: Number(newCompany.cardsDeployed) * 2,
      dealValue: Number(newCompany.dealValue) || 1000,
      status: 'ACTIVE',
      domain: newCompany.domain || 'tapfolio.me',
    };

    setCompanies([created, ...companies]);
    setShowAddModal(false);
    setNewCompany({
      name: '',
      industry: 'Technology & SaaS',
      primaryContact: '',
      contactEmail: '',
      cardsDeployed: 10,
      dealValue: 2500,
      domain: '',
    });
  };

  return (
    <div className={styles.page}>
      {/* Page Header */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Corporate Companies & Organizations</h1>
          <p className={styles.subtitle}>
            Manage enterprise accounts, multi-seat corporate teams, and volume NFC card deployments
          </p>
        </div>
        <div className={styles.headerRight}>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className={styles.primaryBtn}
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <Plus size={16} /> Add Corporate Account
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Total Corporate Accounts</span>
          <span className={styles.kpiValue}>{companies.length}</span>
          <div className={styles.kpiGrowth} style={{ color: '#059669' }}>
            <span>↑ 12.5%</span>
            <span style={{ color: '#94a3b8', fontWeight: 500 }}>active contracts</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Enterprise Pipeline Value</span>
          <span className={styles.kpiValue}>
            ${companies.reduce((sum, c) => sum + c.dealValue, 0).toLocaleString()}
          </span>
          <div className={styles.kpiGrowth} style={{ color: '#0052ff' }}>
            <span>↑ 28.3%</span>
            <span style={{ color: '#94a3b8', fontWeight: 500 }}>annual run rate</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Corporate Cards Deployed</span>
          <span className={styles.kpiValue}>
            {companies.reduce((sum, c) => sum + c.cardsDeployed, 0)}
          </span>
          <div className={styles.kpiGrowth} style={{ color: '#059669' }}>
            <span>↑ 34.0%</span>
            <span style={{ color: '#94a3b8', fontWeight: 500 }}>hardware units</span>
          </div>
        </div>

        <div className={styles.kpiCard}>
          <span className={styles.kpiLabel}>Active Team Members</span>
          <span className={styles.kpiValue}>
            {companies.reduce((sum, c) => sum + c.activeMembers, 0)}
          </span>
          <div className={styles.kpiGrowth} style={{ color: '#0052ff' }}>
            <span>↑ 16.7%</span>
            <span style={{ color: '#94a3b8', fontWeight: 500 }}>team seats</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className={styles.panelCard} style={{ padding: '0.85rem 1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ position: 'relative', maxWidth: 420 }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: 11, color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search company name, industry, or contact person..."
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

      {/* Companies Table */}
      <div className={styles.tableCard}>
        <div style={{ overflowX: 'auto' }}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Industry Category</th>
                <th>Primary Contact</th>
                <th>Hardware Fleet</th>
                <th>Team Seats</th>
                <th>Annual Value</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: 10,
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
                        <Building2 size={18} />
                      </div>
                      <div>
                        <div style={{ fontWeight: 750, color: '#0f172a' }}>{c.name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{c.domain}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.82rem', color: '#334155' }}>{c.industry}</td>
                  <td>
                    <div style={{ fontWeight: 650, color: '#0f172a', fontSize: '0.82rem' }}>
                      {c.primaryContact}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{c.contactEmail}</div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 750, color: '#0f172a', fontSize: '0.82rem' }}>
                      {c.cardsDeployed} NFC Cards
                    </div>
                  </td>
                  <td style={{ fontSize: '0.82rem', color: '#334155', fontWeight: 600 }}>
                    {c.activeMembers} seats
                  </td>
                  <td>
                    <span style={{ fontWeight: 800, color: '#059669', fontSize: '0.85rem' }}>
                      ${c.dealValue.toLocaleString()}
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
                          c.status === 'ACTIVE'
                            ? '#ecfdf5'
                            : c.status === 'NEGOTIATION'
                            ? '#eff6ff'
                            : '#fef3c7',
                        color:
                          c.status === 'ACTIVE'
                            ? '#059669'
                            : c.status === 'NEGOTIATION'
                            ? '#0284c7'
                            : '#b45309',
                      }}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <Link
                      href="/admin/crm/contacts"
                      className={styles.secondaryBtn}
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      View Team <ChevronRight size={13} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Company Modal */}
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
              maxWidth: 520,
              padding: '1.75rem',
              border: '1px solid #e2e8f0',
              boxShadow: '0 20px 40px rgba(0, 82, 255, 0.12)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '1.2rem', fontWeight: 850, margin: '0 0 1rem 0' }}>
              Add New Corporate Account
            </h2>
            <form onSubmit={handleAddCompany} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                  Company Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Stripe, Linear, Vercel"
                  value={newCompany.name}
                  onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 8, border: '1px solid #e2e8f0', marginTop: '0.25rem', fontSize: '0.85rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                  Domain Name
                </label>
                <input
                  type="text"
                  placeholder="company.com"
                  value={newCompany.domain}
                  onChange={(e) => setNewCompany({ ...newCompany, domain: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 8, border: '1px solid #e2e8f0', marginTop: '0.25rem', fontSize: '0.85rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                    Primary Contact
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contact person"
                    value={newCompany.primaryContact}
                    onChange={(e) => setNewCompany({ ...newCompany, primaryContact: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 8, border: '1px solid #e2e8f0', marginTop: '0.25rem', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                    Contact Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="contact@company.com"
                    value={newCompany.contactEmail}
                    onChange={(e) => setNewCompany({ ...newCompany, contactEmail: e.target.value })}
                    style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 8, border: '1px solid #e2e8f0', marginTop: '0.25rem', fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                    Cards Requested
                  </label>
                  <input
                    type="number"
                    value={newCompany.cardsDeployed}
                    onChange={(e) => setNewCompany({ ...newCompany, cardsDeployed: Number(e.target.value) })}
                    style={{ width: '100%', padding: '0.6rem 0.85rem', borderRadius: 8, border: '1px solid #e2e8f0', marginTop: '0.25rem', fontSize: '0.85rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                    Contract Value ($)
                  </label>
                  <input
                    type="number"
                    value={newCompany.dealValue}
                    onChange={(e) => setNewCompany({ ...newCompany, dealValue: Number(e.target.value) })}
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
                  Save Company
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
