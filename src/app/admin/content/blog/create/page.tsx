'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  FileText,
  Save,
  Send,
  Eye,
  Calendar,
  Clock,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
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
  ChevronDown,
  Globe,
  Share2,
  Tag,
  User,
  ExternalLink,
  Trash2,
} from 'lucide-react';
import { slugify, calculateReadingTime, countWords } from '@/lib/blog-service';
import styles from '../../dashboard/dashboard.module.css';

export default function BlogEditorPage() {
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
  const [tagsInput, setTagsInput] = useState('nfc, networking, technology');
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
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
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
      });
    fetch('/api/admin/blog/authors')
      .then((res) => res.json())
      .then((data) => {
        if (data.authors) {
          setExistingAuthors(data.authors.map((a: any) => a.name));
        }
      });
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

  // Word count & reading time
  const words = useMemo(() => countWords(content), [content]);
  const readTime = useMemo(() => calculateReadingTime(content), [content]);

  // SEO completeness checklist
  const seoChecklist = useMemo(() => {
    const kw = focusKeyword.trim().toLowerCase();
    const hasKw = kw.length > 0;
    return [
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
        label: 'Focus keyword in meta description',
        passed: hasKw && (metaDescription || summary).toLowerCase().includes(kw),
      },
      {
        id: 'image_alt',
        label: 'Featured image alt text configured',
        passed: Boolean(imageAlt.trim()),
      },
      {
        id: 'word_count',
        label: 'Content exceeds 250 words for index ranking',
        passed: words >= 250,
      },
      {
        id: 'meta_length',
        label: 'Meta description length between 120-160 characters',
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
        setFeedback({ text: data.error || 'Failed to save', type: 'error' });
      }
    } catch (e: any) {
      setFeedback({ text: e.message || 'Network error', type: 'error' });
    } finally {
      setSaving(false);
      setTimeout(() => setFeedback(null), 4000);
    }
  };

  return (
    <div className={styles.page}>
      {/* ─── Top Bar with Actions ─── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link
            href="/admin/content/blog/articles"
            className={styles.secondaryBtn}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.45rem 0.75rem' }}
          >
            <ArrowLeft size={14} /> Back to Articles
          </Link>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
            {postId ? `Editing Article #${postId}` : 'New Blog Article'}
          </span>
          <span
            style={{
              padding: '0.2rem 0.6rem',
              borderRadius: 20,
              fontSize: '0.72rem',
              fontWeight: 800,
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

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {slug && (
            <Link
              href={`/blog/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondaryBtn}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <ExternalLink size={14} /> Preview
            </Link>
          )}

          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave('DRAFT')}
            className={styles.secondaryBtn}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <Save size={14} /> Save Draft
          </button>

          {status === 'PUBLISHED' ? (
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave('DRAFT')}
              className={styles.secondaryBtn}
              style={{ color: '#d97706', fontWeight: 700 }}
            >
              Unpublish
            </button>
          ) : (
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave('PUBLISHED')}
              className={styles.primaryBtn}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Send size={14} /> Publish Now
            </button>
          )}
        </div>
      </div>

      {/* Notification Banner */}
      {feedback && (
        <div
          style={{
            padding: '0.75rem 1rem',
            background: feedback.type === 'success' ? '#ecfdf5' : '#fef2f2',
            border: `1px solid ${feedback.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
            color: feedback.type === 'success' ? '#065f46' : '#991b1b',
            borderRadius: 10,
            fontSize: '0.84rem',
            fontWeight: 650,
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          {feedback.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {feedback.text}
        </div>
      )}

      {/* ─── Main Editor 2-Column Grid ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.25rem' }}>
        {/* Left Column: Editor Workspace */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Article Title & Slug Card */}
          <div className={styles.tableCard} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div>
              <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                Article Title
              </label>
              <input
                type="text"
                placeholder="e.g. How NFC Business Cards Are Changing Enterprise Networking in 2026"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  color: '#0f172a',
                  borderRadius: 10,
                  border: '1px solid #e2e8f0',
                  marginTop: '0.35rem',
                  outline: 'none',
                }}
              />
            </div>

            {/* URL Slug Preview & Editing */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: '#64748b' }}>
              <span style={{ fontWeight: 600 }}>Slug:</span>
              <span style={{ color: '#0052ff', fontWeight: 700 }}>https://tapfolio.me/blog/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => handleSlugChange(e.target.value)}
                style={{
                  flex: 1,
                  padding: '0.35rem 0.6rem',
                  borderRadius: 6,
                  border: '1px solid #cbd5e1',
                  fontSize: '0.8rem',
                  fontFamily: 'monospace',
                }}
              />
            </div>

            {/* Short Excerpt */}
            <div>
              <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                Article Excerpt / Summary
              </label>
              <textarea
                rows={2}
                placeholder="Brief summary that appears in blog listings and search results..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 10,
                  border: '1px solid #e2e8f0',
                  fontSize: '0.84rem',
                  color: '#334155',
                  marginTop: '0.35rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Rich Content Editor Card */}
          <div className={styles.tableCard}>
            {/* Editor Top Toolbar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '0.65rem',
                borderBottom: '1px solid #e8eefa',
                marginBottom: '0.75rem',
                flexWrap: 'wrap',
                gap: '0.5rem',
              }}
            >
              {/* Write vs Preview Tabs */}
              <div style={{ display: 'flex', gap: '0.3rem', background: '#f1f5f9', padding: '0.2rem', borderRadius: 8 }}>
                <button
                  type="button"
                  onClick={() => setActiveTab('write')}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: 6,
                    border: 'none',
                    fontSize: '0.78rem',
                    fontWeight: 750,
                    cursor: 'pointer',
                    background: activeTab === 'write' ? '#ffffff' : 'transparent',
                    color: activeTab === 'write' ? '#0052ff' : '#64748b',
                    boxShadow: activeTab === 'write' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  }}
                >
                  Write
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: 6,
                    border: 'none',
                    fontSize: '0.78rem',
                    fontWeight: 750,
                    cursor: 'pointer',
                    background: activeTab === 'preview' ? '#ffffff' : 'transparent',
                    color: activeTab === 'preview' ? '#0052ff' : '#64748b',
                    boxShadow: activeTab === 'preview' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  }}
                >
                  Live Preview
                </button>
              </div>

              {/* Formatting Action Tools */}
              {activeTab === 'write' && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <button
                    type="button"
                    onClick={() => insertFormatting('**', '**')}
                    title="Bold"
                    className={styles.secondaryBtn}
                    style={{ padding: '0.3rem 0.5rem' }}
                  >
                    <Bold size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('*', '*')}
                    title="Italic"
                    className={styles.secondaryBtn}
                    style={{ padding: '0.3rem 0.5rem' }}
                  >
                    <Italic size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('## ')}
                    title="Heading 2"
                    className={styles.secondaryBtn}
                    style={{ padding: '0.3rem 0.5rem' }}
                  >
                    <Heading2 size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('### ')}
                    title="Heading 3"
                    className={styles.secondaryBtn}
                    style={{ padding: '0.3rem 0.5rem' }}
                  >
                    <Heading3 size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('- ')}
                    title="Bullet List"
                    className={styles.secondaryBtn}
                    style={{ padding: '0.3rem 0.5rem' }}
                  >
                    <List size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('1. ')}
                    title="Numbered List"
                    className={styles.secondaryBtn}
                    style={{ padding: '0.3rem 0.5rem' }}
                  >
                    <ListOrdered size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('> ')}
                    title="Quote"
                    className={styles.secondaryBtn}
                    style={{ padding: '0.3rem 0.5rem' }}
                  >
                    <Quote size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('`', '`')}
                    title="Inline Code"
                    className={styles.secondaryBtn}
                    style={{ padding: '0.3rem 0.5rem' }}
                  >
                    <Code size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('[Link title](', ')')}
                    title="Add Hyperlink"
                    className={styles.secondaryBtn}
                    style={{ padding: '0.3rem 0.5rem' }}
                  >
                    <Link2 size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('![Image alt](', ')')}
                    title="Insert Image"
                    className={styles.secondaryBtn}
                    style={{ padding: '0.3rem 0.5rem' }}
                  >
                    <ImageIcon size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting('\n| Header 1 | Header 2 |\n| --- | --- |\n| Cell 1 | Cell 2 |\n')}
                    title="Insert Table"
                    className={styles.secondaryBtn}
                    style={{ padding: '0.3rem 0.5rem' }}
                  >
                    <Table size={13} />
                  </button>
                </div>
              )}

              {/* Word & Reading Time Badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.74rem', color: '#64748b' }}>
                <span>{words} words</span>
                <span>•</span>
                <span>{readTime}</span>
              </div>
            </div>

            {/* Textarea or Preview Viewport */}
            {activeTab === 'write' ? (
              <textarea
                id="blog-editor-textarea"
                rows={18}
                placeholder="Write your article in Markdown or rich text format..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                style={{
                  width: '100%',
                  padding: '1rem',
                  fontSize: '0.92rem',
                  lineHeight: 1.65,
                  borderRadius: 10,
                  border: '1px solid #e2e8f0',
                  color: '#1e293b',
                  fontFamily: 'ui-sans-serif, system-ui, sans-serif',
                  outline: 'none',
                  minHeight: 380,
                  resize: 'vertical',
                }}
              />
            ) : (
              <div
                style={{
                  padding: '1.5rem',
                  background: '#f8fafc',
                  borderRadius: 10,
                  border: '1px solid #e2e8f0',
                  minHeight: 380,
                  fontSize: '0.95rem',
                  lineHeight: 1.75,
                  color: '#1e293b',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {content || <span style={{ color: '#94a3b8' }}>Article body is empty.</span>}
              </div>
            )}
          </div>

          {/* SEO & Meta Tag Management Card */}
          <div className={styles.tableCard}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <div>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                  SEO & Search Engine Optimization
                </h3>
                <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
                  Control title tags, meta description and structured data for Google rankings
                </p>
              </div>
              <div
                style={{
                  padding: '0.3rem 0.65rem',
                  borderRadius: 20,
                  background: seoScore >= 75 ? '#ecfdf5' : '#fffbeb',
                  color: seoScore >= 75 ? '#059669' : '#d97706',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                }}
              >
                SEO Score: {seoScore}%
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '0.85rem' }}>
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                  Focus Keyword
                </label>
                <input
                  type="text"
                  placeholder="e.g. nfc business cards"
                  value={focusKeyword}
                  onChange={(e) => setFocusKeyword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                    fontSize: '0.82rem',
                    marginTop: '0.25rem',
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                  SEO Meta Title
                </label>
                <input
                  type="text"
                  placeholder="Custom title tag for Google"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                    fontSize: '0.82rem',
                    marginTop: '0.25rem',
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '0.85rem' }}>
              <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                Meta Description ({metaDescription.length} chars)
              </label>
              <textarea
                rows={2}
                placeholder="140-160 character description explaining what readers will learn..."
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  borderRadius: 8,
                  border: '1px solid #e2e8f0',
                  fontSize: '0.82rem',
                  marginTop: '0.25rem',
                }}
              />
            </div>

            {/* Google SERP Live Snippet Preview */}
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: 10,
                padding: '0.85rem',
                marginBottom: '0.85rem',
              }}
            >
              <div style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                Google Search Result Preview
              </div>
              <div style={{ fontSize: '0.75rem', color: '#202124' }}>
                https://tapfolio.me › blog › {slug || 'slug'}
              </div>
              <div style={{ fontSize: '1rem', color: '#1a0dab', fontWeight: 600, margin: '0.15rem 0' }}>
                {seoTitle || title || 'Article Title'} — Tapfolio
              </div>
              <div style={{ fontSize: '0.8rem', color: '#4d5156', lineHeight: 1.4 }}>
                {metaDescription || summary || 'Your meta description snippet will appear here on Google.'}
              </div>
            </div>

            {/* SEO Completeness Checklist */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              {seoChecklist.map((c) => (
                <div
                  key={c.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    fontSize: '0.76rem',
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
        </div>

        {/* Right Column: Publishing Sidebar Settings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Publishing Controls Card */}
          <div className={styles.tableCard}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.85rem' }}>
              Publishing Status
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                  Current Status
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
                  <option value="DRAFT">Draft</option>
                  <option value="PENDING_REVIEW">Pending Review</option>
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="ARCHIVED">Archived</option>
                </select>
              </div>

              {/* Scheduled Date Picker */}
              {status === 'SCHEDULED' && (
                <div>
                  <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                    Scheduled Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.55rem 0.75rem',
                      borderRadius: 8,
                      border: '1px solid #e2e8f0',
                      fontSize: '0.8rem',
                      marginTop: '0.25rem',
                    }}
                  />
                  <span style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.2rem', display: 'block' }}>
                    Article will automatically publish at this time.
                  </span>
                </div>
              )}

              {/* Published timestamp if already published */}
              {publishedAt && (
                <div style={{ fontSize: '0.74rem', color: '#059669', background: '#ecfdf5', padding: '0.45rem', borderRadius: 8 }}>
                  Published on: {new Date(publishedAt).toLocaleString()}
                </div>
              )}

              <button
                type="button"
                onClick={() => handleSave()}
                disabled={saving}
                className={styles.primaryBtn}
                style={{ width: '100%', marginTop: '0.35rem', textAlign: 'center' }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Featured Image Card */}
          <div className={styles.tableCard}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.85rem' }}>
              Featured Cover Image
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {featuredImage ? (
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: 140,
                    borderRadius: 8,
                    overflow: 'hidden',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <img
                    src={featuredImage}
                    alt={imageAlt || 'Featured image preview'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <button
                    type="button"
                    onClick={() => setFeaturedImage('')}
                    style={{
                      position: 'absolute',
                      top: 6,
                      right: 6,
                      background: 'rgba(0,0,0,0.6)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 4,
                      padding: '2px 6px',
                      fontSize: '0.7rem',
                      cursor: 'pointer',
                    }}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    height: 100,
                    borderRadius: 8,
                    background: '#f8fafc',
                    border: '1px dashed #cbd5e1',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#94a3b8',
                    gap: '0.35rem',
                  }}
                >
                  <ImageIcon size={22} />
                  <span style={{ fontSize: '0.74rem' }}>No cover image set</span>
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
                    padding: '0.45rem 0.65rem',
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                    fontSize: '0.78rem',
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
                  placeholder="Descriptive alt text for Google Images"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.45rem 0.65rem',
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                    fontSize: '0.78rem',
                    marginTop: '0.2rem',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Author & Category Selection Card */}
          <div className={styles.tableCard}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.85rem' }}>
              Author & Category
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                  Category
                </label>
                <select
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                    fontSize: '0.82rem',
                    background: '#fff',
                    marginTop: '0.2rem',
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

              <div>
                <label style={{ fontSize: '0.72rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                  Author
                </label>
                <select
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.5rem 0.75rem',
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                    fontSize: '0.82rem',
                    background: '#fff',
                    marginTop: '0.2rem',
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

          {/* Revision History Card (if editing) */}
          {revisions && revisions.length > 0 && (
            <div className={styles.tableCard}>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.65rem' }}>
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
