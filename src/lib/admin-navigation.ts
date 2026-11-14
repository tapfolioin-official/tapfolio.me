import React from 'react';
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
} from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: string;
  aliases?: string[];
  sectionId: string;
  sectionLabel: string;
  description?: string;
}

export interface NavSection {
  id: string;
  label: string;
  items: NavItem[];
}

export const NAV_SECTIONS: NavSection[] = [
  {
    id: 'overview',
    label: 'Overview',
    items: [
      {
        id: 'overview-dashboard',
        label: 'Dashboard',
        href: '/admin/dashboard',
        icon: LayoutDashboard,
        aliases: ['/admin'],
        sectionId: 'overview',
        sectionLabel: 'Overview',
        description: 'System overview, executive metrics and operational status',
      },
      {
        id: 'overview-live',
        label: 'Live Activity',
        href: '/admin/live',
        icon: Activity,
        sectionId: 'overview',
        sectionLabel: 'Overview',
        description: 'Real-time active visitors, live sessions and device telemetry',
      },
    ],
  },
  {
    id: 'platform',
    label: 'Platform Management',
    items: [
      {
        id: 'platform-users',
        label: 'User Management',
        href: '/admin/users',
        icon: Users,
        aliases: ['/admin/users/'],
        sectionId: 'platform',
        sectionLabel: 'Platform Management',
        description: 'Directory of registered users, profiles and account roles',
      },
      {
        id: 'platform-portfolios',
        label: 'Portfolio Management',
        href: '/admin/portfolios',
        icon: Layers,
        sectionId: 'platform',
        sectionLabel: 'Platform Management',
        description: 'Live portfolios, moderation queue and showcase approvals',
      },
      {
        id: 'platform-nfc',
        label: 'NFC Management',
        href: '/admin/nfc',
        icon: Radio,
        aliases: ['/admin/connections'],
        sectionId: 'platform',
        sectionLabel: 'Platform Management',
        description: 'Smart NFC cards, physical tag inventory and card taps',
      },
      {
        id: 'platform-mobile-app',
        label: 'Mobile App Management',
        href: '/admin/mobile-app',
        icon: Smartphone,
        aliases: ['/admin/releases'],
        sectionId: 'platform',
        sectionLabel: 'Platform Management',
        description: 'Flutter build releases, APK updates and mobile telemetry',
      },
      {
        id: 'platform-website',
        label: 'Website Management',
        href: '/admin/website',
        icon: Globe,
        sectionId: 'platform',
        sectionLabel: 'Platform Management',
        description: 'Landing pages, marketing content, banners and public routes',
      },
    ],
  },
  {
    id: 'crm',
    label: 'CRM',
    items: [
      {
        id: 'crm-dashboard',
        label: 'CRM Dashboard',
        href: '/admin/crm',
        icon: Target,
        badge: 'New',
        sectionId: 'crm',
        sectionLabel: 'CRM',
        description: 'Unified lead conversion, sales pipeline and CRM metrics',
      },
      {
        id: 'crm-leads',
        label: 'Leads',
        href: '/admin/crm/leads',
        icon: UserPlus,
        sectionId: 'crm',
        sectionLabel: 'CRM',
        description: 'Website inquiries, app sign-up leads and card prospects',
      },
      {
        id: 'crm-contacts',
        label: 'Contacts',
        href: '/admin/crm/contacts',
        icon: Contact,
        sectionId: 'crm',
        sectionLabel: 'CRM',
        description: 'Consolidated address book across website and mobile app',
      },
      {
        id: 'crm-companies',
        label: 'Companies',
        href: '/admin/crm/companies',
        icon: Building2,
        sectionId: 'crm',
        sectionLabel: 'CRM',
        description: 'Corporate client accounts, enterprise teams and domains',
      },
      {
        id: 'crm-pipelines',
        label: 'Pipelines',
        href: '/admin/crm/pipelines',
        icon: GitPullRequest,
        sectionId: 'crm',
        sectionLabel: 'CRM',
        description: 'Kanban stages, opportunity progression and deal stages',
      },
      {
        id: 'crm-deals',
        label: 'Deals',
        href: '/admin/crm/deals',
        icon: Briefcase,
        sectionId: 'crm',
        sectionLabel: 'CRM',
        description: 'Commercial sales opportunities, quote estimates and contracts',
      },
      {
        id: 'crm-tasks',
        label: 'Tasks & Follow-ups',
        href: '/admin/crm/tasks',
        icon: CheckSquare,
        sectionId: 'crm',
        sectionLabel: 'CRM',
        description: 'Scheduled reminders, sales outreach tasks and calls',
      },
      {
        id: 'crm-campaigns',
        label: 'Campaigns',
        href: '/admin/crm/campaigns',
        icon: Megaphone,
        sectionId: 'crm',
        sectionLabel: 'CRM',
        description: 'Targeted customer outreach and lead generation campaigns',
      },
      {
        id: 'crm-communications',
        label: 'Communication History',
        href: '/admin/crm/communications',
        icon: History,
        sectionId: 'crm',
        sectionLabel: 'CRM',
        description: 'Call logs, sent emails, SMS and notification records',
      },
    ],
  },
  {
    id: 'seo',
    label: 'SEO & Marketing',
    items: [
      {
        id: 'seo-dashboard',
        label: 'SEO Dashboard',
        href: '/admin/seo',
        icon: Search,
        sectionId: 'seo',
        sectionLabel: 'SEO & Marketing',
        description: 'Search visibility health, keyword scores and organic traffic',
      },
      {
        id: 'seo-website',
        label: 'Website SEO',
        href: '/admin/seo/website',
        icon: FileText,
        sectionId: 'seo',
        sectionLabel: 'SEO & Marketing',
        description: 'Meta titles, OpenGraph, schema markup and canonical tags',
      },
      {
        id: 'seo-app',
        label: 'App SEO & Store',
        href: '/admin/seo/app',
        icon: AppWindow,
        sectionId: 'seo',
        sectionLabel: 'SEO & Marketing',
        description: 'App Store Optimization (ASO) and Play Store keywords',
      },
      {
        id: 'seo-keywords',
        label: 'Keyword Research',
        href: '/admin/seo/keywords',
        icon: KeyRound,
        sectionId: 'seo',
        sectionLabel: 'SEO & Marketing',
        description: 'Keyword discovery, search volume and CPC analysis',
      },
      {
        id: 'seo-rankings',
        label: 'Rank Tracking',
        href: '/admin/seo/rankings',
        icon: TrendingUp,
        sectionId: 'seo',
        sectionLabel: 'SEO & Marketing',
        description: 'Google ranking positions for target keywords across regions',
      },
      {
        id: 'seo-audit',
        label: 'Technical SEO Audit',
        href: '/admin/seo/audit',
        icon: CheckCheck,
        sectionId: 'seo',
        sectionLabel: 'SEO & Marketing',
        description: 'Core Web Vitals, crawl errors, broken links and SSL',
      },
      {
        id: 'seo-backlinks',
        label: 'Backlink Management',
        href: '/admin/seo/backlinks',
        icon: Link2,
        sectionId: 'seo',
        sectionLabel: 'SEO & Marketing',
        description: 'Inbound referral domains, link authority and anchor text',
      },
      {
        id: 'seo-content',
        label: 'Content Management',
        href: '/admin/seo/content',
        icon: FolderGit2,
        sectionId: 'seo',
        sectionLabel: 'SEO & Marketing',
        description: 'Editorial blog posts, guides, landing copy and CMS',
      },
      {
        id: 'seo-sitemap',
        label: 'Sitemap Management',
        href: '/admin/seo/sitemap',
        icon: Network,
        sectionId: 'seo',
        sectionLabel: 'SEO & Marketing',
        description: 'XML sitemap generator, indexnow pings and robots.txt',
      },
      {
        id: 'seo-redirects',
        label: 'Redirect Manager',
        href: '/admin/seo/redirects',
        icon: CornerDownRight,
        sectionId: 'seo',
        sectionLabel: 'SEO & Marketing',
        description: '301 permanent and 302 temporary URL redirect rules',
      },
      {
        id: 'seo-search-console',
        label: 'Search Console',
        href: '/admin/seo/search-console',
        icon: BarChart3,
        sectionId: 'seo',
        sectionLabel: 'SEO & Marketing',
        description: 'Google Search Console query impressions and click-throughs',
      },
      {
        id: 'seo-performance',
        label: 'Performance Monitoring',
        href: '/admin/seo/performance',
        icon: Gauge,
        sectionId: 'seo',
        sectionLabel: 'SEO & Marketing',
        description: 'Lighthouse audits, TTFB and page speed benchmark metrics',
      },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics & Business',
    items: [
      {
        id: 'analytics-platform',
        label: 'Platform Analytics',
        href: '/admin/analytics',
        icon: LineChart,
        sectionId: 'analytics',
        sectionLabel: 'Analytics & Business',
        description: 'Overall platform usage, user growth and retention rates',
      },
      {
        id: 'analytics-website',
        label: 'Website Analytics',
        href: '/admin/analytics/website',
        icon: MousePointerClick,
        sectionId: 'analytics',
        sectionLabel: 'Analytics & Business',
        description: 'Marketing website bounce rates, pageviews and referrers',
      },
      {
        id: 'analytics-app',
        label: 'App Analytics',
        href: '/admin/analytics/app',
        icon: TabletSmartphone,
        sectionId: 'analytics',
        sectionLabel: 'Analytics & Business',
        description: 'Mobile session frequency, app crash reports and DAU/MAU',
      },
      {
        id: 'analytics-revenue',
        label: 'Revenue',
        href: '/admin/revenue',
        icon: DollarSign,
        sectionId: 'analytics',
        sectionLabel: 'Analytics & Business',
        description: 'Monthly recurring revenue (MRR), hardware sales and payouts',
      },
      {
        id: 'analytics-subscriptions',
        label: 'Subscriptions',
        href: '/admin/subscriptions',
        icon: CreditCard,
        sectionId: 'analytics',
        sectionLabel: 'Analytics & Business',
        description: 'Tapfolio Pro tiers, renewal statuses and churn metrics',
      },
      {
        id: 'analytics-conversions',
        label: 'Conversion Analytics',
        href: '/admin/analytics/conversions',
        icon: Percent,
        sectionId: 'analytics',
        sectionLabel: 'Analytics & Business',
        description: 'Funnel drop-off rates from visitor to registered profile',
      },
    ],
  },
  {
    id: 'communication',
    label: 'Communication',
    items: [
      {
        id: 'comm-support',
        label: 'Support Tickets',
        href: '/admin/support',
        icon: Headphones,
        sectionId: 'communication',
        sectionLabel: 'Communication',
        description: 'Customer help desk tickets, responses and resolution times',
      },
      {
        id: 'comm-reports',
        label: 'Reviews & Complaints',
        href: '/admin/reports',
        icon: AlertTriangle,
        sectionId: 'communication',
        sectionLabel: 'Communication',
        description: 'User feedback, flagged reviews and portfolio complaints',
      },
      {
        id: 'comm-notifications',
        label: 'Notifications',
        href: '/admin/notifications',
        icon: Bell,
        sectionId: 'communication',
        sectionLabel: 'Communication',
        description: 'Push notifications dispatch to iOS and Android devices',
      },
      {
        id: 'comm-broadcast',
        label: 'Broadcast Centre',
        href: '/admin/broadcast',
        icon: Radio,
        sectionId: 'communication',
        sectionLabel: 'Communication',
        description: 'Platform-wide banner announcements and maintenance alerts',
      },
      {
        id: 'comm-campaigns',
        label: 'Email Campaigns',
        href: '/admin/campaigns',
        icon: Mail,
        sectionId: 'communication',
        sectionLabel: 'Communication',
        description: 'Automated newsletter delivery and onboarding email series',
      },
    ],
  },
  {
    id: 'system',
    label: 'System',
    items: [
      {
        id: 'system-logs',
        label: 'Activity Logs',
        href: '/admin/logs',
        icon: ScrollText,
        sectionId: 'system',
        sectionLabel: 'System',
        description: 'Audit trail of administrative actions and security events',
      },
      {
        id: 'system-security',
        label: 'Security',
        href: '/admin/security',
        icon: ShieldCheck,
        sectionId: 'system',
        sectionLabel: 'System',
        description: 'Threat detection, CSRF guards, HMAC validator and IP bans',
      },
      {
        id: 'system-integrations',
        label: 'API Integrations',
        href: '/admin/integrations',
        icon: Cpu,
        sectionId: 'system',
        sectionLabel: 'System',
        description: 'Stripe, Razorpay, Resend, Firebase and external webhooks',
      },
      {
        id: 'system-roles',
        label: 'Admin Roles & Permissions',
        href: '/admin/roles',
        icon: Lock,
        sectionId: 'system',
        sectionLabel: 'System',
        description: 'Role-based access control (RBAC) and team privileges',
      },
      {
        id: 'system-settings',
        label: 'Settings',
        href: '/admin/settings',
        icon: Settings,
        sectionId: 'system',
        sectionLabel: 'System',
        description: 'Global site configuration, domain settings and brand config',
      },
    ],
  },
];

/**
 * Normalizes a URL path by removing trailing slashes, query params, and hash fragments.
 * Special case: '/admin' is normalized to '/admin/dashboard'.
 */
export function normalizePath(rawPath: string): string {
  if (!rawPath) return '';
  // Strip query string and hash
  const cleanPath = rawPath.split('?')[0].split('#')[0].trim();
  // Remove trailing slashes
  const trimmed = cleanPath.replace(/\/+$/, '') || '/';
  if (trimmed === '/admin') {
    return '/admin/dashboard';
  }
  return trimmed;
}

/**
 * Finds the EXACT single leaf navigation item matching the current pathname.
 *
 * Matching Priority:
 * 1. Exact Match: pathname === item.href (or matches one of its registered aliases).
 * 2. Segment-Aware Subroute Match (Longest Prefix Match):
 *    If pathname starts with item.href + '/' (ensuring segment boundaries),
 *    the item with the longest href is chosen.
 *
 * Guaranteed Behavior:
 * - Sibling routes under common parent prefixes (e.g. /admin/crm and /admin/crm/leads)
 *   will NEVER highlight simultaneously.
 * - Unknown routes will return null and will NOT accidentally highlight unrelated items.
 */
export function getActiveNavItem(pathname: string): NavItem | null {
  if (!pathname) return null;
  const path = normalizePath(pathname);

  // 1. Direct exact match check
  for (const section of NAV_SECTIONS) {
    for (const item of section.items) {
      if (normalizePath(item.href) === path) {
        return item;
      }
      if (item.aliases) {
        for (const alias of item.aliases) {
          if (normalizePath(alias) === path) {
            return item;
          }
        }
      }
    }
  }

  // 2. Segment-aware subroute match (Longest Prefix Match)
  // For nested dynamic detail pages like /admin/users/123 or /admin/crm/leads/lead_xyz
  let bestMatch: NavItem | null = null;
  let bestMatchLength = 0;

  for (const section of NAV_SECTIONS) {
    for (const item of section.items) {
      const itemPath = normalizePath(item.href);
      // Ensure segment boundary: path must start with itemPath + '/'
      if (path.startsWith(itemPath + '/')) {
        if (itemPath.length > bestMatchLength) {
          bestMatch = item;
          bestMatchLength = itemPath.length;
        }
      }

      // Check aliases for segment prefix match
      if (item.aliases) {
        for (const alias of item.aliases) {
          const aliasPath = normalizePath(alias);
          if (path.startsWith(aliasPath + '/')) {
            if (aliasPath.length > bestMatchLength) {
              bestMatch = item;
              bestMatchLength = aliasPath.length;
            }
          }
        }
      }
    }
  }

  return bestMatch;
}

/**
 * Returns true if and only if the given item is the single active leaf item.
 */
export function isNavItemActive(item: NavItem, activeItem: NavItem | null): boolean {
  if (!activeItem) return false;
  return activeItem.id === item.id;
}

/**
 * Returns the section containing the active item.
 */
export function getActiveSection(pathname: string): NavSection | null {
  const activeItem = getActiveNavItem(pathname);
  if (!activeItem) return null;
  return NAV_SECTIONS.find((s) => s.id === activeItem.sectionId) || null;
}

/**
 * Returns breadcrumbs for the current pathname.
 */
export function getBreadcrumbs(pathname: string): { label: string; href?: string }[] {
  const activeItem = getActiveNavItem(pathname);
  if (!activeItem) {
    return [{ label: 'Admin', href: '/admin/dashboard' }];
  }

  return [
    { label: activeItem.sectionLabel },
    { label: activeItem.label, href: activeItem.href },
  ];
}

/**
 * All navigation items flattened for quick search and keyboard switcher.
 */
export const ALL_NAV_ITEMS: NavItem[] = NAV_SECTIONS.flatMap((section) => section.items);
