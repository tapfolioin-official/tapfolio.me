'use client';

import React, { useEffect, useState } from 'react';
import {
  Users,
  Search,
  Filter,
  Plus,
  Phone,
  Mail,
  Building2,
  DollarSign,
  Tag,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';
import styles from '../../dashboard/dashboard.module.css';

export default function LeadsManagementPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [value, setValue] = useState(500);
  const [source, setSource] = useState('website');
  const [notes, setNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const fetchLeads = async () => {
    try {
      const q = new URLSearchParams();
      if (statusFilter !== 'ALL') q.set('status', statusFilter);
      if (sourceFilter !== 'ALL') q.set('source', sourceFilter);
      if (searchQuery) q.set('search', searchQuery);

      const res = await fetch(`/api/admin/crm/leads?${q.toString()}`);
      const data = await res.json();
      if (data.success) {
        setLeads(data.leads || []);
      }
    } catch (e) {
      console.error('Failed to load leads:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [statusFilter, sourceFilter, searchQuery]);

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          company,
          value,
          source,
          notes,
          tags: ['Inbound Lead'],
        }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setName('');
        setEmail('');
        setPhone('');
        setCompany('');
        setValue(500);
        setNotes('');
        fetchLeads();
      }
    } catch (e) {
      console.error('Failed to create lead:', e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/crm/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (res.ok) {
        fetchLeads();
      }
    } catch (e) {
      console.error('Failed to update status:', e);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Customer Leads Directory</h1>
          <p className={styles.subtitle}>
            Inbound customer captures from website forms, mobile app interactions, and smart NFC cards
          </p>
        </div>
        <div className={styles.headerRight}>
          <button
            onClick={() => setShowAddModal(true)}
            className={styles.refreshBtn}
          >
            <Plus size={15} />
            <span>Add New Lead</span>
          </button>
        </div>
      </header>

      {/* Filter and Search Bar */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e8eefa',
          borderRadius: 14,
          padding: '0.85rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          boxShadow: '0 2px 10px rgba(0, 82, 255, 0.02)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 260 }}>
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search leads by name, email, company or tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              border: 'none',
              outline: 'none',
              fontSize: '0.85rem',
              color: '#0f172a',
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              fontSize: '0.8rem',
              fontWeight: 650,
              color: '#334155',
              outline: 'none',
              background: '#ffffff',
            }}
          >
            <option value="ALL">All Statuses</option>
            <option value="NEW_LEAD">New Lead</option>
            <option value="CONTACTED">Contacted</option>
            <option value="INTERESTED">Interested</option>
            <option value="QUALIFIED">Qualified</option>
            <option value="CONVERTED">Converted</option>
            <option value="LOST">Lost</option>
          </select>

          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              fontSize: '0.8rem',
              fontWeight: 650,
              color: '#334155',
              outline: 'none',
              background: '#ffffff',
            }}
          >
            <option value="ALL">All Sources</option>
            <option value="website">Website Form</option>
            <option value="mobile_app">Mobile App</option>
            <option value="nfc_card">NFC Card Tap</option>
            <option value="contact_form">Contact Desk</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className={styles.panelCard}>
        <table className={styles.ticketsTable}>
          <thead>
            <tr>
              <th>Contact Name</th>
              <th>Company</th>
              <th>Email & Phone</th>
              <th>Acquisition Channel</th>
              <th>Deal Value</th>
              <th>Stage / Status</th>
              <th>Assigned To</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((l) => (
              <tr key={l.id}>
                <td>
                  <div style={{ fontWeight: 750, color: '#0f172a' }}>{l.name}</div>
                  <div style={{ display: 'flex', gap: '4px', marginTop: '0.2rem' }}>
                    {l.tags.map((t: string) => (
                      <span
                        key={t}
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          padding: '0.1rem 0.4rem',
                          borderRadius: 4,
                          background: '#f1f5f9',
                          color: '#475569',
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight: 650, color: '#334155' }}>{l.company || 'Individual'}</div>
                </td>
                <td>
                  <div style={{ fontSize: '0.82rem', color: '#0f172a' }}>{l.email}</div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{l.phone || '—'}</div>
                </td>
                <td>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 750,
                      padding: '0.2rem 0.55rem',
                      borderRadius: 6,
                      background: l.source === 'mobile_app' ? '#eff6ff' : '#f8fafc',
                      color: l.source === 'mobile_app' ? '#0052ff' : '#475569',
                      textTransform: 'uppercase',
                    }}
                  >
                    {l.source.replace('_', ' ')}
                  </span>
                </td>
                <td>
                  <span style={{ fontWeight: 800, color: '#0f172a' }}>${l.value.toLocaleString()}</span>
                </td>
                <td>
                  <select
                    value={l.status}
                    onChange={(e) => handleUpdateStatus(l.id, e.target.value)}
                    style={{
                      padding: '0.25rem 0.55rem',
                      borderRadius: 6,
                      border: '1px solid #e2e8f0',
                      fontSize: '0.75rem',
                      fontWeight: 750,
                      background:
                        l.status === 'CONVERTED'
                          ? '#ecfdf5'
                          : l.status === 'QUALIFIED'
                          ? '#eff6ff'
                          : l.status === 'INTERESTED'
                          ? '#fffbeb'
                          : '#ffffff',
                      color:
                        l.status === 'CONVERTED'
                          ? '#059669'
                          : l.status === 'QUALIFIED'
                          ? '#0052ff'
                          : l.status === 'INTERESTED'
                          ? '#d97706'
                          : '#334155',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="NEW_LEAD">New Lead</option>
                    <option value="CONTACTED">Contacted</option>
                    <option value="INTERESTED">Interested</option>
                    <option value="QUALIFIED">Qualified</option>
                    <option value="CONVERTED">Converted</option>
                    <option value="LOST">Lost</option>
                  </select>
                </td>
                <td>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{l.assignedTo}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Lead Modal */}
      {showAddModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.4)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1.5rem',
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
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 1rem 0' }}>
              Add Prospective Customer Lead
            </h2>

            <form onSubmit={handleCreateLead} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rachel Adams"
                  style={{ width: '100%', padding: '0.55rem 0.85rem', borderRadius: 8, border: '1px solid #e2e8f0', marginTop: '0.25rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="rachel@company.com"
                    style={{ width: '100%', padding: '0.55rem 0.85rem', borderRadius: 8, border: '1px solid #e2e8f0', marginTop: '0.25rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                    Phone Number
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555-0192"
                    style={{ width: '100%', padding: '0.55rem 0.85rem', borderRadius: 8, border: '1px solid #e2e8f0', marginTop: '0.25rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                    Company / Organization
                  </label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Stripe Design"
                    style={{ width: '100%', padding: '0.55rem 0.85rem', borderRadius: 8, border: '1px solid #e2e8f0', marginTop: '0.25rem' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                    Estimated Value ($)
                  </label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setValue(Number(e.target.value))}
                    style={{ width: '100%', padding: '0.55rem 0.85rem', borderRadius: 8, border: '1px solid #e2e8f0', marginTop: '0.25rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                  Acquisition Source
                </label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem 0.85rem', borderRadius: 8, border: '1px solid #e2e8f0', marginTop: '0.25rem' }}
                >
                  <option value="website">Website Configurator / Form</option>
                  <option value="mobile_app">Mobile Application</option>
                  <option value="nfc_card">NFC Business Card Tap</option>
                  <option value="contact_form">Support Desk Inquiry</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                  Deal Notes / Inbound Request
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Details about hardware requirements, volume, custom logo..."
                  rows={3}
                  style={{ width: '100%', padding: '0.55rem 0.85rem', borderRadius: 8, border: '1px solid #e2e8f0', marginTop: '0.25rem', fontFamily: 'inherit' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{ padding: '0.55rem 1.25rem', borderRadius: 8, border: '1px solid #e2e8f0', background: '#ffffff', cursor: 'pointer', fontWeight: 650 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  style={{ padding: '0.55rem 1.4rem', borderRadius: 8, border: 'none', background: '#0052ff', color: '#ffffff', cursor: 'pointer', fontWeight: 700 }}
                >
                  {isSaving ? 'Saving...' : 'Create Lead'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
