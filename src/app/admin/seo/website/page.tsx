'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Save,
  Globe,
  Share2,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Eye,
} from 'lucide-react';
import styles from '../../dashboard/dashboard.module.css';

export default function WebsiteSeoPage() {
  const [selectedPath, setSelectedPath] = useState('/');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [robots, setRobots] = useState('index, follow');
  const [isIndexed, setIsIndexed] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const loadMeta = async (path: string) => {
    try {
      const res = await fetch(`/api/admin/seo/meta?path=${encodeURIComponent(path)}`);
      const data = await res.json();
      if (data.success && data.meta) {
        setTitle(data.meta.title || '');
        setDescription(data.meta.description || '');
        setCanonicalUrl(data.meta.canonicalUrl || `https://tapfolio.me${path}`);
        setOgTitle(data.meta.ogTitle || '');
        setOgDescription(data.meta.ogDescription || '');
        setOgImage(data.meta.ogImage || 'https://tapfolio.me/og-image.png');
        setRobots(data.meta.robots || 'index, follow');
        setIsIndexed(data.meta.isIndexed ?? true);
      }
    } catch (e) {
      console.error('Failed to load SEO meta:', e);
    }
  };

  useEffect(() => {
    loadMeta(selectedPath);
  }, [selectedPath]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/admin/seo/meta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: selectedPath,
          title,
          description,
          canonicalUrl,
          ogTitle,
          ogDescription,
          ogImage,
          robots,
          isIndexed,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (e) {
      console.error('Failed to save SEO meta:', e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>On-Page SEO & Metadata Manager</h1>
          <p className={styles.subtitle}>
            Control search titles, meta tags, OpenGraph social cards and canonical URLs for every public route
          </p>
        </div>
        <div className={styles.headerRight}>
          {savedSuccess && (
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 750,
                color: '#059669',
                background: '#ecfdf5',
                padding: '0.4rem 0.85rem',
                borderRadius: 8,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <CheckCircle2 size={14} /> Meta saved successfully!
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className={styles.refreshBtn}
          >
            <Save size={15} />
            <span>{isSaving ? 'Saving Changes...' : 'Save Meta Tag'}</span>
          </button>
        </div>
      </header>

      {/* Route Selector Bar */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e8eefa',
          borderRadius: 14,
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          marginBottom: '1.5rem',
          boxShadow: '0 2px 10px rgba(0, 82, 255, 0.02)',
        }}
      >
        <span style={{ fontSize: '0.82rem', fontWeight: 750, color: '#475569', textTransform: 'uppercase' }}>
          Select Route to Edit:
        </span>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {[
            { path: '/', label: 'Homepage (/)' },
            { path: '/about', label: 'About Page (/about)' },
            { path: '/careers', label: 'Careers Portal (/careers)' },
            { path: '/pricing', label: 'Pricing (/pricing)' },
            { path: '/features', label: 'Features (/features)' },
          ].map((r) => (
            <button
              key={r.path}
              type="button"
              onClick={() => setSelectedPath(r.path)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: 8,
                border: selectedPath === r.path ? '1px solid #0052ff' : '1px solid #e2e8f0',
                background: selectedPath === r.path ? '#0052ff' : '#ffffff',
                color: selectedPath === r.path ? '#ffffff' : '#334155',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Editor Grid: Form + Live Previews */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
        {/* Left Column: Form Inputs */}
        <div className={styles.panelCard}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: '0 0 1.25rem 0' }}>
            Metadata Parameters for {selectedPath}
          </h2>

          <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.74rem', fontWeight: 750, color: '#475569', textTransform: 'uppercase' }}>
                SEO Meta Title (Recommended: 50–60 characters)
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 10,
                  border: '1px solid #e2e8f0',
                  marginTop: '0.3rem',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: '#0f172a',
                }}
              />
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                {title.length} characters
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.74rem', fontWeight: 750, color: '#475569', textTransform: 'uppercase' }}>
                Meta Description (Recommended: 150–160 characters)
              </label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 10,
                  border: '1px solid #e2e8f0',
                  marginTop: '0.3rem',
                  fontSize: '0.85rem',
                  lineHeight: 1.5,
                  fontFamily: 'inherit',
                  color: '#0f172a',
                }}
              />
              <div style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                {description.length} characters
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.74rem', fontWeight: 750, color: '#475569', textTransform: 'uppercase' }}>
                Canonical URL
              </label>
              <input
                type="text"
                value={canonicalUrl}
                onChange={(e) => setCanonicalUrl(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 10,
                  border: '1px solid #e2e8f0',
                  marginTop: '0.3rem',
                  fontSize: '0.85rem',
                  color: '#0f172a',
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 750, color: '#475569', textTransform: 'uppercase' }}>
                  OpenGraph Title
                </label>
                <input
                  type="text"
                  value={ogTitle}
                  onChange={(e) => setOgTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: 10,
                    border: '1px solid #e2e8f0',
                    marginTop: '0.3rem',
                    fontSize: '0.85rem',
                    color: '#0f172a',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 750, color: '#475569', textTransform: 'uppercase' }}>
                  Robots Meta Directives
                </label>
                <select
                  value={robots}
                  onChange={(e) => setRobots(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.6rem 0.85rem',
                    borderRadius: 10,
                    border: '1px solid #e2e8f0',
                    marginTop: '0.3rem',
                    fontSize: '0.85rem',
                    color: '#0f172a',
                    background: '#ffffff',
                  }}
                >
                  <option value="index, follow">index, follow (Standard Public Page)</option>
                  <option value="noindex, follow">noindex, follow</option>
                  <option value="noindex, nofollow">noindex, nofollow (Private / Admin)</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.74rem', fontWeight: 750, color: '#475569', textTransform: 'uppercase' }}>
                OpenGraph Social Share Image URL
              </label>
              <input
                type="text"
                value={ogImage}
                onChange={(e) => setOgImage(e.target.value)}
                placeholder="https://tapfolio.me/og-image.png"
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 10,
                  border: '1px solid #e2e8f0',
                  marginTop: '0.3rem',
                  fontSize: '0.85rem',
                  color: '#0f172a',
                }}
              />
            </div>
          </form>
        </div>

        {/* Right Column: Live Previews */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Live Google Search Preview Card */}
          <div className={styles.panelCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Globe size={16} className="text-blue-600" />
              <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                Google Search Result (SERP) Preview
              </span>
            </div>

            <div
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                padding: '1.25rem',
                fontFamily: 'Arial, sans-serif',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ fontSize: '13px', color: '#202124', marginBottom: '2px' }}>
                tapfolio.me {selectedPath !== '/' && `› ${selectedPath.replace('/', '')}`}
              </div>
              <div
                style={{
                  fontSize: '18px',
                  fontWeight: 400,
                  color: '#1a0dab',
                  lineHeight: 1.3,
                  cursor: 'pointer',
                  textDecoration: 'none',
                }}
              >
                {title || 'Tapfolio — Smart Digital Business Cards'}
              </div>
              <div
                style={{
                  fontSize: '13px',
                  color: '#4d5156',
                  lineHeight: 1.5,
                  marginTop: '4px',
                }}
              >
                {description ||
                  'Share your professional identity with a single tap. Instant portfolio, contact exchange, and real-time networking analytics.'}
              </div>
            </div>
          </div>

          {/* Live Social Card Share Preview */}
          <div className={styles.panelCard}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Share2 size={16} className="text-blue-600" />
              <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a' }}>
                OpenGraph Social Share Card Preview
              </span>
            </div>

            <div
              style={{
                border: '1px solid #e2e8f0',
                borderRadius: 12,
                overflow: 'hidden',
                background: '#ffffff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
              }}
            >
              <div
                style={{
                  height: '140px',
                  background: 'linear-gradient(135deg, #0052ff, #0088ff)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                }}
              >
                Tapfolio Smart NFC
              </div>
              <div style={{ padding: '0.85rem 1rem' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase' }}>
                  tapfolio.me
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>
                  {ogTitle || title}
                </div>
                <div style={{ fontSize: '0.76rem', color: '#475569', marginTop: '2px' }}>
                  {ogDescription || description}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
