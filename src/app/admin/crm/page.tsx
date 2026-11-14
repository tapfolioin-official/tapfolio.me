'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Target,
  UserPlus,
  GitPullRequest,
  CheckSquare,
  TrendingUp,
  DollarSign,
  Users,
  Briefcase,
  ArrowRight,
  ExternalLink,
  Plus,
  Phone,
  Mail,
  Building2,
  Clock,
  Sparkles,
} from 'lucide-react';
import styles from '../dashboard/dashboard.module.css';

export default function CrmDashboardPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/crm/leads').then((r) => r.json()),
      fetch('/api/admin/crm/tasks').then((r) => r.json()),
    ])
      .then(([leadsData, tasksData]) => {
        if (leadsData.success) {
          setMetrics(leadsData.metrics);
          setLeads(leadsData.leads || []);
        }
        if (tasksData.success) {
          setTasks(tasksData.tasks || []);
        }
      })
      .catch((err) => console.error('Failed to load CRM data:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={styles.page}>
      {/* ─── Header ─── */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Unified CRM Centre</h1>
          <p className={styles.subtitle}>
            Centralized customer relationship intelligence across Tapfolio Website & Mobile App
          </p>
        </div>
        <div className={styles.headerRight}>
          <Link
            href="/admin/crm/leads"
            className={styles.refreshBtn}
            style={{ textDecoration: 'none' }}
          >
            <UserPlus size={15} />
            <span>Manage All Leads</span>
          </Link>
          <Link
            href="/admin/crm/pipelines"
            className={styles.refreshBtn}
            style={{ background: '#ffffff', color: '#0052ff', border: '1px solid #e2e8f0', textDecoration: 'none' }}
          >
            <GitPullRequest size={15} />
            <span>Pipeline Board</span>
          </Link>
        </div>
      </header>

      {/* ─── Top 4 Metric Cards Grid ─── */}
      <div className={styles.topMetricsGrid}>
        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricIcon} style={{ background: '#edf3ff', color: '#0052ff' }}>
              <Users size={19} />
            </div>
            <span className={styles.metricLabel}>Total Captured Leads</span>
          </div>
          <div className={styles.metricBody}>
            <div>
              <div className={styles.metricValue}>{metrics?.totalLeads ?? 5}</div>
              <div className={styles.metricTrend}>
                <TrendingUp size={13} />
                <span>+16.2% vs last month</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricIcon} style={{ background: '#ecfdf5', color: '#059669' }}>
              <DollarSign size={19} />
            </div>
            <span className={styles.metricLabel}>Pipeline Value</span>
          </div>
          <div className={styles.metricBody}>
            <div>
              <div className={styles.metricValue}>
                ${(metrics?.totalPipelineValue ?? 6550).toLocaleString()}
              </div>
              <div className={styles.metricTrend}>
                <TrendingUp size={13} />
                <span>Active qualified deals</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricIcon} style={{ background: '#eff6ff', color: '#00a3ff' }}>
              <Briefcase size={19} />
            </div>
            <span className={styles.metricLabel}>Converted Accounts</span>
          </div>
          <div className={styles.metricBody}>
            <div>
              <div className={styles.metricValue}>{metrics?.convertedLeads ?? 1}</div>
              <div className={styles.metricTrend}>
                <TrendingUp size={13} />
                <span>Paid Enterprise clients</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.metricCard}>
          <div className={styles.metricHeader}>
            <div className={styles.metricIcon} style={{ background: '#fffbeb', color: '#d97706' }}>
              <Sparkles size={19} />
            </div>
            <span className={styles.metricLabel}>Conversion Rate</span>
          </div>
          <div className={styles.metricBody}>
            <div>
              <div className={styles.metricValue}>{metrics?.conversionRate ?? '20.0%'}</div>
              <div className={styles.metricTrend}>
                <TrendingUp size={13} />
                <span>Inbound close rate</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Grid: Pipeline Preview + Recent Inquiries ─── */}
      <div className={styles.dashGridRow} style={{ gridTemplateColumns: '1.4fr 1fr' }}>
        {/* Pipeline Stages Progress */}
        <div className={styles.panelCard}>
          <div className={styles.panelHeader}>
            <div>
              <h2 className={styles.panelTitle}>Pipeline Deal Stages</h2>
              <p className={styles.panelSub}>Distribution of inbound prospective buyers</p>
            </div>
            <Link href="/admin/crm/pipelines" className={styles.panelLink}>
              <span>Open Visual Kanban</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', marginTop: '0.5rem' }}>
            {[
              { stage: 'New Lead', count: 1, val: '$2,500', pct: 20, color: '#38bdf8' },
              { stage: 'Contacted', count: 1, val: '$400', pct: 35, color: '#00a3ff' },
              { stage: 'Interested', count: 1, val: '$650', pct: 50, color: '#0052ff' },
              { stage: 'Qualified', count: 1, val: '$1,200', pct: 75, color: '#6366f1' },
              { stage: 'Converted', count: 1, val: '$1,800', pct: 100, color: '#059669' },
            ].map((s) => (
              <div key={s.stage}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', fontWeight: 650, marginBottom: '0.25rem' }}>
                  <span>{s.stage} ({s.count})</span>
                  <span style={{ color: '#0f172a' }}>{s.val}</span>
                </div>
                <div style={{ height: 7, background: '#f1f5f9', borderRadius: 10, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${s.pct}%`, background: s.color, borderRadius: 10 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Follow-up Tasks */}
        <div className={styles.panelCard}>
          <div className={styles.panelHeader}>
            <div>
              <h2 className={styles.panelTitle}>Tasks & Follow-ups</h2>
              <p className={styles.panelSub}>Action items for pending deals</p>
            </div>
            <Link href="/admin/crm/tasks" className={styles.panelLink}>
              <span>View Tasks</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {tasks.map((t) => (
              <div
                key={t.id}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e8eefa',
                  borderRadius: 12,
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                }}
              >
                <CheckSquare size={16} className="text-blue-600 mt-0.5 shrink-0" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a' }}>
                    {t.title}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '0.2rem' }}>
                    Lead: <strong style={{ color: '#334155' }}>{t.leadName}</strong> · Due: {new Date(t.dueDate).toLocaleDateString()}
                  </div>
                </div>
                <span
                  style={{
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    padding: '0.15rem 0.5rem',
                    borderRadius: 6,
                    background: t.priority === 'HIGH' ? '#fee2e2' : '#fef3c7',
                    color: t.priority === 'HIGH' ? '#dc2626' : '#d97706',
                  }}
                >
                  {t.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Recent Inbound Leads Table ─── */}
      <div className={styles.panelCard} style={{ marginTop: '0.5rem' }}>
        <div className={styles.panelHeader}>
          <div>
            <h2 className={styles.panelTitle}>Recent Captured Customer Leads</h2>
            <p className={styles.panelSub}>Inbound contacts from Web configurator, mobile app NFC scan, and inquiry forms</p>
          </div>
          <Link href="/admin/crm/leads" className={styles.panelLink}>
            <span>View Full Directory</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        <table className={styles.ticketsTable}>
          <thead>
            <tr>
              <th>Lead Name & Company</th>
              <th>Contact Details</th>
              <th>Acquisition Source</th>
              <th>Pipeline Status</th>
              <th>Deal Value</th>
              <th className="text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {leads.slice(0, 5).map((l) => (
              <tr key={l.id}>
                <td>
                  <div style={{ fontWeight: 750, color: '#0f172a' }}>{l.name}</div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{l.company || 'Individual'}</div>
                </td>
                <td>
                  <div style={{ fontSize: '0.82rem', color: '#334155' }}>{l.email}</div>
                  <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>{l.phone || '—'}</div>
                </td>
                <td>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 750,
                      padding: '0.2rem 0.55rem',
                      borderRadius: 6,
                      background: l.source === 'mobile_app' ? '#eff6ff' : '#f1f5f9',
                      color: l.source === 'mobile_app' ? '#0052ff' : '#475569',
                      textTransform: 'uppercase',
                    }}
                  >
                    {l.source.replace('_', ' ')}
                  </span>
                </td>
                <td>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '0.2rem 0.6rem',
                      borderRadius: 12,
                      background:
                        l.status === 'CONVERTED'
                          ? '#ecfdf5'
                          : l.status === 'QUALIFIED'
                          ? '#eff6ff'
                          : l.status === 'INTERESTED'
                          ? '#fffbeb'
                          : '#f1f5f9',
                      color:
                        l.status === 'CONVERTED'
                          ? '#059669'
                          : l.status === 'QUALIFIED'
                          ? '#0052ff'
                          : l.status === 'INTERESTED'
                          ? '#d97706'
                          : '#64748b',
                    }}
                  >
                    {l.status.replace('_', ' ')}
                  </span>
                </td>
                <td style={{ fontWeight: 800, color: '#0f172a' }}>${l.value.toLocaleString()}</td>
                <td className="text-right">
                  <Link
                    href={`/admin/crm/leads?id=${l.id}`}
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 750,
                      color: '#0052ff',
                      textDecoration: 'none',
                    }}
                  >
                    Inspect Profile →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
