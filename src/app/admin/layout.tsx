'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  RefreshCw,
  Sparkles,
  ShieldCheck,
  Bell,
  Menu,
  X,
  ArrowRight,
} from 'lucide-react';
import {
  NAV_SECTIONS,
  ALL_NAV_ITEMS,
  getActiveNavItem,
  isNavItemActive,
  getActiveSection,
  NavItem,
} from '@/lib/admin-navigation';
import styles from './admin.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userCollapsed, setUserCollapsed] = useState<Record<string, boolean>>({});
  const searchRef = useRef<HTMLDivElement>(null);

  // Determine the single active leaf item and active parent section
  const activeItem = useMemo(() => getActiveNavItem(pathname), [pathname]);
  const activeSection = useMemo(() => getActiveSection(pathname), [pathname]);

  // Close mobile drawer on route transition
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // Close search dropdown on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const input = document.getElementById('admin-quick-search') as HTMLInputElement | null;
        if (input) {
          input.focus();
          setSearchOpen(true);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleSection = (id: string) => {
    setUserCollapsed((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  // Filter navigation items for topbar command palette
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return ALL_NAV_ITEMS.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.sectionLabel.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q))
    ).slice(0, 8);
  }, [searchQuery]);

  return (
    <div className={styles.layout}>
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className={styles.mobileBackdrop}
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ─── Master Sidebar ─── */}
      <aside
        className={`${styles.sidebar} ${mobileOpen ? styles.sidebarOpen : ''}`}
        aria-label="Admin Navigation"
      >
        {/* Header / Brand */}
        <div className={styles.sidebarHeader}>
          <Link href="/admin/dashboard" className={styles.brand} onClick={() => setMobileOpen(false)}>
            <div className={styles.brandLogo}>
              <Sparkles size={20} />
            </div>
            <div className={styles.brandText}>
              <span className={styles.brandTitle}>Tapfolio</span>
              <span className={styles.brandSub}>Admin Panel</span>
            </div>
          </Link>
          {mobileOpen && (
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className={styles.topbarBtn}
              aria-label="Close navigation"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Navigation Sections */}
        <nav className={styles.sidebarNav} role="navigation">
          {NAV_SECTIONS.map((section) => {
            // A section is expanded if:
            // 1. It contains the active route (ensuring active item is visible), UNLESS user explicitly collapsed it.
            // 2. Default is open (userCollapsed[section.id] !== true).
            const isCollapsed = Boolean(userCollapsed[section.id]);

            return (
              <div key={section.id} className={styles.navSection}>
                <button
                  type="button"
                  className={styles.navSectionHeader}
                  onClick={() => toggleSection(section.id)}
                  aria-expanded={!isCollapsed}
                  style={{ width: '100%', background: 'transparent', border: 'none', textAlign: 'left' }}
                >
                  <span className={styles.navSectionLabel}>{section.label}</span>
                  <span className={styles.navSectionToggle}>
                    {isCollapsed ? <ChevronRight size={13} /> : <ChevronDown size={13} />}
                  </span>
                </button>

                {!isCollapsed && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.15rem',
                      marginTop: '0.2rem',
                    }}
                  >
                    {section.items.map((item) => {
                      const isActive = isNavItemActive(item, activeItem);
                      const IconComponent = item.icon;

                      return (
                        <Link
                          key={item.id}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={isActive ? styles.navItemActive : styles.navItem}
                          aria-current={isActive ? 'page' : undefined}
                        >
                          <span className={styles.navIcon}>
                            <IconComponent size={16} />
                          </span>
                          <span>{item.label}</span>
                          {item.badge && (
                            <span className={styles.navBadge}>{item.badge}</span>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Sidebar Footer: Tapfolio Pro Promo Card */}
        <div className={styles.sidebarFooter}>
          <div className={styles.proCard}>
            <div className={styles.proTitle}>Tapfolio Pro</div>
            <div className={styles.proDesc}>
              Unlock enterprise analytics, custom NFC themes and auto SEO tools.
            </div>
            <button
              className={styles.proBtn}
              onClick={() => alert('Tapfolio Enterprise is active.')}
            >
              Active Enterprise
            </button>
          </div>
        </div>
      </aside>

      {/* ─── Main Content Canvas ─── */}
      <main className={styles.main}>
        {/* Topbar */}
        <header className={styles.topbar}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              className={styles.mobileMenuBtn}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation drawer"
            >
              <Menu size={18} />
            </button>

            {/* Quick Search Palette */}
            <div className={styles.searchBoxWrapper} ref={searchRef}>
              <div className={styles.searchBox}>
                <span className={styles.searchIcon}>
                  <Search size={15} />
                </span>
                <input
                  id="admin-quick-search"
                  className={styles.searchInput}
                  placeholder="Search users, portfolios, or anything..."
                  type="text"
                  value={searchQuery}
                  onFocus={() => setSearchOpen(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSearchOpen(true);
                  }}
                />
                <span className={styles.shortcutBadge}>⌘K</span>
              </div>

              {/* Instant Search Results Dropdown */}
              {searchOpen && searchResults.length > 0 && (
                <div className={styles.searchDropdown}>
                  <div
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      color: '#94a3b8',
                      textTransform: 'uppercase',
                      padding: '0.4rem 0.75rem',
                      letterSpacing: '0.06em',
                    }}
                  >
                    Quick Navigation
                  </div>
                  {searchResults.map((result) => {
                    const ResultIcon = result.icon;
                    return (
                      <Link
                        key={result.id}
                        href={result.href}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery('');
                        }}
                        className={styles.searchResultItem}
                      >
                        <ResultIcon size={16} />
                        <span style={{ fontWeight: 600 }}>{result.label}</span>
                        <span className={styles.searchResultSection}>{result.sectionLabel}</span>
                        <ArrowRight size={13} style={{ color: '#94a3b8', marginLeft: 4 }} />
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Header Section */}
          <div className={styles.topbarRight}>
            {/* Real-time Status Indicator */}
            <div className={styles.healthBadge}>
              <span className={styles.healthDot} />
              <span>System Online</span>
            </div>

            {/* Quick Actions */}
            <div className={styles.topbarActions}>
              <button
                type="button"
                onClick={handleRefresh}
                className={styles.topbarBtn}
                title="Refresh Platform"
                aria-label="Refresh Platform"
              >
                <RefreshCw size={15} />
              </button>

              <Link
                href="/admin/security"
                className={styles.topbarBtn}
                title="Security & Threat Center"
                aria-label="Security & Threat Center"
              >
                <ShieldCheck size={15} />
                <span className={styles.btnDot} />
              </Link>

              <button
                type="button"
                className={styles.topbarBtn}
                title="Notifications"
                aria-label="Notifications"
                onClick={() => alert('3 unread system alerts.')}
              >
                <Bell size={15} />
                <span className={styles.btnBadgeNumber}>3</span>
              </button>

              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.topbarBtn}
                title="Open Public Website (tapfolio.me)"
                aria-label="Open Public Website"
              >
                <ExternalLink size={15} />
              </Link>
            </div>

            {/* Admin User Menu */}
            <div className={styles.userMenuPill}>
              <div className={styles.userAvatar}>N</div>
              <span className={styles.userName}>Nibras</span>
              <ChevronDown size={14} className="text-slate-400" />
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
}
