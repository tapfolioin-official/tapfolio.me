'use client';

import React, { useEffect, useState } from 'react';
import {
  CheckSquare,
  Plus,
  Clock,
  User,
  CheckCircle2,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import styles from '../../dashboard/dashboard.module.css';

export default function CrmTasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [leadName, setLeadName] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('MEDIUM');
  const [assignedTo, setAssignedTo] = useState('Nibrasul Haqq');
  const [isSaving, setIsSaving] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/admin/crm/tasks');
      const data = await res.json();
      if (data.success) {
        setTasks(data.tasks || []);
      }
    } catch (e) {
      console.error('Failed to load tasks:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleToggleTask = async (id: string) => {
    try {
      const res = await fetch('/api/admin/crm/tasks', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        fetchTasks();
      }
    } catch (e) {
      console.error('Failed to toggle task:', e);
    }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/crm/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          leadName,
          dueDate: dueDate || new Date(Date.now() + 86400000 * 2).toISOString(),
          priority,
          assignedTo,
        }),
      });
      if (res.ok) {
        setShowAddModal(false);
        setTitle('');
        setLeadName('');
        setDueDate('');
        fetchTasks();
      }
    } catch (e) {
      console.error('Failed to create task:', e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>CRM Tasks & Follow-ups</h1>
          <p className={styles.subtitle}>
            Scheduled follow-ups, calls, customer proposals and delivery commitments
          </p>
        </div>
        <div className={styles.headerRight}>
          <button
            onClick={() => setShowAddModal(true)}
            className={styles.refreshBtn}
          >
            <Plus size={15} />
            <span>Create Task</span>
          </button>
        </div>
      </header>

      {/* Tasks Table */}
      <div className={styles.panelCard}>
        <table className={styles.ticketsTable}>
          <thead>
            <tr>
              <th style={{ width: 40 }}>Status</th>
              <th>Task Description</th>
              <th>Associated Lead</th>
              <th>Due Date</th>
              <th>Priority</th>
              <th>Assignee</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((t) => {
              const isCompleted = t.status === 'COMPLETED';
              return (
                <tr key={t.id} style={{ opacity: isCompleted ? 0.6 : 1 }}>
                  <td>
                    <button
                      onClick={() => handleToggleTask(t.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        color: isCompleted ? '#059669' : '#cbd5e1',
                      }}
                    >
                      <CheckCircle2 size={18} />
                    </button>
                  </td>
                  <td>
                    <span
                      style={{
                        fontWeight: 700,
                        color: isCompleted ? '#64748b' : '#0f172a',
                        textDecoration: isCompleted ? 'line-through' : 'none',
                      }}
                    >
                      {t.title}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 650, color: '#334155' }}>{t.leadName || 'Direct'}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: '#64748b' }}>
                      <Calendar size={13} />
                      <span>{new Date(t.dueDate).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        padding: '0.15rem 0.5rem',
                        borderRadius: 6,
                        background: t.priority === 'HIGH' ? '#fee2e2' : t.priority === 'MEDIUM' ? '#fef3c7' : '#f1f5f9',
                        color: t.priority === 'HIGH' ? '#dc2626' : t.priority === 'MEDIUM' ? '#d97706' : '#64748b',
                      }}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{t.assignedTo}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Task Modal */}
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
              maxWidth: 480,
              padding: '1.75rem',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: '0 0 1rem 0' }}>
              Add New Follow-up Task
            </h2>

            <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                  Task Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Call client to verify card logo files"
                  style={{ width: '100%', padding: '0.55rem 0.85rem', borderRadius: 8, border: '1px solid #e2e8f0', marginTop: '0.25rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                  Associated Customer / Lead Name
                </label>
                <input
                  type="text"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  style={{ width: '100%', padding: '0.55rem 0.85rem', borderRadius: 8, border: '1px solid #e2e8f0', marginTop: '0.25rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem 0.85rem', borderRadius: 8, border: '1px solid #e2e8f0', marginTop: '0.25rem' }}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem 0.85rem', borderRadius: 8, border: '1px solid #e2e8f0', marginTop: '0.25rem' }}
                  />
                </div>
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
                  {isSaving ? 'Saving...' : 'Add Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
