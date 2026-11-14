'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Activity,
  Users,
  Layers,
  Radio,
  Smartphone,
  Globe,
  Target,
  UserPlus,
  Contact,
  Building2,
  GitPullRequest,
  Briefcase,
  CheckSquare,
  Megaphone,
  History,
  Search,
  FileText,
  AppWindow,
  KeyRound,
  TrendingUp,
  CheckCheck,
  Link2,
  FolderGit2,
  Network,
  CornerDownRight,
  BarChart3,
  Gauge,
  LineChart,
  MousePointerClick,
  TabletSmartphone,
  DollarSign,
  CreditCard,
  Percent,
  Headphones,
  AlertTriangle,
  Bell,
  Mail,
  ScrollText,
  ShieldCheck,
  Cpu,
  Lock,
  Settings,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import styles from './admin.module.css';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string;
}

interface NavSection {
  id: string;
  label: string;
  items: NavItem[];
}

const NAV_SECTIONS: NavSection[] = [
  {
    id: 'overview',
    label: 'Overview',
    items: [
      { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      { label: 'Live Activity', href: '/admin/live', icon: Activity },
    ],
  },
  {
    id: 'platform',
    label: 'Platform Management',
    items: [
      { label: 'User Management', href: '/admin/users', icon: Users },
      { label: 'Portfolio Management', href: '/admin/portfolios', icon: Layers },
      { label: 'NFC Management', href: '/admin/nfc', icon: Radio },
      { label: 'Mobile App Management', href: '/admin/mobile-app', icon: Smartphone },
      { label: 'Website Management', href: '/admin/website', icon: Globe },
    ],
  },
  {
    id: 'crm',
    label: 'CRM',
    items: [
      { label: 'CRM Dashboard', href: '/admin/crm', icon: Target, badge: 'New' },
      { label: 'Leads', href: '/admin/crm/leads', icon: UserPlus },
      { label: 'Contacts', href: '/admin/crm/contacts', icon: Contact },
      { label: 'Companies', href: '/admin/crm/companies', icon: Building2 },
      { label: 'Pipelines', href: '/admin/crm/pipelines', icon: GitPullRequest },
      { label: 'Deals', href: '/admin/crm/deals', icon: Briefcase },
      { label: 'Tasks & Follow-ups', href: '/admin/crm/tasks', icon: CheckSquare },
      { label: 'Campaigns', href: '/admin/crm/campaigns', icon: Megaphone },
      { label: 'Communication History', href: '/admin/crm/communications', icon: History },
    ],
  },
  {
    id: 'seo',
    label: 'SEO & Marketing',
    items: [
      { label: 'SEO Dashboard', href: '/admin/seo', icon: Search },
      { label: 'Website SEO', href: '/admin/seo/website', icon: FileText },
      { label: 'App SEO & Store', href: '/admin/seo/app', icon: AppWindow },
      { label: 'Keyword Research', href: '/admin/seo/keywords', icon: KeyRound },
      { label: 'Rank Tracking', href: '/admin/seo/rankings', icon: TrendingUp },
      { label: 'Technical SEO Audit', href: '/admin/seo/audit', icon: CheckCheck },
      { label: 'Backlink Management', href: '/admin/seo/backlinks', icon: Link2 },
      { label: 'Content Management', href: '/admin/seo/content', icon: FolderGit2 },
      { label: 'Sitemap Management', href: '/admin/seo/sitemap', icon: Network },
      { label: 'Redirect Manager', href: '/admin/seo/redirects', icon: CornerDownRight },
      { label: 'Search Console', href: '/admin/seo/search-console', icon: BarChart3 },
      { label: 'Performance Monitoring', href: '/admin/seo/performance', icon: Gauge },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics & Business',
    items: [
      { label: 'Platform Analytics', href: '/admin/analytics', icon: LineChart },
      { label: 'Website Analytics', href: '/admin/analytics/website', icon: MousePointerClick },
      { label: 'App Analytics', href: '/admin/analytics/app', icon: TabletSmartphone },
      { label: 'Revenue', href: '/admin/revenue', icon: DollarSign },
      { label: 'Subscriptions', href: '/admin/subscriptions', icon: CreditCard },
      { label: 'Conversion Analytics', href: '/admin/analytics/conversions', icon: Percent },
    ],
  },
  {
    id: 'communication',
    label: 'Communication',
    items: [
      { label: 'Support Tickets', href: '/admin/support', icon: Headphones },
      { label: 'Reviews & Complaints', href: '/admin/reports', icon: AlertTriangle },
      { label: 'Notifications', href: '/admin/notifications', icon: Bell },
      { label: 'Broadcast Centre', href: '/admin/broadcast', icon: Radio },
      { label: 'Email Campaigns', href: '/admin/campaigns', icon: Mail },
    ],
  },
  {
    id: 'system',
    label: 'System',
    items: [
      { label: 'Activity Logs', href: '/admin/logs', icon: ScrollText },
      { label: 'Security', href: '/admin/security', icon: ShieldCheck },
      { label: 'API Integrations', href: '/admin/integrations', icon: Cpu },
      { label: 'Admin Roles & Permissions', href: '/admin/roles', icon: Lock },
      { label: 'Settings', href: '/admin/settings', icon: Settings },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (id: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className={styles.layout}>
      {/* ─── Sidebar ─── */}
      <aside className={styles.sidebar}>
        {/* Header / Brand */}
        <div className={styles.sidebarHeader}>
          <Link href="/admin/dashboard" className={styles.brand}>
            <div className={styles.brandLogo}>
              <Sparkles size={20} />
            </div>
            <div className={styles.brandText}>
              <span className={styles.brandTitle}>Tapfolio</span>
              <span className={styles.brandSub}>Admin Panel</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className={styles.sidebarNav}>
          {NAV_SECTIONS.map((section) => {
            const isCollapsed = collapsedSections[section.id];
            return (
              <div key={section.id} className={styles.navSection}>
                <div
                  className={styles.navSectionHeader}
                  onClick={() => toggleSection(section.id)}
                >
                  <span className={styles.navSectionLabel}>{section.label}</span>
                  <span className={styles.navSectionToggle}>
                    {isCollapsed ? <ChevronRight size={13} /> : <ChevronDown size={13} />}
                  </span>
                </div>

                {!isCollapsed && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem', marginTop: '0.2rem' }}>
                    {section.items.map((item) => {
                      const isActive =
                        pathname === item.href ||
                        (item.href !== '/admin' &&
                          item.href !== '/admin/dashboard' &&
                          pathname.startsWith(item.href));
                      const IconComponent = item.icon;

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={isActive ? styles.navItemActive : styles.navItem}
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
            <button className={styles.proBtn} onClick={() => alert('Tapfolio Enterprise is active.')}>
              Active Enterprise
            </button>
          </div>
        </div>
      </aside>

      {/* ─── Main Content Canvas ─── */}
      <main className={styles.main}>
        {/* Topbar */}
        <header className={styles.topbar}>
          {/* Search Box */}
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>
              <Search size={15} />
            </span>
            <input
              className={styles.searchInput}
              placeholder="Search users, portfolios, or anything..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className={styles.shortcutBadge}>⌘K</span>
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
                onClick={handleRefresh}
                className={styles.topbarBtn}
                title="Refresh Platform"
              >
                <RefreshCw size={15} />
              </button>

              <Link
                href="/admin/security"
                className={styles.topbarBtn}
                title="Security & Threat Center"
              >
                <ShieldCheck size={15} />
                <span className={styles.btnDot} />
              </Link>

              <button
                className={styles.topbarBtn}
                title="Notifications"
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
