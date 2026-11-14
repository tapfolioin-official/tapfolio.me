'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ImageIcon,
  Plus,
  Search,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  UploadCloud,
} from 'lucide-react';
import styles from '@/app/admin/dashboard/dashboard.module.css';

interface MediaItem {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  fileSize: number;
  width: number | null;
  height: number | null;
  altText: string | null;
  title: string | null;
  createdAt: string;
}

export default function BlogMediaLibraryPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Upload modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [formUrl, setFormUrl] = useState('');
  const [formFilename, setFormFilename] = useState('');
  const [formAlt, setFormAlt] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadMedia = () => {
    setLoading(true);
    fetch('/api/admin/blog/media')
      .then((res) => res.json())
      .then((data) => {
        if (data.media) setMedia(data.media);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleCopyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/blog/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: formFilename || 'blog-image.png',
          url: formUrl,
          altText: formAlt,
          fileSize: 45000,
        }),
      });
      if (res.ok) {
        setModalOpen(false);
        setFormUrl('');
        setFormFilename('');
        setFormAlt('');
        loadMedia();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this media asset?')) return;
    try {
      const res = await fetch(`/api/admin/blog/media?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadMedia();
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
            <ImageIcon size={13} /> Digital Assets
          </div>
          <h1 className={styles.pageTitle}>Blog Media Library ({media.length})</h1>
          <p className={styles.pageSub}>
            Centralized repository of cover images, illustrations, infographics and article graphics.
          </p>
        </div>

        <div className={styles.headerRight}>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className={styles.primaryBtn}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <UploadCloud size={16} /> Add Media Asset
          </button>
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
          Loading media assets...
        </div>
      ) : media.length === 0 ? (
        <div
          style={{
            background: '#ffffff',
            borderRadius: 14,
            padding: '3rem',
            textAlign: 'center',
            border: '1px solid #e8eefa',
          }}
        >
          <ImageIcon size={36} color="#94a3b8" style={{ margin: '0 auto 0.75rem' }} />
          <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>Media Library is Empty</h3>
          <p style={{ fontSize: '0.82rem', color: '#64748b', maxWidth: 400, margin: '0.35rem auto 1.25rem' }}>
            Add cover graphics and image URLs to insert them directly into articles.
          </p>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className={styles.primaryBtn}
          >
            Add First Asset
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '1rem',
          }}
        >
          {media.map((item) => (
            <div
              key={item.id}
              style={{
                background: '#ffffff',
                borderRadius: 12,
                border: '1px solid #e8eefa',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div
                style={{
                  height: 140,
                  background: '#f8fafc',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img
                  src={item.url}
                  alt={item.altText || item.filename}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
                <span
                  style={{
                    fontSize: '0.82rem',
                    fontWeight: 750,
                    color: '#0f172a',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  title={item.filename}
                >
                  {item.filename}
                </span>

                <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                  {item.altText || 'No alt text set'}
                </span>

                <div style={{ display: 'flex', gap: '0.4rem', marginTop: 'auto', paddingTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(item.id, item.url)}
                    className={styles.secondaryBtn}
                    style={{ flex: 1, padding: '0.35rem', fontSize: '0.74rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}
                  >
                    {copiedId === item.id ? <Check size={12} color="#059669" /> : <Copy size={12} />}
                    {copiedId === item.id ? 'Copied' : 'Copy URL'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className={styles.secondaryBtn}
                    style={{ padding: '0.35rem 0.55rem', color: '#ef4444' }}
                    title="Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Media Modal */}
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
              Add Media Asset
            </h3>

            <form onSubmit={handleAddMedia} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                  Image URL / Asset Path
                </label>
                <input
                  type="text"
                  required
                  placeholder="/assets/blog/... or https://..."
                  value={formUrl}
                  onChange={(e) => {
                    setFormUrl(e.target.value);
                    if (!formFilename) {
                      const name = e.target.value.split('/').pop() || 'image.png';
                      setFormFilename(name);
                    }
                  }}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: 8, border: '1px solid #e2e8f0', marginTop: '0.25rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                  File Label / Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. tapfolio-nfc-card.png"
                  value={formFilename}
                  onChange={(e) => setFormFilename(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: 8, border: '1px solid #e2e8f0', marginTop: '0.25rem' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                  Default Alt Text
                </label>
                <input
                  type="text"
                  placeholder="SEO description for image tag"
                  value={formAlt}
                  onChange={(e) => setFormAlt(e.target.value)}
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
                  {submitting ? 'Saving...' : 'Add Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
