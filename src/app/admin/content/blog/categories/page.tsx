'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  ExternalLink,
  Search,
} from 'lucide-react';
import styles from '../../dashboard/dashboard.module.css';

interface CategoryItem {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  postCount: number;
}

export default function BlogCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  const [formName, setFormName] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadCategories = () => {
    setLoading(true);
    fetch('/api/admin/blog/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) setCategories(data.categories);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormName('');
    setFormSlug('');
    setFormDesc('');
    setModalOpen(true);
  };

  const openEditModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFormDesc(cat.description || '');
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/blog/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingCategory?.id,
          name: formName,
          slug: formSlug,
          description: formDesc,
        }),
      });
      if (res.ok) {
        setModalOpen(false);
        loadCategories();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete category "${name}"?`)) return;
    try {
      const res = await fetch(`/api/admin/blog/categories?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadCategories();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase())
  );

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
            <FolderTree size={13} /> Content Taxonomies
          </div>
          <h1 className={styles.pageTitle}>Blog Categories ({categories.length})</h1>
          <p className={styles.pageSub}>
            Organize articles into search-optimized topics and public category archives.
          </p>
        </div>

        <div className={styles.headerRight}>
          <button
            type="button"
            onClick={openCreateModal}
            className={styles.primaryBtn}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={16} /> Add Category
          </button>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '0.75rem',
          background: '#ffffff',
          padding: '0.75rem 1rem',
          borderRadius: 14,
          border: '1px solid #e8eefa',
          marginBottom: '1.25rem',
        }}
      >
        <div style={{ position: 'relative', width: 340 }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: 11, color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem 0.85rem 0.5rem 2rem',
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              fontSize: '0.82rem',
            }}
          />
        </div>
      </div>

      <div className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>CATEGORY NAME</th>
              <th>SLUG</th>
              <th>DESCRIPTION</th>
              <th>ARTICLES COUNT</th>
              <th style={{ textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                  Loading categories...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
                  No categories found.
                </td>
              </tr>
            ) : (
              filtered.map((cat) => (
                <tr key={cat.id}>
                  <td style={{ fontWeight: 700, color: '#0f172a' }}>{cat.name}</td>
                  <td>
                    <code style={{ fontSize: '0.76rem', color: '#0052ff', background: '#eff6ff', padding: '2px 6px', borderRadius: 4 }}>
                      {cat.slug}
                    </code>
                  </td>
                  <td style={{ fontSize: '0.82rem', color: '#64748b' }}>
                    {cat.description || '—'}
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '0.2rem 0.6rem',
                        borderRadius: 12,
                        background: '#f1f5f9',
                        color: '#334155',
                        fontSize: '0.76rem',
                        fontWeight: 750,
                      }}
                    >
                      {cat.postCount} articles
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                      <button
                        type="button"
                        onClick={() => openEditModal(cat)}
                        className={styles.secondaryBtn}
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.76rem' }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(cat.id, cat.name)}
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
              {editingCategory ? 'Edit Category' : 'Create New Category'}
            </h3>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NFC Hardware"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: 8, border: '1px solid #e2e8f0', marginTop: '0.25rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                  Slug (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Auto-generated if left empty"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: 8, border: '1px solid #e2e8f0', marginTop: '0.25rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                  Description (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Topic focus and scope..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
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
                  {submitting ? 'Saving...' : 'Save Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
