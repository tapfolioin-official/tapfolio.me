'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ROUTES } from '@/config/routes';
import { Menu, X, LogOut, LayoutDashboard, Users, History, Trophy } from 'lucide-react';
import styles from './Header.module.css';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST' });
      if (res.ok) {
        router.push(ROUTES.LOGIN);
        router.refresh();
      }
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href={ROUTES.DASHBOARD} className={styles.logo} style={{ display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '4px' }}>
            <path d="M5 14C6.10457 14 7 13.1046 7 12C7 10.8954 6.10457 10 5 10C3.89543 10 3 10.8954 3 12C3 13.1046 3.89543 14 5 14Z" fill="#60A5FA"/>
            <path d="M9 8C11.2091 8 13 9.79086 13 12C13 14.2091 11.2091 16 9 16" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M13 4C17.4183 4 21 7.58172 21 12C21 16.4183 17.4183 20 13 20" stroke="#2563EB" strokeWidth="3" strokeLinecap="round"/>
          </svg>
          <div style={{ color: '#020b2d' }}>Tap<span style={{ color: '#2563EB', fontWeight: 800 }}>folio</span></div>
        </Link>

        {/* Navigation bar with all 5 buttons included on mobile & desktop */}
        <nav className={styles.nav}>
          <Link href={ROUTES.DASHBOARD} className={`${styles.link} ${pathname === ROUTES.DASHBOARD ? styles.active : ''}`}>
            Dashboard
          </Link>
          <Link href={ROUTES.CONNECTIONS} className={`${styles.link} ${pathname === ROUTES.CONNECTIONS ? styles.active : ''}`}>
            Connections
          </Link>
          <Link href={ROUTES.HISTORY} className={`${styles.link} ${pathname === ROUTES.HISTORY ? styles.active : ''}`}>
            Logs
          </Link>
          <Link href={ROUTES.LEADERBOARD} className={`${styles.link} ${pathname === ROUTES.LEADERBOARD ? styles.active : ''}`}>
            Leaderboard
          </Link>
          <button onClick={handleLogout} className={`${styles.link} ${styles.logoutNavBtn}`}>
            Sign Out
          </button>
        </nav>

        {/* Desktop Sign Out Button */}
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Sign Out
        </button>

        {/* Mobile Hamburger Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={styles.mobileMenuToggle}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className={styles.mobileDrawer}>
          <div className={styles.mobileDrawerLinks}>
            <Link
              href={ROUTES.DASHBOARD}
              onClick={() => setMobileMenuOpen(false)}
              className={`${styles.mobileDrawerLink} ${pathname === ROUTES.DASHBOARD ? styles.activeMobile : ''}`}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </Link>
            <Link
              href={ROUTES.CONNECTIONS}
              onClick={() => setMobileMenuOpen(false)}
              className={`${styles.mobileDrawerLink} ${pathname === ROUTES.CONNECTIONS ? styles.activeMobile : ''}`}
            >
              <Users size={18} />
              <span>Connections</span>
            </Link>
            <Link
              href={ROUTES.HISTORY}
              onClick={() => setMobileMenuOpen(false)}
              className={`${styles.mobileDrawerLink} ${pathname === ROUTES.HISTORY ? styles.activeMobile : ''}`}
            >
              <History size={18} />
              <span>Logs</span>
            </Link>
            <Link
              href={ROUTES.LEADERBOARD}
              onClick={() => setMobileMenuOpen(false)}
              className={`${styles.mobileDrawerLink} ${pathname === ROUTES.LEADERBOARD ? styles.activeMobile : ''}`}
            >
              <Trophy size={18} />
              <span>Leaderboard</span>
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className={styles.mobileDrawerLogoutBtn}
            >
              <LogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
