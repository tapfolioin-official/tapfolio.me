'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
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
  Upload,
  Loader2,
  X,
  FileImage,
  CheckCircle2,
  AlertCircle,
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

function formatFileSize(bytes: number | null | undefined): string {
  if (!bytes || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}

export default function BlogMediaLibraryPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');
  const [uploading, setUploading] = useState(false);
  const [isDraggingModal, setIsDraggingModal] = useState(false);
  const [isDraggingPage, setIsDraggingPage] = useState(false);

  // Uploaded asset state in modal
  const [uploadedItem, setUploadedItem] = useState<{
    id: string;
    url: string;
    filename: string;
    fileSize: number;
    mimeType: string;
    altText: string;
  } | null>(null);

  // URL tab form state
  const [formUrl, setFormUrl] = useState('');
  const [formFilename, setFormFilename] = useState('');
  const [formAlt, setFormAlt] = useState('');
  const [submittingUrl, setSubmittingUrl] = useState(false);

  // File input refs
  const modalFileInputRef = useRef<HTMLInputElement>(null);
  const pageFileInputRef = useRef<HTMLInputElement>(null);

  const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback(null), 4500);
  };

  const loadMedia = () => {
    setLoading(true);
    fetch('/api/admin/blog/media?limit=500')
      .then((res) => res.json())
      .then((data) => {
        if (data.media) setMedia(data.media);
      })
      .catch((err) => {
        console.error('Failed to load media assets:', err);
        showFeedback('Failed to load media library', 'error');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleCopyUrl = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    showFeedback('Image URL copied to clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Upload photo handler (matching article editor logic)
  const handlePhotoUpload = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showFeedback('Please upload an image file (PNG, JPG, WebP, GIF, SVG)', 'error');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showFeedback('Photo file size exceeds 10MB limit', 'error');
      return;
    }

    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('altText', file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));

    try {
      const res = await fetch('/api/admin/blog/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success && data.url) {
        const newItem = {
          id: data.id,
          url: data.url,
          filename: data.filename || file.name,
          fileSize: data.size || file.size,
          mimeType: data.mimeType || file.type,
          altText: data.altText || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        };

        setUploadedItem(newItem);
        setFormAlt(newItem.altText);
        showFeedback('Photo uploaded successfully to database!', 'success');
        loadMedia();
      } else {
        showFeedback(data.error || 'Failed to upload photo', 'error');
      }
    } catch (err: any) {
      showFeedback(err.message || 'Error uploading photo', 'error');
    } finally {
      setUploading(false);
    }
  };

  // Save changes to uploaded item (e.g. updating Alt Text) and close modal
  const handleSaveUploadedModal = async () => {
    if (!uploadedItem) {
      setModalOpen(false);
      return;
    }

    try {
      if (uploadedItem.altText !== formAlt) {
        await fetch('/api/admin/blog/media', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: uploadedItem.id,
            altText: formAlt,
          }),
        });
      }
      showFeedback('Media asset saved to library!', 'success');
      loadMedia();
    } catch (e) {
      console.error(e);
    } finally {
      setModalOpen(false);
      setUploadedItem(null);
      setFormAlt('');
    }
  };

  // Manual URL submission (URL Tab)
  const handleAddMediaUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formUrl) return;

    setSubmittingUrl(true);
    try {
      const res = await fetch('/api/admin/blog/media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: formFilename || formUrl.split('/').pop() || 'blog-image.png',
          url: formUrl,
          altText: formAlt,
        }),
      });

      if (res.ok) {
        showFeedback('Asset added successfully!', 'success');
        setModalOpen(false);
        setFormUrl('');
        setFormFilename('');
        setFormAlt('');
        loadMedia();
      } else {
        const err = await res.json();
        showFeedback(err.error || 'Failed to add asset', 'error');
      }
    } catch (e: any) {
      showFeedback(e.message || 'Error saving media URL', 'error');
    } finally {
      setSubmittingUrl(false);
    }
  };

  const handleDelete = async (id: string, filename: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${filename}" from database storage?`)) return;
    try {
      const res = await fetch(`/api/admin/blog/media?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        showFeedback('Media asset removed from database', 'success');
        loadMedia();
      } else {
        const err = await res.json();
        showFeedback(err.error || 'Failed to delete asset', 'error');
      }
    } catch (e: any) {
      showFeedback(e.message || 'Error deleting media', 'error');
    }
  };

  // Page-level drag & drop
  const handlePageDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingPage(true);
  };

  const handlePageDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingPage(false);
  };

  const handlePageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingPage(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Open modal with this upload
      setModalOpen(true);
      setActiveTab('upload');
      handlePhotoUpload(e.dataTransfer.files[0]);
    }
  };

  // Filtered media list based on search
  const filteredMedia = useMemo(() => {
    if (!search.trim()) return media;
    const term = search.toLowerCase();
    return media.filter(
      (m) =>
        m.filename.toLowerCase().includes(term) ||
        (m.altText && m.altText.toLowerCase().includes(term)) ||
        (m.title && m.title.toLowerCase().includes(term))
    );
  }, [media, search]);

  return (
    <div
      className={styles.page}
      onDragOver={handlePageDragOver}
      onDragLeave={handlePageDragLeave}
      onDrop={handlePageDrop}
      style={{ position: 'relative' }}
    >
      {/* Toast Notification */}
      {feedback && (
        <div
          style={{
            position: 'fixed',
            top: 24,
            right: 28,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.75rem 1.25rem',
            borderRadius: 12,
            background: feedback.type === 'success' ? '#059669' : '#dc2626',
            color: '#ffffff',
            boxShadow: '0 10px 25px rgba(0,0,0,0.18)',
            fontSize: '0.85rem',
            fontWeight: 700,
            animation: 'fadeIn 0.2s ease',
          }}
        >
          {feedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <span>{feedback.text}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', padding: 0 }}
          >
            <X size={15} />
          </button>
        </div>
      )}

      {/* Full Page Drag & Drop Overlay */}
      {isDraggingPage && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 82, 255, 0.12)',
            border: '4px dashed #0052ff',
            zIndex: 999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(3px)',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              background: '#ffffff',
              padding: '1.75rem 2.5rem',
              borderRadius: 20,
              boxShadow: '0 20px 40px rgba(0, 82, 255, 0.25)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '0.75rem',
            }}
          >
            <UploadCloud size={48} color="#0052ff" />
            <h2 style={{ fontSize: '1.3rem', fontWeight: 850, color: '#0f172a', margin: 0 }}>
              Drop Image to Upload Instantly
            </h2>
            <p style={{ fontSize: '0.86rem', color: '#64748b', margin: 0 }}>
              File will be stored securely in Neon PostgreSQL BYTEA binary storage.
            </p>
          </div>
        </div>
      )}

      {/* Hidden file input for header direct upload */}
      <input
        type="file"
        ref={pageFileInputRef}
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        style={{ display: 'none' }}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            setModalOpen(true);
            setActiveTab('upload');
            handlePhotoUpload(e.target.files[0]);
          }
        }}
      />

      {/* Header */}
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
            Centralized repository of cover images, illustrations, infographics and article graphics in Neon PostgreSQL.
          </p>
        </div>

        <div className={styles.headerRight}>
          {/* Direct File Picker Upload Button */}
          <button
            type="button"
            disabled={uploading}
            onClick={() => pageFileInputRef.current?.click()}
            className={styles.secondaryBtn}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              color: '#0f172a',
              fontWeight: 750,
            }}
          >
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {uploading ? 'Uploading...' : 'Quick Upload'}
          </button>

          {/* Add Media Asset Modal Trigger */}
          <button
            type="button"
            onClick={() => {
              setModalOpen(true);
              setUploadedItem(null);
            }}
            className={styles.primaryBtn}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <UploadCloud size={16} /> Add Media Asset
          </button>
        </div>
      </div>

      {/* Search & Statistics Filter Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          background: '#ffffff',
          padding: '0.75rem 1.25rem',
          borderRadius: 12,
          border: '1px solid #e8eefa',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
          <Search
            size={16}
            color="#94a3b8"
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder="Search media assets by filename, alt text, or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.55rem 0.85rem 0.55rem 2.25rem',
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              fontSize: '0.82rem',
              outline: 'none',
            }}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '2px',
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 650 }}>
            Showing {filteredMedia.length} of {media.length} assets
          </span>
          <span
            style={{
              background: '#edf3ff',
              color: '#0052ff',
              padding: '0.2rem 0.55rem',
              borderRadius: 6,
              fontSize: '0.72rem',
              fontWeight: 800,
            }}
          >
            PostgreSQL BYTEA
          </span>
        </div>
      </div>

      {/* Media Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#94a3b8' }}>
          <Loader2 size={32} className="animate-spin" style={{ margin: '0 auto 1rem', color: '#0052ff' }} />
          <p style={{ fontWeight: 650, fontSize: '0.9rem' }}>Loading media assets from database...</p>
        </div>
      ) : filteredMedia.length === 0 ? (
        <div
          style={{
            background: '#ffffff',
            borderRadius: 14,
            padding: '3.5rem 2rem',
            textAlign: 'center',
            border: '1px solid #e8eefa',
          }}
        >
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
            }}
          >
            <ImageIcon size={30} color="#94a3b8" />
          </div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
            {search ? 'No matching media assets found' : 'Media Library is Empty'}
          </h3>
          <p style={{ fontSize: '0.84rem', color: '#64748b', maxWidth: 440, margin: '0.35rem auto 1.5rem' }}>
            {search
              ? `No images match "${search}". Try clearing your search term.`
              : 'Upload cover graphics and illustrations. All images are stored securely in Neon PostgreSQL.'}
          </p>
          <button
            type="button"
            onClick={() => {
              if (search) setSearch('');
              else {
                setModalOpen(true);
                setUploadedItem(null);
              }
            }}
            className={styles.primaryBtn}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {search ? 'Clear Search' : <><UploadCloud size={16} /> Upload First Image</>}
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
            gap: '1.15rem',
          }}
        >
          {filteredMedia.map((item) => (
            <div
              key={item.id}
              style={{
                background: '#ffffff',
                borderRadius: 14,
                border: '1px solid #e8eefa',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
              }}
            >
              {/* Thumbnail Container */}
              <div
                style={{
                  height: 155,
                  background: '#f8fafc',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderBottom: '1px solid #f1f5f9',
                }}
              >
                <img
                  src={item.url}
                  alt={item.altText || item.filename}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease',
                  }}
                  onError={(e) => {
                    // Fallback to placeholder icon if image fails
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />

                {/* File size badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    background: 'rgba(15, 23, 42, 0.75)',
                    backdropFilter: 'blur(4px)',
                    color: '#ffffff',
                    padding: '0.2rem 0.5rem',
                    borderRadius: 6,
                    fontSize: '0.68rem',
                    fontWeight: 700,
                  }}
                >
                  {formatFileSize(item.fileSize)}
                </div>
              </div>

              {/* Card Meta Content */}
              <div style={{ padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', flex: 1 }}>
                <span
                  style={{
                    fontSize: '0.84rem',
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

                <span
                  style={{
                    fontSize: '0.72rem',
                    color: item.altText ? '#64748b' : '#94a3b8',
                    fontStyle: item.altText ? 'normal' : 'italic',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                  title={item.altText || 'No alt text set'}
                >
                  {item.altText ? `Alt: ${item.altText}` : 'No alt text configured'}
                </span>

                {/* Actions Row */}
                <div style={{ display: 'flex', gap: '0.4rem', marginTop: 'auto', paddingTop: '0.65rem' }}>
                  <button
                    type="button"
                    onClick={() => handleCopyUrl(item.id, item.url)}
                    className={styles.secondaryBtn}
                    style={{
                      flex: 1,
                      padding: '0.4rem',
                      fontSize: '0.74rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                      background: copiedId === item.id ? '#ecfdf5' : '#ffffff',
                      color: copiedId === item.id ? '#059669' : '#334155',
                      borderColor: copiedId === item.id ? '#a7f3d0' : '#e2e8f0',
                    }}
                  >
                    {copiedId === item.id ? <Check size={13} color="#059669" /> : <Copy size={13} />}
                    {copiedId === item.id ? 'Copied' : 'Copy URL'}
                  </button>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.secondaryBtn}
                    style={{
                      padding: '0.4rem 0.55rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textDecoration: 'none',
                    }}
                    title="View full image in new tab"
                  >
                    <ExternalLink size={13} />
                  </a>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id, item.filename)}
                    className={styles.secondaryBtn}
                    style={{ padding: '0.4rem 0.55rem', color: '#ef4444' }}
                    title="Delete image from database"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          ADD MEDIA MODAL (Upload Image or Import via URL)
          ═══════════════════════════════════════════════════════════════ */}
      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1.25rem',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget && !uploading) {
              setModalOpen(false);
            }
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 20,
              width: '100%',
              maxWidth: 540,
              boxShadow: '0 25px 60px rgba(0,0,0,0.22)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              maxHeight: '90vh',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                padding: '1.25rem 1.5rem',
                borderBottom: '1px solid #e8eefa',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 850, margin: 0, color: '#0f172a' }}>
                  Add Media Asset
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0.2rem 0 0' }}>
                  Upload image directly to Neon PostgreSQL or register asset URL.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                disabled={uploading}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: '50%',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#64748b',
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Sub-tabs: Upload vs URL */}
            <div
              style={{
                display: 'flex',
                background: '#f8fafc',
                padding: '0.35rem 1.5rem',
                borderBottom: '1px solid #e8eefa',
                gap: '0.5rem',
              }}
            >
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: 8,
                  border: 'none',
                  background: activeTab === 'upload' ? '#ffffff' : 'transparent',
                  color: activeTab === 'upload' ? '#0052ff' : '#64748b',
                  fontWeight: 750,
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  cursor: 'pointer',
                  boxShadow: activeTab === 'upload' ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
                }}
              >
                <Upload size={14} /> Upload Image File
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('url')}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: 8,
                  border: 'none',
                  background: activeTab === 'url' ? '#ffffff' : 'transparent',
                  color: activeTab === 'url' ? '#0052ff' : '#64748b',
                  fontWeight: 750,
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  cursor: 'pointer',
                  boxShadow: activeTab === 'url' ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
                }}
              >
                <ExternalLink size={14} /> Import via URL
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '1.5rem', overflowY: 'auto' }}>
              {activeTab === 'upload' ? (
                /* ──────────────────────────────────────────
                   TAB 1: DIRECT IMAGE UPLOAD
                   ────────────────────────────────────────── */
                <div>
                  {/* Hidden file input */}
                  <input
                    type="file"
                    ref={modalFileInputRef}
                    accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handlePhotoUpload(e.target.files[0]);
                      }
                    }}
                  />

                  {uploadedItem ? (
                    /* Post-Upload Preview & Details */
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {/* Image Preview Box */}
                      <div
                        style={{
                          height: 190,
                          borderRadius: 14,
                          overflow: 'hidden',
                          background: '#0f172a',
                          position: 'relative',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          border: '1px solid #e2e8f0',
                        }}
                      >
                        <img
                          src={uploadedItem.url}
                          alt={uploadedItem.altText || uploadedItem.filename}
                          style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        />

                        {/* Top Badges */}
                        <div
                          style={{
                            position: 'absolute',
                            top: 10,
                            left: 10,
                            background: 'rgba(5, 150, 105, 0.9)',
                            backdropFilter: 'blur(4px)',
                            color: '#ffffff',
                            borderRadius: 6,
                            padding: '0.25rem 0.6rem',
                            fontSize: '0.72rem',
                            fontWeight: 750,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                          }}
                        >
                          <CheckCircle2 size={12} /> Stored in Neon PostgreSQL
                        </div>

                        <div
                          style={{
                            position: 'absolute',
                            top: 10,
                            right: 10,
                            background: 'rgba(15, 23, 42, 0.85)',
                            color: '#ffffff',
                            borderRadius: 6,
                            padding: '0.25rem 0.55rem',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                          }}
                        >
                          {formatFileSize(uploadedItem.fileSize)}
                        </div>

                        {/* Action buttons on image */}
                        <div
                          style={{
                            position: 'absolute',
                            bottom: 10,
                            right: 10,
                            display: 'flex',
                            gap: '0.45rem',
                          }}
                        >
                          <button
                            type="button"
                            disabled={uploading}
                            onClick={() => modalFileInputRef.current?.click()}
                            style={{
                              background: '#ffffff',
                              color: '#0f172a',
                              border: 'none',
                              borderRadius: 8,
                              padding: '0.4rem 0.75rem',
                              fontSize: '0.76rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                            }}
                          >
                            {uploading ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                            Replace
                          </button>

                          <button
                            type="button"
                            onClick={() => setUploadedItem(null)}
                            style={{
                              background: 'rgba(239, 68, 68, 0.9)',
                              color: '#ffffff',
                              border: 'none',
                              borderRadius: 8,
                              padding: '0.4rem 0.65rem',
                              fontSize: '0.76rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.3rem',
                            }}
                          >
                            <Trash2 size={12} /> Remove
                          </button>
                        </div>
                      </div>

                      {/* File Info Card */}
                      <div
                        style={{
                          background: '#f8fafc',
                          borderRadius: 10,
                          padding: '0.75rem 1rem',
                          border: '1px solid #e2e8f0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '0.75rem',
                        }}
                      >
                        <div style={{ overflow: 'hidden' }}>
                          <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 800 }}>
                            Filename
                          </span>
                          <p
                            style={{
                              fontSize: '0.82rem',
                              fontWeight: 750,
                              color: '#0f172a',
                              margin: '0.1rem 0 0',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {uploadedItem.filename}
                          </p>
                        </div>

                        <span
                          style={{
                            background: '#e2e8f0',
                            color: '#334155',
                            padding: '0.2rem 0.5rem',
                            borderRadius: 6,
                            fontSize: '0.7rem',
                            fontWeight: 750,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {uploadedItem.mimeType}
                        </span>
                      </div>

                      {/* Image Alt Text Input */}
                      <div>
                        <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                          Default Alt Text (SEO & Accessibility)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Tapfolio digital NFC business card demo"
                          value={formAlt}
                          onChange={(e) => setFormAlt(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.6rem 0.8rem',
                            borderRadius: 8,
                            border: '1px solid #cbd5e1',
                            marginTop: '0.3rem',
                            fontSize: '0.84rem',
                          }}
                        />
                      </div>

                      {/* Permanent Database URL */}
                      <div>
                        <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                          Database Image URL
                        </label>
                        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.3rem' }}>
                          <input
                            type="text"
                            readOnly
                            value={uploadedItem.url}
                            style={{
                              flex: 1,
                              padding: '0.6rem 0.8rem',
                              borderRadius: 8,
                              border: '1px solid #e2e8f0',
                              background: '#f8fafc',
                              fontSize: '0.82rem',
                              color: '#334155',
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handleCopyUrl(uploadedItem.id, uploadedItem.url)}
                            className={styles.secondaryBtn}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.35rem',
                              padding: '0.55rem 0.85rem',
                              fontSize: '0.8rem',
                            }}
                          >
                            <Copy size={13} /> Copy
                          </button>
                        </div>
                      </div>

                      {/* Modal Footer for Upload */}
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.5rem' }}>
                        <button
                          type="button"
                          onClick={() => {
                            setModalOpen(false);
                            setUploadedItem(null);
                          }}
                          className={styles.secondaryBtn}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleSaveUploadedModal}
                          className={styles.primaryBtn}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                        >
                          <Check size={14} /> Done / Save Asset
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Drag & Drop Zone (Matching Article Editor) */
                    <div>
                      <div
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsDraggingModal(true);
                        }}
                        onDragLeave={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsDraggingModal(false);
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setIsDraggingModal(false);
                          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                            handlePhotoUpload(e.dataTransfer.files[0]);
                          }
                        }}
                        onClick={() => modalFileInputRef.current?.click()}
                        style={{
                          height: 220,
                          borderRadius: 16,
                          background: isDraggingModal ? '#eff6ff' : '#f8fafc',
                          border: isDraggingModal ? '2px dashed #0052ff' : '2px dashed #cbd5e1',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          padding: '2rem 1.5rem',
                          gap: '0.75rem',
                          textAlign: 'center',
                        }}
                      >
                        <div
                          style={{
                            width: 56,
                            height: 56,
                            borderRadius: '50%',
                            background: '#e0edff',
                            color: '#0052ff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {uploading ? (
                            <Loader2 size={28} className="animate-spin" />
                          ) : (
                            <UploadCloud size={28} />
                          )}
                        </div>

                        <div>
                          <span style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', display: 'block' }}>
                            {uploading
                              ? 'Uploading photo to Neon PostgreSQL...'
                              : isDraggingModal
                              ? 'Drop image here to upload'
                              : 'Click to upload photo, or drag and drop'}
                          </span>
                          <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0.35rem 0 0' }}>
                            Supports PNG, JPG, WebP, GIF or SVG up to 10MB
                          </p>
                        </div>

                        <button
                          type="button"
                          disabled={uploading}
                          className={styles.primaryBtn}
                          style={{
                            padding: '0.5rem 1.15rem',
                            fontSize: '0.8rem',
                            borderRadius: 8,
                            marginTop: '0.35rem',
                            pointerEvents: 'none',
                          }}
                        >
                          <Upload size={14} /> Browse Files
                        </button>
                      </div>

                      <div
                        style={{
                          marginTop: '1.25rem',
                          padding: '0.75rem 1rem',
                          background: '#f8fafc',
                          borderRadius: 10,
                          border: '1px solid #e8eefa',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.65rem',
                        }}
                      >
                        <div
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: '#059669',
                            flexShrink: 0,
                          }}
                        />
                        <p style={{ fontSize: '0.75rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                          Direct binary storage in PostgreSQL BYTEA with HTTP streaming and 1-year immutable caching.
                        </p>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                        <button
                          type="button"
                          onClick={() => setModalOpen(false)}
                          className={styles.secondaryBtn}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* ──────────────────────────────────────────
                   TAB 2: IMPORT VIA URL
                   ────────────────────────────────────────── */
                <form onSubmit={handleAddMediaUrl} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.8rem',
                        borderRadius: 8,
                        border: '1px solid #e2e8f0',
                        marginTop: '0.3rem',
                        fontSize: '0.84rem',
                      }}
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
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.8rem',
                        borderRadius: 8,
                        border: '1px solid #e2e8f0',
                        marginTop: '0.3rem',
                        fontSize: '0.84rem',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                      Default Alt Text (SEO)
                    </label>
                    <input
                      type="text"
                      placeholder="SEO description for image tag"
                      value={formAlt}
                      onChange={(e) => setFormAlt(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.8rem',
                        borderRadius: 8,
                        border: '1px solid #e2e8f0',
                        marginTop: '0.3rem',
                        fontSize: '0.84rem',
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '0.65rem', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
                    <button
                      type="button"
                      onClick={() => setModalOpen(false)}
                      className={styles.secondaryBtn}
                    >
                      Cancel
                    </button>
                    <button type="submit" disabled={submittingUrl} className={styles.primaryBtn}>
                      {submittingUrl ? 'Saving...' : 'Add Asset'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
