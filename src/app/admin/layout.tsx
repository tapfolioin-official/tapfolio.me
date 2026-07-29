'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './admin.module.css';

const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [
      { icon: '📊', label: 'Dashboard', href: '/admin/dashboard' },
      { icon: '🟢', label: 'Live Users', href: '/admin/live' },
    ],
  },
  {
    label: 'Users',
    items: [
      { icon: '👥', label: 'User Management', href: '/admin/users' },
      { icon: '🖼️', label: 'Portfolios', href: '/admin/portfolios' },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { icon: '📈', label: 'Analytics', href: '/admin/analytics' },
      { icon: '💰', label: 'Revenue', href: '/admin/revenue' },
    ],
  },
  {
    label: 'Communication',
    items: [
      { icon: '💬', label: 'Support', href: '/admin/support' },
      { icon: '🚨', label: 'Reports', href: '/admin/reports' },
      { icon: '📢', label: 'Broadcast', href: '/admin/broadcast' },
    ],
  },
  {
    label: 'System',
    items: [
      { icon: '📝', label: 'Activity Logs', href: '/admin/logs' },
      { icon: '🔒', label: 'Security', href: '/admin/security' },
      { icon: '💼', label: 'Careers', href: '/admin/careers' },
      { icon: '⚙️', label: 'Settings', href: '/admin/settings' },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Developer Control Center pages have their own layout — don't wrap them
  const devRoutes = ['/admin/control-center', '/admin/connections', '/admin/releases'];
  const isDevRoute = devRoutes.some((r) => pathname === r || pathname.startsWith(r + '/'));
  if (isDevRoute) {
    return <>{children}</>;
  }

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.brand}>
            <span>Tapfolio</span> Admin
            <span className={styles.brandBadge}>OS</span>
          </div>
        </div>

        <nav className={styles.sidebarNav}>
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className={styles.navSection}>
              <div className={styles.navSectionLabel}>{section.label}</div>
              {section.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={isActive ? styles.navItemActive : styles.navItem}
                  >
                    <span className={styles.navIcon}>{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        <header className={styles.topbar}>
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              className={styles.searchInput}
              placeholder="Search users, portfolios, tickets..."
              type="text"
            />
          </div>
          <div className={styles.topbarActions}>
            <button className={styles.topbarBtn} title="Notifications">🔔</button>
            <button className={styles.topbarBtn} title="Refresh">🔄</button>
            <div className={styles.adminAvatar}>N</div>
          </div>
        </header>
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
}
