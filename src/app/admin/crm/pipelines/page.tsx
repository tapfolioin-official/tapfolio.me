'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  GitPullRequest,
  Plus,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  User,
  Building2,
  CheckCircle2,
  Phone,
  Mail,
} from 'lucide-react';
import styles from '../../dashboard/dashboard.module.css';

const STAGES = [
  { id: 'NEW_LEAD', label: 'New Lead', color: '#00a3ff', bg: '#eff6ff' },
  { id: 'CONTACTED', label: 'Contacted', color: '#38bdf8', bg: '#f0f9ff' },
  { id: 'INTERESTED', label: 'Interested', color: '#0052ff', bg: '#edf3ff' },
  { id: 'QUALIFIED', label: 'Qualified', color: '#6366f1', bg: '#eef2ff' },
  { id: 'CONVERTED', label: 'Converted', color: '#059669', bg: '#ecfdf5' },
  { id: 'LOST', label: 'Lost', color: '#94a3b8', bg: '#f1f5f9' },
];

export default function PipelineKanbanPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/admin/crm/leads');
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
  }, []);

  const moveStage = async (id: string, newStage: string) => {
    try {
      const res = await fetch('/api/admin/crm/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStage }),
      });
      if (res.ok) {
        fetchLeads();
      }
    } catch (e) {
      console.error('Failed to move stage:', e);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Visual CRM Deal Pipeline</h1>
          <p className={styles.subtitle}>
            Drag, prioritize, and progress inbound opportunities across sales lifecycle stages
          </p>
        </div>
        <div className={styles.headerRight}>
          <Link
            href="/admin/crm/leads"
            className={styles.refreshBtn}
            style={{ textDecoration: 'none' }}
          >
            <Plus size={15} />
            <span>New Lead</span>
          </Link>
        </div>
      </header>

      {/* Visual Kanban Columns Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, minmax(240px, 1fr))',
          gap: '1rem',
          overflowX: 'auto',
          paddingBottom: '1.5rem',
        }}
      >
        {STAGES.map((stage) => {
          const stageLeads = leads.filter((l) => l.status === stage.id);
          const stageValue = stageLeads.reduce((acc, curr) => acc + (curr.value || 0), 0);

          return (
            <div
              key={stage.id}
              style={{
                background: '#ffffff',
                border: '1px solid #e8eefa',
                borderRadius: 16,
                display: 'flex',
                flexDirection: 'column',
                minHeight: '620px',
                boxShadow: '0 2px 10px rgba(0, 82, 255, 0.02)',
              }}
            >
              {/* Column Header */}
              <div
                style={{
                  padding: '1rem',
                  borderBottom: '1px solid #f1f5f9',
                  background: stage.bg,
                  borderTopLeftRadius: 16,
                  borderTopRightRadius: 16,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.84rem', fontWeight: 800, color: '#0f172a' }}>
                    {stage.label}
                  </span>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      background: '#ffffff',
                      color: stage.color,
                      padding: '0.1rem 0.45rem',
                      borderRadius: 10,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                    }}
                  >
                    {stageLeads.length}
                  </span>
                </div>
                <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#64748b', marginTop: '0.35rem' }}>
                  ${stageValue.toLocaleString()} in pipeline
                </div>
              </div>

              {/* Cards List */}
              <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                {stageLeads.map((lead) => (
                  <div
                    key={lead.id}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: 12,
                      padding: '0.95rem',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
                        {lead.name}
                      </div>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 850,
                          color: '#0052ff',
                        }}
                      >
                        ${lead.value?.toLocaleString()}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.75rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Building2 size={13} className="text-slate-400" />
                      <span>{lead.company || 'Direct Contact'}</span>
                    </div>

                    {lead.notes && (
                      <div style={{ fontSize: '0.72rem', color: '#475569', background: '#f8fafc', padding: '0.4rem 0.6rem', borderRadius: 6 }}>
                        {lead.notes}
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.35rem', paddingTop: '0.5rem', borderTop: '1px solid #f1f5f9' }}>
                      <span
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: 800,
                          background: '#edf3ff',
                          color: '#0052ff',
                          padding: '0.15rem 0.45rem',
                          borderRadius: 4,
                          textTransform: 'uppercase',
                        }}
                      >
                        {lead.source.replace('_', ' ')}
                      </span>

                      {/* Move Stage Select */}
                      <select
                        value={lead.status}
                        onChange={(e) => moveStage(lead.id, e.target.value)}
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          border: '1px solid #cbd5e1',
                          borderRadius: 6,
                          padding: '0.15rem 0.35rem',
                          background: '#ffffff',
                          color: '#334155',
                          cursor: 'pointer',
                        }}
                      >
                        {STAGES.map((s) => (
                          <option key={s.id} value={s.id}>
                            Move to {s.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}

                {stageLeads.length === 0 && (
                  <div
                    style={{
                      height: '100px',
                      border: '1.5px dashed #e2e8f0',
                      borderRadius: 12,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.74rem',
                      color: '#94a3b8',
                      fontWeight: 600,
                    }}
                  >
                    No deals in {stage.label}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
