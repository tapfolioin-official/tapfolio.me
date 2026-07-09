'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { ROUTES } from '@/config/routes';
import styles from './Header.module.css';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

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
        </nav>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          Sign Out
        </button>
      </div>
    </header>
  );
}
