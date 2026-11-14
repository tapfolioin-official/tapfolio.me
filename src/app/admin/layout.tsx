'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Activity,
  Users,
  Layers,
  BarChart3,
  DollarSign,
  Headphones,
  AlertTriangle,
  Megaphone,
  FileText,
  ShieldCheck,
  Briefcase,
  Settings,
  Terminal,
  ExternalLink,
  RefreshCw,
  Search,
  Bell,
  Sparkles,
} from 'lucide-react';
import styles from './admin.module.css';

interface NavItem {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  href: string;
  badge?: string;
}

interface NavSection {
  label: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    label: 'Overview',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
      { icon: Activity, label: 'Live Activity', href: '/admin/live' },
    ],
  },
  {
    label: 'Community & Profiles',
    items: [
      { icon: Users, label: 'User Directory', href: '/admin/users' },
      { icon: Layers, label: 'Portfolios', href: '/admin/portfolios' },
    ],
  },
  {
    label: 'Metrics & Revenue',
    items: [
      { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
      { icon: DollarSign, label: 'Revenue & Plans', href: '/admin/revenue' },
    ],
  },
  {
    label: 'Communications',
    items: [
      { icon: Headphones, label: 'Support Desk', href: '/admin/support' },
      { icon: AlertTriangle, label: 'System Reports', href: '/admin/reports' },
      { icon: Megaphone, label: 'Broadcasts', href: '/admin/broadcast' },
    ],
  },
  {
    label: 'Platform Core',
    items: [
      { icon: ShieldCheck, label: 'Security & Threats', href: '/admin/security', badge: 'LIVE' },
      { icon: FileText, label: 'Audit Logs', href: '/admin/logs' },
      { icon: Briefcase, label: 'Careers & Team', href: '/admin/careers' },
      { icon: Settings, label: 'Settings', href: '/admin/settings' },
    ],
  },
  {
    label: 'Engineering',
    items: [
      { icon: Terminal, label: 'Control Center', href: '/admin/control-center' },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Developer Control Center pages have their own layout — don't wrap them
  const devRoutes = ['/admin/control-center', '/admin/connections', '/admin/releases'];
  const isDevRoute = devRoutes.some((r) => pathname === r || pathname.startsWith(r + '/'));
  if (isDevRoute) {
    return <>{children}</>;
  }

  const handleRefresh = () => {
    setIsRefreshing(true);
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <div className={styles.layout}>
      {/* Sidebar Shell */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/admin/dashboard" className={styles.brand}>
            <div className={styles.brandLogo}>
              <Sparkles size={16} />
            </div>
            <div className={styles.brandText}>
              <span className={styles.brandTitle}>Tapfolio</span>
              <span className={styles.brandSub}>Administration</span>
            </div>
          </Link>
          <span className={styles.brandBadge}>OS 2.4</span>
        </div>

        {/* Navigation Sections */}
        <nav className={styles.sidebarNav}>
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className={styles.navSection}>
              <div className={styles.navSectionLabel}>{section.label}</div>
              {section.items.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href + '/'));
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={isActive ? styles.navItemActive : styles.navItem}
                  >
                    <span className={styles.navIcon}>
                      <IconComponent size={17} />
                    </span>
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className={styles.navBadge}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer: Authenticated Admin Profile Card */}
        <div className={styles.sidebarFooter}>
          <div className={styles.adminProfileCard}>
            <div className={styles.adminAvatar}>NH</div>
            <div className={styles.adminInfo}>
              <div className={styles.adminName}>Nibrasul Haqq</div>
              <div className={styles.adminRole}>
                <span className={styles.onlineDot} />
                SUPER ADMIN
              </div>
            </div>
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.topbarBtn}
              style={{ width: 28, height: 28, padding: 0 }}
              title="Open public website"
            >
              <ExternalLink size={13} />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={styles.main}>
        {/* Topbar */}
        <header className={styles.topbar}>
          {/* Quick Search */}
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>
              <Search size={15} />
            </span>
            <input
              className={styles.searchInput}
              placeholder="Search users, portfolios, tickets..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className={styles.shortcutBadge}>⌘K</span>
          </div>

          {/* Topbar Right Section */}
          <div className={styles.topbarRight}>
            {/* System Health Status */}
            <div className={styles.healthBadge}>
              <span className={styles.healthDot} />
              <span>Core Systems Operational</span>
            </div>

            {/* Quick Action Buttons */}
            <div className={styles.topbarActions}>
              <button
                onClick={handleRefresh}
                className={styles.topbarBtn}
                title="Reload Page"
              >
                <RefreshCw size={15} className={isRefreshing ? 'animate-spin' : ''} />
              </button>

              <Link
                href="/admin/security"
                className={styles.topbarBtn}
                title="Security & Threat Defense"
              >
                <ShieldCheck size={15} />
                <span className={styles.btnDot} />
              </Link>

              <button
                className={styles.topbarBtn}
                title="Notifications"
                onClick={() => alert('No unread admin alerts.')}
              >
                <Bell size={15} />
              </button>

              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.topbarBtn}
                title="Open Public Website (tapfolio.me)"
              >
                <ExternalLink size={15} />
              </Link>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
}
