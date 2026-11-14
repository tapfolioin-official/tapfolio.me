'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  UserCheck,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Search,
  Mail,
  Globe,
} from 'lucide-react';
import styles from '@/app/admin/dashboard/dashboard.module.css';

interface AuthorItem {
  id: number;
  name: string;
  slug: string;
  email: string | null;
  avatar: string | null;
  designation: string | null;
  bio: string | null;
  twitter: string | null;
  linkedin: string | null;
  postCount: number;
}

export default function BlogAuthorsPage() {
  const [authors, setAuthors] = useState<AuthorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<AuthorItem | null>(null);

  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formAvatar, setFormAvatar] = useState('');
  const [formDesignation, setFormDesignation] = useState('');
  const [formBio, setFormBio] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadAuthors = () => {
    setLoading(true);
    fetch('/api/admin/blog/authors')
      .then((res) => res.json())
      .then((data) => {
        if (data.authors) setAuthors(data.authors);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAuthors();
  }, []);

  const openCreateModal = () => {
    setEditingAuthor(null);
    setFormName('');
    setFormSlug('');
    setFormEmail('');
    setFormAvatar('');
    setFormDesignation('Content Specialist');
    setFormBio('');
    setModalOpen(true);
  };

  const openEditModal = (author: AuthorItem) => {
    setEditingAuthor(author);
    setFormName(author.name);
    setFormSlug(author.slug);
    setFormEmail(author.email || '');
    setFormAvatar(author.avatar || '');
    setFormDesignation(author.designation || '');
    setFormBio(author.bio || '');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/blog/authors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingAuthor?.id,
          name: formName,
          slug: formSlug,
          email: formEmail,
          avatar: formAvatar,
          designation: formDesignation,
          bio: formBio,
        }),
      });
      if (res.ok) {
        setModalOpen(false);
        loadAuthors();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete author "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/blog/authors?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadAuthors();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.25rem 0.75rem',
              background: '#edf3ff',
              color: '#0052ff',
              borderRadius: 20,
              fontSize: '0.78rem',
              fontWeight: 750,
              marginBottom: '0.55rem',
            }}
          >
            <UserCheck size={13} /> Editorial Contributors
          </div>
          <h1 className={styles.pageTitle}>Blog Authors & Bylines ({authors.length})</h1>
          <p className={styles.pageSub}>
            Manage writer profiles, bios, designations and Google E-E-A-T credentials.
          </p>
        </div>

        <div className={styles.headerRight}>
          <button
            type="button"
            onClick={openCreateModal}
            className={styles.primaryBtn}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={16} /> Add Author
          </button>
        </div>
      </div>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>AUTHOR</th>
              <th>DESIGNATION</th>
              <th>EMAIL</th>
              <th>ARTICLES WRITTEN</th>
              <th style={{ textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                  Loading authors...
                </td>
              </tr>
            ) : authors.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                  No authors found.
                </td>
              </tr>
            ) : (
              authors.map((author) => (
                <tr key={author.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <div
                        style={{
                          width: 36,
                          height: 36,
                          borderRadius: '50%',
                          background: '#0052ff',
                          color: '#fff',
                          fontWeight: 800,
                          fontSize: '0.78rem',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        {author.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f172a' }}>{author.name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#94a3b8' }}>@{author.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 600 }}>
                    {author.designation || 'Editorial Team'}
                  </td>
                  <td style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    {author.email || '—'}
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: 12,
                        background: '#edf3ff',
                        color: '#0052ff',
                        fontSize: '0.76rem',
                        fontWeight: 750,
                      }}
                    >
                      {author.postCount} articles
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <button
                        type="button"
                        onClick={() => openEditModal(author)}
                        className={styles.secondaryBtn}
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.76rem' }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(author.id, author.name)}
                        className={styles.secondaryBtn}
                        style={{ padding: '0.3rem 0.5rem', color: '#ef4444' }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Dialog */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 16,
              width: 440,
              padding: '1.5rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            }}
          >
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem', color: '#0f172a' }}>
              {editingAuthor ? 'Edit Author Profile' : 'Add New Contributor'}
            </h3>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Abhinand K.S."
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: 8, border: '1px solid #e2e8f0', marginTop: '0.25rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                  Designation / Role
                </label>
                <input
                  type="text"
                  placeholder="e.g. Founder & CEO, Tapfolio"
                  value={formDesignation}
                  onChange={(e) => setFormDesignation(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: 8, border: '1px solid #e2e8f0', marginTop: '0.25rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="author@tapfolio.me"
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: 8, border: '1px solid #e2e8f0', marginTop: '0.25rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                  Short Bio
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief author summary..."
                  value={formBio}
                  onChange={(e) => setFormBio(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: 8, border: '1px solid #e2e8f0', marginTop: '0.25rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.65rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className={styles.secondaryBtn}
                >
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className={styles.primaryBtn}>
                  {submitting ? 'Saving...' : 'Save Author'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
