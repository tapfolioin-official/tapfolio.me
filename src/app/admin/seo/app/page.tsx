'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  AppWindow,
  Smartphone,
  Save,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Layers,
  Star,
  Download,
  Share2,
  Copy,
  Check,
  Globe,
  Radio,
  FileCode,
  Sparkles,
} from 'lucide-react';
import styles from '../../dashboard/dashboard.module.css';

interface AppStoreData {
  platform: 'ios' | 'android';
  appName: string;
  subtitle: string;
  bundleId: string;
  primaryCategory: string;
  secondaryCategory: string;
  keywords: string;
  shortDescription: string;
  fullDescription: string;
  promotionalText: string;
  privacyPolicyUrl: string;
  supportUrl: string;
  marketingUrl: string;
  ratingScore: number;
  totalRatings: number;
  universalLinksDomain: string;
  customScheme: string;
  smartBannerEnabled: boolean;
  appStoreId: string;
}

export default function AppSeoPage() {
  const [activeTab, setActiveTab] = useState<'ios' | 'android' | 'deeplinks'>('ios');
  const [formData, setFormData] = useState<AppStoreData>({
    platform: 'ios',
    appName: 'Tapfolio: Smart NFC Business',
    subtitle: 'Digital Cards & Portfolios',
    bundleId: 'com.tapfolio.app',
    primaryCategory: 'Business',
    secondaryCategory: 'Productivity',
    keywords: 'nfc business card,digital portfolio,smart contact,networking,vcard,contactless card,tapfolio',
    shortDescription: 'Instant contactless networking and personal portfolio operating system powered by NFC.',
    fullDescription: 'Tapfolio is the revolutionary smart digital networking operating system.\n\nShare your professional identity with a single tap of an NFC card or dynamic QR code.',
    promotionalText: 'Upgrade your networking with instant NFC tap-to-share and real-time portfolio analytics.',
    privacyPolicyUrl: 'https://tapfolio.me/privacy',
    supportUrl: 'https://tapfolio.me/support',
    marketingUrl: 'https://tapfolio.me',
    ratingScore: 4.9,
    totalRatings: 1240,
    universalLinksDomain: 'tapfolio.me',
    customScheme: 'tapfolio://',
    smartBannerEnabled: true,
    appStoreId: '6478901234',
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);

  // Fetch App Store SEO for active platform
  const loadPlatformData = async (platform: 'ios' | 'android') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/seo/app?platform=${platform}`);
      const json = await res.json();
      if (json.success && json.data) {
        setFormData(json.data);
      }
    } catch (e) {
      console.error('Failed to load App Store SEO:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'ios' || activeTab === 'android') {
      loadPlatformData(activeTab);
    }
  }, [activeTab]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const res = await fetch('/api/admin/seo/app', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const json = await res.json();
      if (json.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (e) {
      console.error('Failed to save App Store SEO:', e);
    } finally {
      setSaving(false);
    }
  };

  const handleCopySnippet = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className={styles.page}>
      {/* Page Header */}
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>App SEO & Store Optimization (ASO)</h1>
          <p className={styles.subtitle}>
            Manage iOS App Store & Google Play metadata, keyword density, ASO rankings, and Universal Deep Links
          </p>
        </div>
        <div className={styles.headerRight}>
          {success && (
            <span
              style={{
                fontSize: '0.8rem',
                fontWeight: 750,
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                background: '#ecfdf5',
                padding: '0.4rem 0.75rem',
                borderRadius: 8,
              }}
            >
              <CheckCircle2 size={16} /> Saved Successfully
            </span>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className={styles.primaryBtn}
            style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <Save size={16} />
            {saving ? 'Syncing...' : 'Save & Publish ASO'}
          </button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.6rem',
          borderBottom: '1px solid #e2e8f0',
          paddingBottom: '0.75rem',
          marginBottom: '1.5rem',
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab('ios')}
          style={{
            padding: '0.55rem 1.1rem',
            borderRadius: 10,
            border: activeTab === 'ios' ? '1px solid #0052ff' : '1px solid #e2e8f0',
            background: activeTab === 'ios' ? '#0052ff' : '#ffffff',
            color: activeTab === 'ios' ? '#ffffff' : '#475569',
            fontSize: '0.85rem',
            fontWeight: 750,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: activeTab === 'ios' ? '0 2px 8px rgba(0, 82, 255, 0.25)' : 'none',
          }}
        >
          <Smartphone size={16} /> Apple App Store (iOS)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('android')}
          style={{
            padding: '0.55rem 1.1rem',
            borderRadius: 10,
            border: activeTab === 'android' ? '1px solid #0052ff' : '1px solid #e2e8f0',
            background: activeTab === 'android' ? '#0052ff' : '#ffffff',
            color: activeTab === 'android' ? '#ffffff' : '#475569',
            fontSize: '0.85rem',
            fontWeight: 750,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: activeTab === 'android' ? '0 2px 8px rgba(0, 82, 255, 0.25)' : 'none',
          }}
        >
          <AppWindow size={16} /> Google Play Store (Android)
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('deeplinks')}
          style={{
            padding: '0.55rem 1.1rem',
            borderRadius: 10,
            border: activeTab === 'deeplinks' ? '1px solid #0052ff' : '1px solid #e2e8f0',
            background: activeTab === 'deeplinks' ? '#0052ff' : '#ffffff',
            color: activeTab === 'deeplinks' ? '#ffffff' : '#475569',
            fontSize: '0.85rem',
            fontWeight: 750,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            boxShadow: activeTab === 'deeplinks' ? '0 2px 8px rgba(0, 82, 255, 0.25)' : 'none',
          }}
        >
          <Globe size={16} /> Universal Links & Deep Linking
        </button>
      </div>

      {/* ASO Performance Score Banner */}
      <div
        className={styles.panelCard}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1rem',
          padding: '1.25rem',
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8faff 100%)',
          border: '1px solid #e0e7ff',
        }}
      >
        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
            Store Listing Score
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0052ff', marginTop: '0.2rem' }}>
            94 <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>/ 100</span>
          </div>
          <div style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700, marginTop: '0.2rem' }}>
            Top 5% in Business Category
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
            Keyword Visibility
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a', marginTop: '0.2rem' }}>
            #3 <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>avg rank</span>
          </div>
          <div style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700, marginTop: '0.2rem' }}>
            Ranked for 42 target keywords
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
            Conversion Rate (View to Install)
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a', marginTop: '0.2rem' }}>
            34.2%
          </div>
          <div style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700, marginTop: '0.2rem' }}>
            +6.4% vs industry benchmark (27.8%)
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>
            Store Rating
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0f172a', marginTop: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            {formData.ratingScore} <Star size={18} fill="#f59e0b" color="#f59e0b" />
          </div>
          <div style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 600, marginTop: '0.2rem' }}>
            Based on {formData.totalRatings.toLocaleString()} verified reviews
          </div>
        </div>
      </div>

      {activeTab === 'deeplinks' ? (
        /* Universal Links & Deep Linking Config */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className={styles.panelCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                  Apple App Site Association (AASA)
                </h2>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
                  Enables seamless iOS Universal Links opening directly into Tapfolio app from Safari and iMessage
                </p>
              </div>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: '#059669',
                  background: '#ecfdf5',
                  padding: '0.3rem 0.65rem',
                  borderRadius: 6,
                }}
              >
                ACTIVE: /.well-known/apple-app-site-association
              </span>
            </div>

            <pre
              style={{
                background: '#0f172a',
                color: '#38bdf8',
                padding: '1rem',
                borderRadius: 10,
                fontSize: '0.78rem',
                overflowX: 'auto',
                fontFamily: 'monospace',
                lineHeight: 1.5,
              }}
            >{JSON.stringify(
              {
                applinks: {
                  apps: [],
                  details: [
                    {
                      appID: 'TEAMID.com.tapfolio.app',
                      paths: ['/card/*', '/p/*', '/portfolio/*', '/@*'],
                    },
                  ],
                },
                webcredentials: {
                  apps: ['TEAMID.com.tapfolio.app'],
                },
              },
              null,
              2
            )}</pre>
          </div>

          <div className={styles.panelCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                  Android Digital Asset Links
                </h2>
                <p style={{ fontSize: '0.8rem', color: '#64748b', margin: '0.25rem 0 0 0' }}>
                  Verified App Links for Android 12+ without browser disambiguation dialog
                </p>
              </div>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  color: '#059669',
                  background: '#ecfdf5',
                  padding: '0.3rem 0.65rem',
                  borderRadius: 6,
                }}
              >
                ACTIVE: /.well-known/assetlinks.json
              </span>
            </div>

            <pre
              style={{
                background: '#0f172a',
                color: '#4ade80',
                padding: '1rem',
                borderRadius: 10,
                fontSize: '0.78rem',
                overflowX: 'auto',
                fontFamily: 'monospace',
                lineHeight: 1.5,
              }}
            >{JSON.stringify(
              [
                {
                  relation: ['delegate_permission/common.handle_all_urls'],
                  target: {
                    namespace: 'android_app',
                    package_name: 'com.tapfolio.app',
                    sha256_cert_fingerprints: [
                      '14:6D:E9:7D:0F:52:CC:E5:43:7E:0E:3B:4F:80:35:FF:45:20:0C:0A:72:4F:33:AE:B8:52:14:E6:FF:89:C3:01',
                    ],
                  },
                },
              ],
              null,
              2
            )}</pre>
          </div>

          <div className={styles.panelCard}>
            <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 0.5rem 0', color: '#0f172a' }}>
              Mobile Web Smart App Banner
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>
              Displays the native Safari and Chrome app install banner when visitors view Tapfolio cards on mobile browsers
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <input
                type="checkbox"
                id="smartBanner"
                checked={formData.smartBannerEnabled}
                onChange={(e) => setFormData({ ...formData, smartBannerEnabled: e.target.checked })}
                style={{ width: 18, height: 18, accentColor: '#0052ff' }}
              />
              <label htmlFor="smartBanner" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                Enable Smart App Banner in HTML &lt;head&gt;
              </label>
            </div>

            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                padding: '0.75rem 1rem',
                borderRadius: 8,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <code style={{ fontSize: '0.8rem', color: '#0052ff' }}>
                &lt;meta name="apple-itunes-app" content="app-id=6478901234, app-argument=https://tapfolio.me" /&gt;
              </code>
              <button
                type="button"
                onClick={() =>
                  handleCopySnippet(
                    '<meta name="apple-itunes-app" content="app-id=6478901234, app-argument=https://tapfolio.me" />'
                  )
                }
                style={{
                  background: 'none',
                  border: '1px solid #cbd5e1',
                  borderRadius: 6,
                  padding: '0.35rem 0.65rem',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                }}
              >
                {copiedSnippet ? <Check size={14} color="#059669" /> : <Copy size={14} />}
                {copiedSnippet ? 'Copied' : 'Copy Tag'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Form + Live Mockup Grid */
        <div style={{ display: 'grid', gridTemplateColumns: '1.25fr 1fr', gap: '1.5rem' }}>
          {/* Form */}
          <div className={styles.panelCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0 }}>
                {activeTab === 'ios' ? 'App Store Connect Metadata' : 'Google Play Store Listing'}
              </h2>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>
                Bundle ID: <code style={{ color: '#0052ff' }}>{formData.bundleId}</code>
              </span>
            </div>

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
              {/* App Name */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                    App Name ({formData.appName.length}/30 characters)
                  </label>
                  {formData.appName.length > 30 && (
                    <span style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: 700 }}>
                      Exceeds 30-char limit!
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  required
                  value={formData.appName}
                  onChange={(e) => setFormData({ ...formData, appName: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 10,
                    border: formData.appName.length > 30 ? '1px solid #ef4444' : '1px solid #e2e8f0',
                    fontSize: '0.88rem',
                    fontWeight: 600,
                  }}
                />
              </div>

              {/* Subtitle / Short Description */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                    {activeTab === 'ios' ? 'App Subtitle (30 chars max)' : 'Short Description (80 chars max)'}
                  </label>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                    {activeTab === 'ios' ? `${formData.subtitle.length}/30` : `${formData.shortDescription.length}/80`}
                  </span>
                </div>
                {activeTab === 'ios' ? (
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 10,
                      border: '1px solid #e2e8f0',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                    }}
                  />
                ) : (
                  <input
                    type="text"
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 10,
                      border: '1px solid #e2e8f0',
                      fontSize: '0.88rem',
                      fontWeight: 600,
                    }}
                  />
                )}
              </div>

              {/* Keywords Field */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                    ASO Keywords ({formData.keywords.length}/100 chars comma-separated)
                  </label>
                  <span style={{ fontSize: '0.7rem', color: formData.keywords.length > 100 ? '#ef4444' : '#94a3b8' }}>
                    {formData.keywords.length}/100
                  </span>
                </div>
                <input
                  type="text"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 10,
                    border: formData.keywords.length > 100 ? '1px solid #ef4444' : '1px solid #e2e8f0',
                    fontSize: '0.85rem',
                  }}
                />
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.45rem' }}>
                  {formData.keywords.split(',').map((kw, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        background: '#edf3ff',
                        color: '#0052ff',
                        padding: '0.2rem 0.55rem',
                        borderRadius: 6,
                      }}
                    >
                      #{kw.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Promotional Text */}
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                  Promotional Text ({formData.promotionalText.length}/170 chars)
                </label>
                <input
                  type="text"
                  value={formData.promotionalText}
                  onChange={(e) => setFormData({ ...formData, promotionalText: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 10,
                    border: '1px solid #e2e8f0',
                    marginTop: '0.3rem',
                    fontSize: '0.85rem',
                  }}
                />
              </div>

              {/* Full Description */}
              <div>
                <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                  Full Description (Markdown & Bullet points supported)
                </label>
                <textarea
                  rows={6}
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 10,
                    border: '1px solid #e2e8f0',
                    marginTop: '0.3rem',
                    fontSize: '0.82rem',
                    lineHeight: 1.5,
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              {/* Categories */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                    Primary Category
                  </label>
                  <select
                    value={formData.primaryCategory}
                    onChange={(e) => setFormData({ ...formData, primaryCategory: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: 10,
                      border: '1px solid #e2e8f0',
                      marginTop: '0.3rem',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      background: '#ffffff',
                    }}
                  >
                    <option value="Business">Business</option>
                    <option value="Productivity">Productivity</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Social Networking">Social Networking</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase' }}>
                    Secondary Category
                  </label>
                  <select
                    value={formData.secondaryCategory}
                    onChange={(e) => setFormData({ ...formData, secondaryCategory: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: 10,
                      border: '1px solid #e2e8f0',
                      marginTop: '0.3rem',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      background: '#ffffff',
                    }}
                  >
                    <option value="Productivity">Productivity</option>
                    <option value="Tools">Tools</option>
                    <option value="Business">Business</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
              </div>
            </form>
          </div>

          {/* Right Column: Live App Store Mockup */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div className={styles.panelCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0 }}>
                  {activeTab === 'ios' ? 'Apple App Store Live Preview' : 'Google Play Live Preview'}
                </h3>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    color: '#0052ff',
                    background: '#edf3ff',
                    padding: '0.25rem 0.6rem',
                    borderRadius: 6,
                  }}
                >
                  iOS 18 / Android 15
                </span>
              </div>

              {/* Realistic Mobile Store Card */}
              <div
                style={{
                  background: activeTab === 'ios' ? '#f8fafc' : '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 16,
                  padding: '1.25rem',
                  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)',
                }}
              >
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  {/* App Icon */}
                  <div
                    style={{
                      width: 68,
                      height: 68,
                      borderRadius: activeTab === 'ios' ? 16 : 14,
                      background: 'linear-gradient(135deg, #0052FF 0%, #002B99 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      boxShadow: '0 4px 12px rgba(0, 82, 255, 0.35)',
                      flexShrink: 0,
                    }}
                  >
                    <Sparkles size={32} />
                  </div>

                  {/* App Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '1.05rem', fontWeight: 850, color: '#0f172a', lineHeight: 1.25 }}>
                      {formData.appName || 'Tapfolio'}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.2rem' }}>
                      {activeTab === 'ios' ? formData.subtitle : formData.shortDescription}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.65rem' }}>
                      <button
                        type="button"
                        style={{
                          background: '#0052ff',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: 20,
                          padding: '0.35rem 1.15rem',
                          fontSize: '0.78rem',
                          fontWeight: 800,
                          letterSpacing: '0.5px',
                          cursor: 'pointer',
                        }}
                      >
                        {activeTab === 'ios' ? 'GET' : 'Install'}
                      </button>
                      <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>In-App Purchases</span>
                    </div>
                  </div>
                </div>

                {/* Rating Strip */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: '1.25rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid #e2e8f0',
                    textAlign: 'center',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>RATINGS</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                      {formData.ratingScore} <Star size={14} fill="#f59e0b" color="#f59e0b" />
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{formData.totalRatings} Ratings</div>
                  </div>

                  <div style={{ width: 1, background: '#e2e8f0' }} />

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>CATEGORY</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>#3</div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{formData.primaryCategory}</div>
                  </div>

                  <div style={{ width: 1, background: '#e2e8f0' }} />

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700 }}>AGE</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>4+</div>
                    <div style={{ fontSize: '0.68rem', color: '#64748b' }}>Years Old</div>
                  </div>
                </div>

                {/* Promotional Preview */}
                <div
                  style={{
                    marginTop: '1rem',
                    padding: '0.75rem',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: 10,
                  }}
                >
                  <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#0052ff', textTransform: 'uppercase' }}>
                    What's New in Version 2.4.0
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#334155', marginTop: '0.25rem', lineHeight: 1.4 }}>
                    {formData.promotionalText}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Export / Sync Panel */}
            <div className={styles.panelCard}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: '0 0 0.85rem 0' }}>
                ASO Deployment Actions
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <button
                  type="button"
                  onClick={() => handleCopySnippet(JSON.stringify(formData, null, 2))}
                  className={styles.secondaryBtn}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                >
                  <FileCode size={15} /> Export Fastlane / App Store Deliver JSON
                </button>
                <Link
                  href="/admin/mobile-app"
                  className={styles.secondaryBtn}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', textDecoration: 'none' }}
                >
                  <Smartphone size={15} /> Open Mobile App Version & Builds Fleet
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
