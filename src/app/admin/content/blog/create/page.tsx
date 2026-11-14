'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  Save,
  Send,
  Eye,
  Calendar,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Bold,
  Italic,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link2,
  Image as ImageIcon,
  Table,
  Minus,
  Check,
  Globe,
  Share2,
  Tag,
  User,
  ExternalLink,
  Trash2,
  Copy,
  RotateCcw,
  X,
  FileText,
  Search,
  CheckCheck,
} from 'lucide-react';
import { slugify, calculateReadingTime, countWords } from '@/lib/blog-utils';
import styles from '@/app/admin/dashboard/dashboard.module.css';

function BlogEditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('id');

  // Article state
  const [postId, setPostId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [manualSlug, setManualSlug] = useState(false);
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [categoryName, setCategoryName] = useState('RFID & Tech');
  const [authorName, setAuthorName] = useState('Abhinand K.S.');
  const [tags, setTags] = useState<string[]>(['nfc', 'networking', 'technology']);
  const [tagInput, setTagInput] = useState('');
  const [status, setStatus] = useState<'DRAFT' | 'PENDING_REVIEW' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED'>('DRAFT');
  const [scheduledAt, setScheduledAt] = useState('');
  const [publishedAt, setPublishedAt] = useState<string | null>(null);

  // SEO state
  const [focusKeyword, setFocusKeyword] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [metaRobots, setMetaRobots] = useState('index, follow');

  // UI state
  const [activeTab, setActiveTab] = useState<'content' | 'seo' | 'social'>('content');
  const [writeMode, setWriteMode] = useState<'write' | 'preview'>('write');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [existingCategories, setExistingCategories] = useState<string[]>([]);
  const [existingAuthors, setExistingAuthors] = useState<string[]>([]);
  const [revisions, setRevisions] = useState<any[]>([]);

  // Load existing categories & authors
  useEffect(() => {
    fetch('/api/admin/blog/categories')
      .then((res) => res.json())
      .then((data) => {
        if (data.categories) {
          setExistingCategories(data.categories.map((c: any) => c.name));
        }
      })
      .catch(() => {});

    fetch('/api/admin/blog/authors')
      .then((res) => res.json())
      .then((data) => {
        if (data.authors) {
          setExistingAuthors(data.authors.map((a: any) => a.name));
        }
      })
      .catch(() => {});
  }, []);

  // Load article if editId is provided
  useEffect(() => {
    if (!editId) return;
    setLoading(true);
    fetch(`/api/admin/blog/posts/${editId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.post) {
          const p = data.post;
          setPostId(p.id);
          setTitle(p.title || '');
          setSlug(p.slug || '');
          setManualSlug(true);
          setSummary(p.summary || '');
          setContent(p.content || '');
          setFeaturedImage(p.featuredImage || '');
          setImageAlt(p.imageAlt || '');
          setCategoryName(p.categoryName || 'RFID & Tech');
          setAuthorName(p.authorName || 'Abhinand K.S.');
          setStatus(p.status || 'DRAFT');
          setPublishedAt(p.publishedAt || null);
          if (p.scheduledAt) {
            setScheduledAt(new Date(p.scheduledAt).toISOString().slice(0, 16));
          }
          setFocusKeyword(p.focusKeyword || '');
          setSeoTitle(p.seoTitle || '');
          setMetaDescription(p.metaDescription || '');
          setCanonicalUrl(p.canonicalUrl || '');
          setMetaRobots(p.metaRobots || 'index, follow');
          if (p.tags && Array.isArray(p.tags)) {
            setTags(p.tags.map((t: any) => t.tag?.name || t.name || String(t)));
          }
          if (p.revisions) {
            setRevisions(p.revisions);
          }
        }
      })
      .catch((e) => console.error('Error fetching post:', e))
      .finally(() => setLoading(false));
  }, [editId]);

  // Auto-generate slug from title unless manually edited
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!manualSlug) {
      setSlug(slugify(val));
    }
    if (!seoTitle) {
      setSeoTitle(val);
    }
  };

  const handleSlugChange = (val: string) => {
    setManualSlug(true);
    setSlug(slugify(val));
  };

  const handleResetSlug = () => {
    setManualSlug(false);
    setSlug(slugify(title));
  };

  const handleCopySlug = () => {
    const fullUrl = `https://tapfolio.me/blog/${slug}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedSlug(true);
    setTimeout(() => setCopiedSlug(false), 2000);
  };

  const handleAddTag = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = tagInput.trim().toLowerCase().replace(/^[#\s]+/, '');
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  // Word count & reading time
  const words = useMemo(() => countWords(content), [content]);
  const readTime = useMemo(() => calculateReadingTime(content), [content]);

  // SEO completeness checklist
  const seoChecklist = useMemo(() => {
    const kw = focusKeyword.trim().toLowerCase();
    const hasKw = kw.length > 0;
    return [
      {
        id: 'kw_defined',
        label: 'Focus keyword specified for SEO analysis',
        passed: hasKw,
      },
      {
        id: 'title_kw',
        label: 'Focus keyword included in article title',
        passed: hasKw && title.toLowerCase().includes(kw),
      },
      {
        id: 'slug_kw',
        label: 'Focus keyword included in URL slug',
        passed: hasKw && slug.toLowerCase().includes(slugify(kw)),
      },
      {
        id: 'desc_kw',
        label: 'Focus keyword in meta description or summary',
        passed: hasKw && (metaDescription || summary).toLowerCase().includes(kw),
      },
      {
        id: 'image_alt',
        label: 'Featured cover image alt text configured',
        passed: Boolean(imageAlt.trim()),
      },
      {
        id: 'word_count',
        label: 'Content exceeds 250 words for search indexing',
        passed: words >= 250,
      },
      {
        id: 'meta_length',
        label: 'Meta description length optimal (100–170 chars)',
        passed: (metaDescription || summary).length >= 100 && (metaDescription || summary).length <= 170,
      },
    ];
  }, [focusKeyword, title, slug, metaDescription, summary, imageAlt, words]);

  const seoScore = useMemo(() => {
    const passed = seoChecklist.filter((c) => c.passed).length;
    return Math.round((passed / seoChecklist.length) * 100);
  }, [seoChecklist]);

  // Insert markdown helpers
  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('blog-editor-textarea') as HTMLTextAreaElement | null;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end) || 'text';
    const replacement = `${prefix}${selected}${suffix}`;
    const nextContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(nextContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 0);
  };

  const handleSave = async (targetStatus?: typeof status) => {
    if (!title.trim()) {
      setFeedback({ text: 'Please enter an article title', type: 'error' });
      return;
    }

    setSaving(true);
    setFeedback(null);

    const postStatus = targetStatus || status;

    const payload = {
      id: postId || undefined,
      title: title.trim(),
      slug: slug.trim() || slugify(title),
      summary: summary.trim(),
      content: content.trim(),
      featuredImage: featuredImage.trim() || null,
      imageAlt: imageAlt.trim() || null,
      status: postStatus,
      categoryName,
      authorName,
      tags,
      scheduledAt: postStatus === 'SCHEDULED' && scheduledAt ? new Date(scheduledAt).toISOString() : null,
      // SEO
      seoTitle: seoTitle.trim() || title.trim(),
      metaDescription: metaDescription.trim() || summary.trim(),
      focusKeyword: focusKeyword.trim() || null,
      canonicalUrl: canonicalUrl.trim() || null,
      metaRobots,
    };

    try {
      const res = await fetch('/api/admin/blog/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setPostId(data.post.id);
        setStatus(data.post.status);
        setPublishedAt(data.post.publishedAt);
        setFeedback({
          text: data.message || 'Article saved successfully!',
          type: 'success',
        });
        if (!editId) {
          router.replace(`/admin/content/blog/create?id=${data.post.id}`);
        }
      } else {
        setFeedback({ text: data.error || 'Failed to save article', type: 'error' });
      }
    } catch (e: any) {
      setFeedback({ text: e.message || 'Network error saving article', type: 'error' });
    } finally {
      setSaving(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  return (
    <div className={styles.page}>
      {/* ─── Top Control Bar ─── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
          flexWrap: 'wrap',
          gap: '1rem',
          background: '#ffffff',
          padding: '0.85rem 1.25rem',
          borderRadius: 14,
          border: '1px solid #e8eefa',
          boxShadow: '0 2px 8px rgba(0, 82, 255, 0.03)',
        }}
      >
        {/* Left: Back & Breadcrumb State */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
          <Link
            href="/admin/content/blog/articles"
            className={styles.secondaryBtn}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.85rem',
              fontSize: '0.82rem',
              borderRadius: 8,
            }}
          >
            <ArrowLeft size={14} /> Back to Articles
          </Link>

          <div style={{ width: 1, height: 24, background: '#e2e8f0' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>
              {postId ? `Editing Article #${postId}` : 'New Blog Article'}
            </span>
            <span
              style={{
                padding: '0.22rem 0.65rem',
                borderRadius: 20,
                fontSize: '0.72rem',
                fontWeight: 800,
                letterSpacing: '0.02em',
                background:
                  status === 'PUBLISHED'
                    ? '#ecfdf5'
                    : status === 'SCHEDULED'
                    ? '#f0f9ff'
                    : status === 'PENDING_REVIEW'
                    ? '#f5f3ff'
                    : '#fffbeb',
                color:
                  status === 'PUBLISHED'
                    ? '#059669'
                    : status === 'SCHEDULED'
                    ? '#0284c7'
                    : status === 'PENDING_REVIEW'
                    ? '#7c3aed'
                    : '#d97706',
              }}
            >
              ● {status}
            </span>
          </div>

          <span style={{ fontSize: '0.76rem', color: '#94a3b8' }}>
            {words} words • {readTime}
          </span>
        </div>

        {/* Right: Unified Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {slug && (
            <Link
              href={`/blog/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondaryBtn}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.45rem 0.85rem',
                fontSize: '0.82rem',
                color: '#475569',
              }}
              title="Open public blog page in new tab"
            >
              <ExternalLink size={13} /> View on Site
            </Link>
          )}

          {status === 'PUBLISHED' ? (
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave('DRAFT')}
              className={styles.secondaryBtn}
              style={{
                padding: '0.45rem 0.85rem',
                fontSize: '0.82rem',
                color: '#d97706',
                borderColor: '#fde68a',
                background: '#fffbeb',
              }}
            >
              Unpublish
            </button>
          ) : (
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave('DRAFT')}
              className={styles.secondaryBtn}
              style={{
                padding: '0.45rem 0.85rem',
                fontSize: '0.82rem',
              }}
            >
              <Save size={13} /> Save Draft
            </button>
          )}

          {/* Primary Action Button */}
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave(status === 'DRAFT' ? 'PUBLISHED' : status)}
            className={styles.primaryBtn}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.48rem 1.15rem',
              fontSize: '0.82rem',
              fontWeight: 750,
            }}
          >
            {saving ? (
              'Saving...'
            ) : status === 'PUBLISHED' ? (
              <>
                <Save size={14} /> Save Changes
              </>
            ) : (
              <>
                <Send size={14} /> Publish Article
              </>
            )}
          </button>
        </div>
      </div>

      {/* ─── Notification Alert Banner ─── */}
      {feedback && (
        <div
          style={{
            padding: '0.75rem 1rem',
            background: feedback.type === 'success' ? '#ecfdf5' : '#fef2f2',
            border: `1px solid ${feedback.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
            color: feedback.type === 'success' ? '#065f46' : '#991b1b',
            borderRadius: 12,
            fontSize: '0.84rem',
            fontWeight: 650,
            marginBottom: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.55rem',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
          }}
        >
          {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{feedback.text}</span>
        </div>
      )}

      {/* ─── Main 2-Column Responsive Layout ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px', gap: '1.5rem', alignItems: 'start' }}>
        {/* ═══ Left Column: Writing Canvas & Workspaces ═══ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Card 1: Article Identity (Title, Slug Bar, Excerpt) */}
          <div
            className={styles.tableCard}
            style={{
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            {/* Title Input */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Article Title
                </label>
                <span style={{ fontSize: '0.72rem', color: title.length > 65 ? '#d97706' : '#94a3b8' }}>
                  {title.length} characters
                </span>
              </div>
              <input
                type="text"
                placeholder="Enter article title..."
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem',
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  borderRadius: 10,
                  border: '1px solid #e2e8f0',
                  outline: 'none',
                  background: '#ffffff',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                }}
              />
            </div>

            {/* URL Slug & Permalink Bar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 8,
                padding: '0.45rem 0.75rem',
                fontSize: '0.8rem',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#0052ff', fontWeight: 700 }}>
                <Globe size={13} />
                <span>https://tapfolio.me/blog/</span>
              </div>
              <input
                type="text"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                placeholder="url-slug"
                style={{
                  flex: 1,
                  minWidth: 160,
                  padding: '0.3rem 0.55rem',
                  borderRadius: 6,
                  border: '1px solid #cbd5e1',
                  fontSize: '0.8rem',
                  fontFamily: 'ui-monospace, monospace',
                  color: '#0f172a',
                  background: '#ffffff',
                }}
              />
              <button
                type="button"
                onClick={handleCopySlug}
                title="Copy complete URL"
                className={styles.secondaryBtn}
                style={{ padding: '0.3rem 0.6rem', fontSize: '0.72rem', gap: '0.3rem', borderRadius: 6 }}
              >
                {copiedSlug ? <CheckCheck size={12} color="#059669" /> : <Copy size={12} />}
                {copiedSlug ? 'Copied' : 'Copy'}
              </button>
              <button
                type="button"
                onClick={handleResetSlug}
                title="Reset slug from title"
                className={styles.secondaryBtn}
                style={{ padding: '0.3rem 0.5rem', borderRadius: 6 }}
              >
                <RotateCcw size={12} />
              </button>
            </div>

            {/* Short Excerpt / Summary */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Article Excerpt / Subtitle
                </label>
                <span style={{ fontSize: '0.72rem', color: summary.length >= 120 && summary.length <= 160 ? '#059669' : '#94a3b8' }}>
                  {summary.length} / 160 chars
                </span>
              </div>
              <textarea
                rows={2}
                placeholder="Write a compelling excerpt or summary that appears on blog cards and search engines..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: 10,
                  border: '1px solid #e2e8f0',
                  fontSize: '0.85rem',
                  lineHeight: 1.5,
                  color: '#334155',
                  outline: 'none',
                  resize: 'vertical',
                }}
              />
            </div>
          </div>

          {/* Card 2: Workspace Tabbed Area (Content vs SEO vs Social) */}
          <div className={styles.tableCard} style={{ padding: '1.25rem 1.5rem' }}>
            {/* Segmented Workspace Tabs */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid #e8eefa',
                paddingBottom: '0.85rem',
                marginBottom: '1rem',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', gap: '0.35rem', background: '#f1f5f9', padding: '0.25rem', borderRadius: 10 }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('content')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.4rem 0.85rem',
                    borderRadius: 8,
                    border: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 750,
                    cursor: 'pointer',
                    background: activeTab === 'content' ? '#ffffff' : 'transparent',
                    color: activeTab === 'content' ? '#0052ff' : '#64748b',
                    boxShadow: activeTab === 'content' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <FileText size={13} /> Article Body
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('seo')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.4rem 0.85rem',
                    borderRadius: 8,
                    border: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 750,
                    cursor: 'pointer',
                    background: activeTab === 'seo' ? '#ffffff' : 'transparent',
                    color: activeTab === 'seo' ? '#0052ff' : '#64748b',
                    boxShadow: activeTab === 'seo' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Search size={13} /> SEO Cockpit
                  <span
                    style={{
                      fontSize: '0.68rem',
                      padding: '0.1rem 0.45rem',
                      borderRadius: 10,
                      background: seoScore >= 75 ? '#ecfdf5' : '#fffbeb',
                      color: seoScore >= 75 ? '#059669' : '#d97706',
                      fontWeight: 800,
                    }}
                  >
                    {seoScore}%
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('social')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.4rem 0.85rem',
                    borderRadius: 8,
                    border: 'none',
                    fontSize: '0.8rem',
                    fontWeight: 750,
                    cursor: 'pointer',
                    background: activeTab === 'social' ? '#ffffff' : 'transparent',
                    color: activeTab === 'social' ? '#0052ff' : '#64748b',
                    boxShadow: activeTab === 'social' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <Share2 size={13} /> Social Preview
                </button>
              </div>

              {/* Sub-controls when Content tab is active */}
              {activeTab === 'content' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', background: '#e2e8f0', padding: '0.15rem', borderRadius: 6 }}>
                    <button
                      type="button"
                      onClick={() => setWriteMode('write')}
                      style={{
                        padding: '0.25rem 0.65rem',
                        borderRadius: 5,
                        border: 'none',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        background: writeMode === 'write' ? '#ffffff' : 'transparent',
                        color: writeMode === 'write' ? '#0f172a' : '#64748b',
                      }}
                    >
                      Write
                    </button>
                    <button
                      type="button"
                      onClick={() => setWriteMode('preview')}
                      style={{
                        padding: '0.25rem 0.65rem',
                        borderRadius: 5,
                        border: 'none',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        background: writeMode === 'preview' ? '#ffffff' : 'transparent',
                        color: writeMode === 'preview' ? '#0f172a' : '#64748b',
                      }}
                    >
                      Live Preview
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* TAB CONTENT 1: Article Body */}
            {activeTab === 'content' && (
              <div>
                {/* Formatting Toolbar */}
                {writeMode === 'write' && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: '0.45rem',
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: 8,
                      marginBottom: '0.75rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => insertFormatting('**', '**')}
                      title="Bold (**text**)"
                      className={styles.secondaryBtn}
                      style={{ padding: '0.35rem 0.55rem', borderRadius: 6 }}
                    >
                      <Bold size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('*', '*')}
                      title="Italic (*text*)"
                      className={styles.secondaryBtn}
                      style={{ padding: '0.35rem 0.55rem', borderRadius: 6 }}
                    >
                      <Italic size={13} />
                    </button>
                    <div style={{ width: 1, height: 18, background: '#cbd5e1', margin: '0 0.2rem' }} />
                    <button
                      type="button"
                      onClick={() => insertFormatting('## ')}
                      title="Heading 2 (## Title)"
                      className={styles.secondaryBtn}
                      style={{ padding: '0.35rem 0.55rem', borderRadius: 6 }}
                    >
                      <Heading2 size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('### ')}
                      title="Heading 3 (### Subtitle)"
                      className={styles.secondaryBtn}
                      style={{ padding: '0.35rem 0.55rem', borderRadius: 6 }}
                    >
                      <Heading3 size={13} />
                    </button>
                    <div style={{ width: 1, height: 18, background: '#cbd5e1', margin: '0 0.2rem' }} />
                    <button
                      type="button"
                      onClick={() => insertFormatting('- ')}
                      title="Bullet List (- item)"
                      className={styles.secondaryBtn}
                      style={{ padding: '0.35rem 0.55rem', borderRadius: 6 }}
                    >
                      <List size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('1. ')}
                      title="Numbered List (1. item)"
                      className={styles.secondaryBtn}
                      style={{ padding: '0.35rem 0.55rem', borderRadius: 6 }}
                    >
                      <ListOrdered size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('> ')}
                      title="Blockquote (> quote)"
                      className={styles.secondaryBtn}
                      style={{ padding: '0.35rem 0.55rem', borderRadius: 6 }}
                    >
                      <Quote size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('`', '`')}
                      title="Inline Code (`code`)"
                      className={styles.secondaryBtn}
                      style={{ padding: '0.35rem 0.55rem', borderRadius: 6 }}
                    >
                      <Code size={13} />
                    </button>
                    <div style={{ width: 1, height: 18, background: '#cbd5e1', margin: '0 0.2rem' }} />
                    <button
                      type="button"
                      onClick={() => insertFormatting('[Link title](', ')')}
                      title="Insert Hyperlink"
                      className={styles.secondaryBtn}
                      style={{ padding: '0.35rem 0.55rem', borderRadius: 6 }}
                    >
                      <Link2 size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('![Image alt](', ')')}
                      title="Insert Image"
                      className={styles.secondaryBtn}
                      style={{ padding: '0.35rem 0.55rem', borderRadius: 6 }}
                    >
                      <ImageIcon size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('\n| Feature | Details |\n| --- | --- |\n| NFC Card | Instant tap |\n')}
                      title="Insert Markdown Table"
                      className={styles.secondaryBtn}
                      style={{ padding: '0.35rem 0.55rem', borderRadius: 6 }}
                    >
                      <Table size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('\n---\n')}
                      title="Horizontal Divider"
                      className={styles.secondaryBtn}
                      style={{ padding: '0.35rem 0.55rem', borderRadius: 6 }}
                    >
                      <Minus size={13} />
                    </button>
                  </div>
                )}

                {/* Textarea or Rich Live Preview */}
                {writeMode === 'write' ? (
                  <textarea
                    id="blog-editor-textarea"
                    rows={22}
                    placeholder="Write your article in Markdown or clean text format..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '1.15rem',
                      fontSize: '0.94rem',
                      lineHeight: 1.75,
                      borderRadius: 10,
                      border: '1px solid #e2e8f0',
                      color: '#0f172a',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                      outline: 'none',
                      minHeight: 460,
                      resize: 'vertical',
                      boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      padding: '1.75rem',
                      background: '#ffffff',
                      borderRadius: 10,
                      border: '1px solid #e2e8f0',
                      minHeight: 460,
                      fontSize: '0.96rem',
                      lineHeight: 1.8,
                      color: '#1e293b',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {content ? (
                      <div>
                        {content.split('\n\n').map((block, idx) => {
                          const trimmed = block.trim();
                          if (trimmed.startsWith('## ')) {
                            return (
                              <h2 key={idx} style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '1.25rem 0 0.5rem' }}>
                                {trimmed.replace(/^##\s+/, '')}
                              </h2>
                            );
                          }
                          if (trimmed.startsWith('### ')) {
                            return (
                              <h3 key={idx} style={{ fontSize: '1.15rem', fontWeight: 750, color: '#1e293b', margin: '1rem 0 0.4rem' }}>
                                {trimmed.replace(/^###\s+/, '')}
                              </h3>
                            );
                          }
                          if (trimmed.startsWith('> ')) {
                            return (
                              <blockquote
                                key={idx}
                                style={{
                                  borderLeft: '4px solid #0052ff',
                                  paddingLeft: '1rem',
                                  margin: '1rem 0',
                                  color: '#475569',
                                  fontStyle: 'italic',
                                  background: '#f8fafc',
                                  padding: '0.75rem 1rem',
                                  borderRadius: '0 8px 8px 0',
                                }}
                              >
                                {trimmed.replace(/^>\s+/, '')}
                              </blockquote>
                            );
                          }
                          return (
                            <p key={idx} style={{ margin: '0 0 1rem', color: '#334155' }}>
                              {block}
                            </p>
                          );
                        })}
                      </div>
                    ) : (
                      <span style={{ color: '#94a3b8' }}>Article body is currently empty. Switch back to Write mode to draft.</span>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT 2: SEO Cockpit */}
            {activeTab === 'seo' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {/* Focus Keyword & Meta Title */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                      Focus Keyword
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. nfc business cards"
                      value={focusKeyword}
                      onChange={(e) => setFocusKeyword(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: 8,
                        border: '1px solid #e2e8f0',
                        fontSize: '0.84rem',
                        marginTop: '0.35rem',
                      }}
                    />
                    <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.2rem', display: 'block' }}>
                      The main search query you want this article to rank for.
                    </span>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                      SEO Title Tag ({seoTitle.length} / 60)
                    </label>
                    <input
                      type="text"
                      placeholder="Custom page title for search engines"
                      value={seoTitle}
                      onChange={(e) => setSeoTitle(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        borderRadius: 8,
                        border: '1px solid #e2e8f0',
                        fontSize: '0.84rem',
                        marginTop: '0.35rem',
                      }}
                    />
                    <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.2rem', display: 'block' }}>
                      Optimal: 50–60 characters. Brand suffix will be appended.
                    </span>
                  </div>
                </div>

                {/* Meta Description */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                      Meta Description ({metaDescription.length} / 160)
                    </label>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: metaDescription.length >= 120 && metaDescription.length <= 160 ? '#059669' : '#d97706',
                      }}
                    >
                      {metaDescription.length >= 120 && metaDescription.length <= 160 ? 'Optimal Length' : 'Aim for 120–160 chars'}
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Clear description that convinces Google searchers to click through to your article..."
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 8,
                      border: '1px solid #e2e8f0',
                      fontSize: '0.84rem',
                      marginTop: '0.35rem',
                      lineHeight: 1.5,
                    }}
                  />
                </div>

                {/* Google SERP Live Snippet Preview */}
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: 12,
                    padding: '1rem',
                  }}
                >
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Google Search Result Snippet Preview
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <div
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        background: '#0052ff',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.65rem',
                        fontWeight: 900,
                      }}
                    >
                      T
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#202124' }}>
                      https://tapfolio.me › blog › {slug || 'slug'}
                    </span>
                  </div>
                  <div style={{ fontSize: '1.05rem', color: '#1a0dab', fontWeight: 600, margin: '0.2rem 0', cursor: 'pointer' }}>
                    {seoTitle || title || 'Article Title'} — Tapfolio
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#4d5156', lineHeight: 1.45 }}>
                    {metaDescription || summary || 'Your meta description snippet will appear here on Google search results.'}
                  </div>
                </div>

                {/* Technical SEO Controls */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                      Canonical URL (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="https://tapfolio.me/blog/..."
                      value={canonicalUrl}
                      onChange={(e) => setCanonicalUrl(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.8rem',
                        borderRadius: 8,
                        border: '1px solid #e2e8f0',
                        fontSize: '0.82rem',
                        marginTop: '0.35rem',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                      Robots Meta Directives
                    </label>
                    <select
                      value={metaRobots}
                      onChange={(e) => setMetaRobots(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.8rem',
                        borderRadius: 8,
                        border: '1px solid #e2e8f0',
                        fontSize: '0.82rem',
                        background: '#fff',
                        marginTop: '0.35rem',
                      }}
                    >
                      <option value="index, follow">index, follow (Default - Recommended)</option>
                      <option value="noindex, follow">noindex, follow (Hide from search)</option>
                      <option value="noindex, nofollow">noindex, nofollow (Complete block)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: Social Preview */}
            {activeTab === 'social' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
                  This preview illustrates how your article card renders when shared on Twitter / X, LinkedIn, WhatsApp, and Slack.
                </p>

                <div
                  style={{
                    maxWidth: 540,
                    border: '1px solid #e2e8f0',
                    borderRadius: 14,
                    overflow: 'hidden',
                    background: '#ffffff',
                    boxShadow: '0 4px 14px rgba(0,0,0,0.04)',
                  }}
                >
                  <div style={{ height: 220, background: '#f1f5f9', position: 'relative' }}>
                    {featuredImage ? (
                      <img
                        src={featuredImage}
                        alt={imageAlt || title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#94a3b8',
                          flexDirection: 'column',
                          gap: '0.5rem',
                        }}
                      >
                        <ImageIcon size={32} />
                        <span style={{ fontSize: '0.8rem' }}>Set a featured cover image in the right sidebar</span>
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                      tapfolio.me
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: '0.3rem 0' }}>
                      {seoTitle || title || 'Article Title'}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#64748b', lineHeight: 1.45 }}>
                      {metaDescription || summary || 'Short summary preview appears here.'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ═══ Right Column: Inspector & Settings Sidebar ═══ */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Settings Card 1: Publishing & Visibility */}
          <div className={styles.tableCard} style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Send size={15} color="#0052ff" />
                <h3 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Publishing & Visibility
                </h3>
              </div>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  padding: '0.15rem 0.5rem',
                  borderRadius: 12,
                  background: status === 'PUBLISHED' ? '#ecfdf5' : '#fffbeb',
                  color: status === 'PUBLISHED' ? '#059669' : '#d97706',
                }}
              >
                {status}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                  Workflow Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    background: '#fff',
                    marginTop: '0.25rem',
                  }}
                >
                  <option value="DRAFT">Draft (Unpublished)</option>
                  <option value="PENDING_REVIEW">Pending Review</option>
                  <option value="SCHEDULED">Scheduled Publication</option>
                  <option value="PUBLISHED">Published Live</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>

              {/* Scheduled Date Picker */}
              {status === 'SCHEDULED' && (
                <div style={{ background: '#f0f9ff', padding: '0.65rem', borderRadius: 8, border: '1px solid #bae6fd' }}>
                  <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0369a1', textTransform: 'uppercase' }}>
                    Scheduled Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.45rem 0.65rem',
                      borderRadius: 6,
                      border: '1px solid #93c5fd',
                      fontSize: '0.8rem',
                      marginTop: '0.25rem',
                      background: '#fff',
                    }}
                  />
                  <span style={{ fontSize: '0.7rem', color: '#0369a1', marginTop: '0.25rem', display: 'block' }}>
                    Article will publish automatically at this time.
                  </span>
                </div>
              )}

              {/* Published timestamp */}
              {publishedAt && (
                <div
                  style={{
                    fontSize: '0.74rem',
                    color: '#059669',
                    background: '#ecfdf5',
                    padding: '0.45rem 0.65rem',
                    borderRadius: 8,
                    border: '1px solid #a7f3d0',
                  }}
                >
                  Published on: {new Date(publishedAt).toLocaleString()}
                </div>
              )}

              {/* Category */}
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                  Category
                </label>
                <select
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                    fontSize: '0.82rem',
                    background: '#fff',
                    marginTop: '0.25rem',
                  }}
                >
                  <option value="RFID & Tech">RFID & Tech</option>
                  <option value="Local Business">Local Business</option>
                  <option value="Security">Security</option>
                  <option value="Design Guides">Design Guides</option>
                  <option value="NFC Hardware">NFC Hardware</option>
                  <option value="Networking">Networking</option>
                  <option value="Marketing & Sales">Marketing & Sales</option>
                  {existingCategories
                    .filter(
                      (c) =>
                        ![
                          'RFID & Tech',
                          'Local Business',
                          'Security',
                          'Design Guides',
                          'NFC Hardware',
                          'Networking',
                          'Marketing & Sales',
                        ].includes(c)
                    )
                    .map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                </select>
              </div>

              {/* Author */}
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                  Author
                </label>
                <select
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                    fontSize: '0.82rem',
                    background: '#fff',
                    marginTop: '0.25rem',
                  }}
                >
                  <option value="Abhinand K.S.">Abhinand K.S. (Founder & CEO)</option>
                  <option value="Mohammed Nibrasul Haqq">Mohammed Nibrasul Haqq (CTO)</option>
                  <option value="Tapfolio Team">Tapfolio Team</option>
                  {existingAuthors
                    .filter((a) => !['Abhinand K.S.', 'Mohammed Nibrasul Haqq', 'Tapfolio Team'].includes(a))
                    .map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>

          {/* Settings Card 2: Featured Cover Image */}
          <div className={styles.tableCard} style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.85rem' }}>
              <ImageIcon size={15} color="#0052ff" />
              <h3 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Featured Cover Image
              </h3>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {featuredImage ? (
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: 150,
                    borderRadius: 10,
                    overflow: 'hidden',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <img
                    src={featuredImage}
                    alt={imageAlt || 'Featured preview'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <button
                    type="button"
                    onClick={() => setFeaturedImage('')}
                    style={{
                      position: 'absolute',
                      top: 8,
                      right: 8,
                      background: 'rgba(15, 23, 42, 0.75)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      padding: '4px 8px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                    }}
                  >
                    <Trash2 size={11} /> Remove
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    height: 110,
                    borderRadius: 10,
                    background: '#f8fafc',
                    border: '1.5px dashed #cbd5e1',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#94a3b8',
                    gap: '0.4rem',
                  }}
                >
                  <ImageIcon size={24} />
                  <span style={{ fontSize: '0.76rem' }}>No cover image configured</span>
                </div>
              )}

              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                  Image URL
                </label>
                <input
                  type="text"
                  placeholder="/assets/blog/... or https://..."
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.7rem',
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                    fontSize: '0.8rem',
                    marginTop: '0.2rem',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                  Image Alt Text (SEO)
                </label>
                <input
                  type="text"
                  placeholder="Describe image for search indexing"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.7rem',
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                    fontSize: '0.8rem',
                    marginTop: '0.2rem',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Settings Card 3: Tags & Taxonomy */}
          <div className={styles.tableCard} style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.85rem' }}>
              <Tag size={15} color="#0052ff" />
              <h3 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Article Tags
              </h3>
            </div>

            {/* Tags interactive chips */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.75rem' }}>
              {tags.map((t) => (
                <span
                  key={t}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: '#eff6ff',
                    color: '#1d4ed8',
                    padding: '0.25rem 0.6rem',
                    borderRadius: 20,
                    fontSize: '0.74rem',
                    fontWeight: 700,
                  }}
                >
                  #{t}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(t)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      padding: 0,
                      display: 'flex',
                      color: '#1d4ed8',
                    }}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              {tags.length === 0 && (
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>No tags added yet.</span>
              )}
            </div>

            {/* Add Tag Form */}
            <form onSubmit={handleAddTag} style={{ display: 'flex', gap: '0.4rem' }}>
              <input
                type="text"
                placeholder="Add tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.45rem 0.65rem',
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                  fontSize: '0.78rem',
                }}
              />
              <button
                type="submit"
                className={styles.secondaryBtn}
                style={{ padding: '0.45rem 0.75rem', fontSize: '0.76rem', borderRadius: 8 }}
              >
                Add
              </button>
            </form>
          </div>

          {/* Settings Card 4: SEO Quality & Audit Score */}
          <div className={styles.tableCard} style={{ padding: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                <Sparkles size={15} color="#0052ff" />
                <h3 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  SEO Health Score
                </h3>
              </div>
              <span
                style={{
                  fontSize: '0.82rem',
                  fontWeight: 900,
                  color: seoScore >= 75 ? '#059669' : '#d97706',
                }}
              >
                {seoScore}%
              </span>
            </div>

            {/* Progress Bar */}
            <div style={{ width: '100%', height: 6, background: '#f1f5f9', borderRadius: 4, overflow: 'hidden', marginBottom: '0.85rem' }}>
              <div
                style={{
                  width: `${seoScore}%`,
                  height: '100%',
                  background: seoScore >= 75 ? '#10b981' : '#f59e0b',
                  borderRadius: 4,
                  transition: 'width 0.3s ease',
                }}
              />
            </div>

            {/* Compact Checklist */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
              {seoChecklist.map((c) => (
                <div
                  key={c.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    fontSize: '0.74rem',
                    color: c.passed ? '#059669' : '#94a3b8',
                  }}
                >
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      background: c.passed ? '#ecfdf5' : '#f1f5f9',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {c.passed ? <Check size={11} color="#059669" /> : <Minus size={11} color="#cbd5e1" />}
                  </span>
                  <span>{c.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Settings Card 5: Revision History (if available) */}
          {revisions && revisions.length > 0 && (
            <div className={styles.tableCard} style={{ padding: '1.25rem' }}>
              <h3 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.65rem' }}>
                Revision History
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {revisions.map((rev) => (
                  <div
                    key={rev.id}
                    style={{
                      padding: '0.4rem 0.6rem',
                      background: '#f8fafc',
                      borderRadius: 6,
                      fontSize: '0.74rem',
                      color: '#64748b',
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>{new Date(rev.createdAt).toLocaleString()}</span>
                    <span style={{ fontWeight: 700, color: '#334155' }}>{rev.savedBy}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BlogEditorPage() {
  return (
    <React.Suspense
      fallback={
        <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
          Loading editor...
        </div>
      }
    >
      <BlogEditorContent />
    </React.Suspense>
  );
}
